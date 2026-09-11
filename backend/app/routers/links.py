from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from app.core.database import get_db
from app.models import LinkScan
from app.schemas import LinkScanResponse, LinkScanRequest, LinkStatsResponse
from app.services.analyzer import ThreatAnalyzerService

router = APIRouter(prefix="/links", tags=["Malicious Links & Phishing Scanner"])

@router.get("", response_model=List[LinkScanResponse], summary="List all scanned URLs and verdicts")
def get_scanned_links(
    threat_type: Optional[str] = Query(None, description="Filter by threat (Phishing, Malware, Clean)"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(LinkScan)
    if threat_type:
        query = query.filter(LinkScan.threat_type.ilike(threat_type))
    return query.order_by(desc(LinkScan.scanned_at)).limit(limit).all()

@router.get("/stats", response_model=LinkStatsResponse, summary="Get summary statistics on scanned links")
def get_link_stats(db: Session = Depends(get_db)):
    all_links = db.query(LinkScan).all()
    phishing = [l for l in all_links if l.threat_type == "Phishing"]
    malware = [l for l in all_links if l.threat_type == "Malware"]
    clean = [l for l in all_links if l.threat_type == "Clean"]

    recent = (
        db.query(LinkScan)
        .order_by(desc(LinkScan.scanned_at))
        .limit(10)
        .all()
    )

    return LinkStatsResponse(
        total_scanned=len(all_links),
        phishing_count=len(phishing),
        malware_count=len(malware),
        clean_count=len(clean),
        recent_scans=recent
    )

@router.post("/scan", response_model=LinkScanResponse, status_code=status.HTTP_200_OK, summary="Scan a URL for phishing, malware, and brand spoofing")
def scan_url_endpoint(payload: LinkScanRequest, db: Session = Depends(get_db)):
    url_clean = payload.url.strip()
    if not url_clean:
        raise HTTPException(status_code=400, detail="URL cannot be empty")

    # Check if this exact URL was already scanned
    existing = db.query(LinkScan).filter(LinkScan.url == url_clean).first()
    if existing:
        return existing

    # Perform heuristic and rule-based scanning
    analysis = ThreatAnalyzerService.scan_url(url_clean)

    new_scan = LinkScan(
        url=analysis["url"],
        domain=analysis["domain"],
        threat_type=analysis["threat_type"],
        confidence_score=analysis["confidence_score"],
        risk_factors=analysis["risk_factors"],
        redirect_count=analysis["redirect_count"]
    )

    db.add(new_scan)
    db.commit()
    db.refresh(new_scan)
    return new_scan
