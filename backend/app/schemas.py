from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

# --- Post Schemas ---
class PostBase(BaseModel):
    platform: str = Field(..., description="Platform: X, Instagram, Telegram, YouTube")
    username: str
    text: str
    region: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    likes: Optional[int] = 0
    retweets: Optional[int] = 0
    topic: Optional[str] = "General"

class PostCreate(PostBase):
    pass

class PostResponse(BaseModel):
    id: int
    platform: str
    username: str
    text: str
    timestamp: datetime
    region: str
    latitude: float
    longitude: float
    likes: int
    retweets: int
    sentiment: str
    sentiment_score: float
    risk_level: str
    is_flagged: bool
    topic: str

    class Config:
        from_attributes = True

# --- Bot Profile Schemas ---
class BotScanRequest(BaseModel):
    username: str
    platform: Optional[str] = "X"
    followers_count: Optional[int] = None
    following_count: Optional[int] = None
    posts_frequency_per_hr: Optional[float] = None
    account_age_days: Optional[int] = None

class BotProfileResponse(BaseModel):
    id: int
    username: str
    platform: str
    followers_count: int
    following_count: int
    posts_frequency_per_hr: float
    account_age_days: int
    bot_probability: float
    abnormal_patterns: str
    network_cluster: Optional[str]
    is_flagged: bool
    detected_at: datetime

    class Config:
        from_attributes = True

class BotStatsResponse(BaseModel):
    total_analyzed: int
    flagged_bots_count: int
    average_bot_score: float
    active_clusters_count: int
    clusters: List[Dict[str, int]]
    top_flagged_bots: List[BotProfileResponse]

# --- Link Scan Schemas ---
class LinkScanRequest(BaseModel):
    url: str

class LinkScanResponse(BaseModel):
    id: int
    url: str
    domain: str
    threat_type: str # Phishing, Malware, Clean
    confidence_score: float
    risk_factors: str
    redirect_count: int
    scanned_at: datetime

    class Config:
        from_attributes = True

class LinkStatsResponse(BaseModel):
    total_scanned: int
    phishing_count: int
    malware_count: int
    clean_count: int
    recent_scans: List[LinkScanResponse]

# --- Analytics & Heatmap Schemas ---
class GeoHeatmapPoint(BaseModel):
    region: str
    latitude: float
    longitude: float
    post_count: int
    high_risk_count: int
    average_sentiment_score: float
    dominant_topic: str

class SentimentOverview(BaseModel):
    positive: int
    neutral: int
    negative: int
    positive_pct: float
    neutral_pct: float
    negative_pct: float

class DashboardAnalyticsResponse(BaseModel):
    total_posts: int
    flagged_posts_count: int
    threat_level: str
    sentiment_overview: SentimentOverview
    top_topics: List[Dict[str, int]]
    platform_breakdown: Dict[str, int]
    geo_heatmaps: List[GeoHeatmapPoint]
    recent_flagged_posts: List[PostResponse]
