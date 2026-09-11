from sqlalchemy.orm import Session
from app.models.trend import TrendTopic, GeoActivity
from typing import List, Dict, Any

class TrendService:
    @staticmethod
    def get_all_trends(db: Session) -> List[TrendTopic]:
        return db.query(TrendTopic).order_by(TrendTopic.volume.desc()).all()

    @staticmethod
    def get_geo_hotspots(db: Session) -> List[GeoActivity]:
        return db.query(GeoActivity).order_by(GeoActivity.anomaly_score.desc()).all()

    @staticmethod
    def get_overview(db: Session) -> Dict[str, Any]:
        trends = db.query(TrendTopic).all()
        geo = db.query(GeoActivity).all()
        
        total_volume = sum(t.volume for t in trends)
        avg_pos = sum(t.sentiment_positive for t in trends) / len(trends) if trends else 0
        avg_neu = sum(t.sentiment_neutral for t in trends) / len(trends) if trends else 0
        avg_neg = sum(t.sentiment_negative for t in trends) / len(trends) if trends else 0
        
        high_risk = [t for t in trends if t.risk_score >= 70.0]

        return {
            "total_analyzed_posts": total_volume,
            "active_hashtags_count": len(trends),
            "average_sentiment": {
                "positive": round(avg_pos, 1),
                "neutral": round(avg_neu, 1),
                "negative": round(avg_neg, 1)
            },
            "high_risk_topics": high_risk,
            "geo_hotspots": geo
        }
