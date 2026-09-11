from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from datetime import datetime
from app.core.database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, default="X", index=True) # X, Instagram, Telegram, YouTube
    username = Column(String, index=True, nullable=False)
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    region = Column(String, index=True, nullable=False) # e.g. Delhi, Maharashtra, Karnataka
    latitude = Column(Float, nullable=False, default=20.5937)
    longitude = Column(Float, nullable=False, default=78.9629)
    likes = Column(Integer, default=0)
    retweets = Column(Integer, default=0)
    sentiment = Column(String, default="Neutral") # Positive, Neutral, Negative
    sentiment_score = Column(Float, default=0.0) # -1.0 to 1.0
    risk_level = Column(String, default="Low", index=True) # Low, Medium, High
    is_flagged = Column(Boolean, default=False, index=True)
    topic = Column(String, default="General", index=True)
