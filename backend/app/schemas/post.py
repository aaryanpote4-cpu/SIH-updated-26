from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

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
