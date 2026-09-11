from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from app.core.database import Base

class LinkScan(Base):
    __tablename__ = "link_scans"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True, nullable=False)
    domain = Column(String, index=True)
    threat_type = Column(String, default="Clean") # Phishing, Malware, Clean
    confidence_score = Column(Float, default=0.0) # 0 to 100%
    risk_factors = Column(String, default="") # Comma-separated triggers
    redirect_count = Column(Integer, default=0)
    scanned_at = Column(DateTime, default=datetime.utcnow)

# Alias for backward compatibility
ScannedLink = LinkScan
