from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from app.core.database import Base

class BotProfile(Base):
    __tablename__ = "bot_profiles"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    platform = Column(String, default="X")
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    posts_frequency_per_hr = Column(Float, default=0.0)
    account_age_days = Column(Integer, default=1)
    bot_probability = Column(Float, default=0.0) # 0 to 100%
    abnormal_patterns = Column(String, default="") # e.g. "high frequency posting", "burst retweets"
    network_cluster = Column(String, nullable=True, index=True)
    is_flagged = Column(Boolean, default=False)
    detected_at = Column(DateTime, default=datetime.utcnow)

# Alias for backward compatibility
BotAccount = BotProfile
