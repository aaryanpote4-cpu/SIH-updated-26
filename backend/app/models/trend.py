from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.core.database import Base

class TrendTopic(Base):
    __tablename__ = "trend_topics"

    id = Column(Integer, primary_key=True, index=True)
    hashtag = Column(String, index=True, nullable=False)
    volume = Column(Integer, default=0)
    sentiment_positive = Column(Float, default=0.0) # Percentage (0-100)
    sentiment_neutral = Column(Float, default=0.0)
    sentiment_negative = Column(Float, default=0.0)
    misinformation_risk = Column(String, default="Low") # Low, Medium, High, Critical
    risk_score = Column(Float, default=0.0) # 0-100
    category = Column(String, default="General")
    timestamp = Column(DateTime, default=datetime.utcnow)

class GeoActivity(Base):
    __tablename__ = "geo_activity"

    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, index=True, nullable=False)
    country_code = Column(String, default="IN")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    anomaly_score = Column(Float, default=0.0) # Bot/coordinated activity metric
    active_threats_count = Column(Integer, default=0)
    primary_topic = Column(String, default="")
    timestamp = Column(DateTime, default=datetime.utcnow)
