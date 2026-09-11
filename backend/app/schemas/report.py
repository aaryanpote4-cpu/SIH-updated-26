from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ReportGenerateRequest(BaseModel):
    title: Optional[str] = None
    topic: Optional[str] = None
    timeframe_hours: Optional[int] = 24

class BotClusterDetail(BaseModel):
    cluster_id: str
    node_count: int
    avg_bot_score: float
    sample_handles: List[str]
    coordination_type: str

class DeceptiveLinkDetail(BaseModel):
    url: str
    domain: str
    threat_type: str
    confidence_score: float
    risk_factors: str

class FlaggedPostSample(BaseModel):
    id: int
    platform: str
    username: str
    text: str
    region: str
    risk_level: str
    sentiment: str

class DetailedDossierResponse(BaseModel):
    reference_id: str
    title: str
    topic: str
    threat_level: str
    generated_at: datetime
    executive_summary: str
    sentiment_polarity: Dict[str, Any]
    total_posts_analyzed: int
    estimated_reach: int
    top_bot_clusters: List[BotClusterDetail]
    deceptive_links: List[DeceptiveLinkDetail]
    flagged_posts_sample: List[FlaggedPostSample]
    actionable_countermeasures: List[str]
    classification_banner: str = "CONFIDENTIAL // LAW ENFORCEMENT & SOC DIRECTIVE"

class AnalyticsReportResponse(BaseModel):
    id: int
    title: str
    summary: str
    threat_level: str
    total_bots_flagged: int
    total_phishing_detected: int
    top_misinfo_narratives: str
    actionable_recommendations: str
    generated_at: datetime

    class Config:
        from_attributes = True
