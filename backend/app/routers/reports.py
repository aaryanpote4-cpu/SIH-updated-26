from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.report import AnalyticsReportResponse, ReportGenerateRequest, DetailedDossierResponse
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["Intelligence Reports"])

@router.get("", response_model=List[AnalyticsReportResponse], summary="List all generated threat & analytics reports")
def get_reports(db: Session = Depends(get_db)):
    return ReportService.get_all_reports(db)

@router.get("/generate", response_model=DetailedDossierResponse, summary="Compile and generate a comprehensive intelligence dossier on a narrative/topic")
def generate_dossier_get(
    topic: Optional[str] = Query(None, description="Topic/Hashtag to analyze e.g. #BankingScam, #UPSCProtest, #BoycottECommerce"),
    db: Session = Depends(get_db)
):
    return ReportService.generate_dossier(db, topic=topic)

@router.get("/generate/html", summary="Generate a printable/PDF-ready HTML intelligence dossier")
def generate_dossier_html(
    topic: Optional[str] = Query(None, description="Topic/Hashtag to analyze"),
    db: Session = Depends(get_db)
):
    dossier = ReportService.generate_dossier(db, topic=topic)
    html_content = ReportService.generate_html_report(dossier)
    return Response(content=html_content, media_type="text/html")

@router.post("/generate", response_model=DetailedDossierResponse, summary="Synthesize a new intelligence dossier via POST request")
def generate_dossier_post(
    request: ReportGenerateRequest,
    db: Session = Depends(get_db)
):
    return ReportService.generate_dossier(db, topic=request.topic or request.title)

@router.get("/{report_id}", response_model=AnalyticsReportResponse, summary="Get details of a specific historical report")
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = ReportService.get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
