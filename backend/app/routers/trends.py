from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Any

from app.core.database import get_db
from app.models import Post
from app.schemas import GeoHeatmapPoint, DashboardAnalyticsResponse, SentimentOverview, PostResponse
from app.services.analyzer import ThreatAnalyzerService

router = APIRouter(prefix="/trends", tags=["Trends & Geospatial Analytics"])

@router.get("", summary="Get active trending topics with post counts and sentiment")
def get_trending_topics(db: Session = Depends(get_db)):
    # Group posts by topic
    topics_query = (
        db.query(
            Post.topic,
            func.count(Post.id).label("total_posts"),
            func.sum(case_flagged()).label("flagged_count"),
            func.avg(Post.sentiment_score).label("avg_sentiment")
        )
        .group_by(Post.topic)
        .order_by(desc("total_posts"))
        .all()
    )

    result = []
    for topic, total, flagged, avg_sent in topics_query:
        # Determine topic risk
        risk_pct = (flagged / total * 100) if total else 0
        risk_level = "High" if risk_pct > 40 else ("Medium" if risk_pct > 15 else "Low")

        result.append({
            "topic": topic,
            "total_posts": total,
            "flagged_posts": flagged or 0,
            "risk_percentage": round(risk_pct, 1),
            "risk_level": risk_level,
            "avg_sentiment_score": round(avg_sent or 0.0, 2)
        })

    return result

@router.get("/heatmap", response_model=List[GeoHeatmapPoint], summary="Get Indian regional heatmap coordinates and threat density")
def get_geo_heatmap(db: Session = Depends(get_db)):
    regions_query = (
        db.query(
            Post.region,
            func.count(Post.id).label("post_count"),
            func.sum(case_flagged()).label("high_risk_count"),
            func.avg(Post.sentiment_score).label("avg_sentiment")
        )
        .group_by(Post.region)
        .order_by(desc("post_count"))
        .all()
    )

    heatmaps = []
    for region, p_count, h_count, avg_sent in regions_query:
        coords = ThreatAnalyzerService.get_coordinates_for_region(region)
        
        # Find dominant topic in this region
        top_topic = (
            db.query(Post.topic)
            .filter(Post.region == region)
            .group_by(Post.topic)
            .order_by(desc(func.count(Post.id)))
            .first()
        )
        dominant = top_topic[0] if top_topic else "General"

        heatmaps.append(
            GeoHeatmapPoint(
                region=region,
                latitude=coords[0],
                longitude=coords[1],
                post_count=p_count,
                high_risk_count=h_count or 0,
                average_sentiment_score=round(avg_sent or 0.0, 2),
                dominant_topic=dominant
            )
        )

    return heatmaps

@router.get("/analytics", response_model=DashboardAnalyticsResponse, summary="Get full dashboard summary analytics")
def get_dashboard_analytics(db: Session = Depends(get_db)):
    total_posts = db.query(Post).count()
    flagged_posts = db.query(Post).filter(Post.is_flagged == True).count()

    # Sentiment distribution
    pos_count = db.query(Post).filter(Post.sentiment == "Positive").count()
    neu_count = db.query(Post).filter(Post.sentiment == "Neutral").count()
    neg_count = db.query(Post).filter(Post.sentiment == "Negative").count()

    total_valid = max(total_posts, 1)
    sentiment_overview = SentimentOverview(
        positive=pos_count,
        neutral=neu_count,
        negative=neg_count,
        positive_pct=round((pos_count / total_valid) * 100, 1),
        neutral_pct=round((neu_count / total_valid) * 100, 1),
        negative_pct=round((neg_count / total_valid) * 100, 1)
    )

    # Top Topics
    topics_query = (
        db.query(Post.topic, func.count(Post.id).label("count"))
        .group_by(Post.topic)
        .order_by(desc("count"))
        .limit(6)
        .all()
    )
    top_topics = [{"topic": t, "count": c} for t, c in topics_query]

    # Platform breakdown
    platform_query = db.query(Post.platform, func.count(Post.id)).group_by(Post.platform).all()
    platform_breakdown = {p: c for p, c in platform_query}

    # Heatmaps
    heatmap_data = get_geo_heatmap(db)

    # Recent flagged posts
    recent_flagged = (
        db.query(Post)
        .filter(Post.is_flagged == True)
        .order_by(desc(Post.timestamp))
        .limit(6)
        .all()
    )

    threat_level = "Severe" if flagged_posts > 20 else ("High" if flagged_posts > 10 else "Moderate")

    return DashboardAnalyticsResponse(
        total_posts=total_posts,
        flagged_posts_count=flagged_posts,
        threat_level=threat_level,
        sentiment_overview=sentiment_overview,
        top_topics=top_topics,
        platform_breakdown=platform_breakdown,
        geo_heatmaps=heatmap_data,
        recent_flagged_posts=recent_flagged
    )

def case_flagged():
    from sqlalchemy import case
    return case((Post.is_flagged == True, 1), else_=0)
