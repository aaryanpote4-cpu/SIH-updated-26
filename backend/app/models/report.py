from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.core.database import Base

class AnalyticsReport(Base):
    __tablename__ = "analytics_reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    threat_level = Column(String, default="Moderate") # Low, Moderate, High, Severe
    total_bots_flagged = Column(Integer, default=0)
    total_phishing_detected = Column(Integer, default=0)
    top_misinfo_narratives = Column(Text, default="")
    actionable_recommendations = Column(Text, default="")
    generated_at = Column(DateTime, default=datetime.utcnow)
