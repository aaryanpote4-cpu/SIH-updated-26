from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

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
    network_cluster: Optional[str] = None
    is_flagged: bool
    detected_at: datetime

    class Config:
        from_attributes = True

# Alias for backward compatibility
BotAccountResponse = BotProfileResponse

class BotStatsResponse(BaseModel):
    total_analyzed: int
    flagged_bots_count: int
    average_bot_score: float
    active_clusters_count: int
    clusters: List[Dict[str, int]]
    top_flagged_bots: List[BotProfileResponse]
