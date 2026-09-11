from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

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

# Alias for backward compatibility
ScannedLinkResponse = LinkScanResponse

class LinkStatsResponse(BaseModel):
    total_scanned: int
    phishing_count: int
    malware_count: int
    clean_count: int
    recent_scans: List[LinkScanResponse]
