from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime
from app.schemas.post import PostResponse

class TrendTopicBase(BaseModel):
    hashtag: str
    volume: int
    sentiment_positive: float
    sentiment_neutral: float
    sentiment_negative: float
    misinformation_risk: str
    risk_score: float
    category: str

class TrendTopicCreate(TrendTopicBase):
    pass

class TrendTopicResponse(TrendTopicBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class GeoHeatmapPoint(BaseModel):
    region: str
    latitude: float
    longitude: float
    post_count: int
    high_risk_count: int
    average_sentiment_score: float
    dominant_topic: str

class GeoActivityResponse(BaseModel):
    id: int
    region: str
    country_code: str
    latitude: float
    longitude: float
    anomaly_score: float
    active_threats_count: int
    primary_topic: str
    timestamp: datetime

    class Config:
        from_attributes = True

class SentimentOverview(BaseModel):
    positive: int
    neutral: int
    negative: int
    positive_pct: float
    neutral_pct: float
    negative_pct: float

class TrendOverviewResponse(BaseModel):
    total_analyzed_posts: int
    active_hashtags_count: int
    average_sentiment: dict
    high_risk_topics: List[TrendTopicResponse]
    geo_hotspots: List[GeoActivityResponse]

class DashboardAnalyticsResponse(BaseModel):
    total_posts: int
    flagged_posts_count: int
    threat_level: str
    sentiment_overview: SentimentOverview
    top_topics: List[Dict[str, int]]
    platform_breakdown: Dict[str, int]
    geo_heatmaps: List[GeoHeatmapPoint]
    recent_flagged_posts: List[PostResponse]
