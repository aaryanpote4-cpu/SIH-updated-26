from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional

from app.core.database import get_db
from app.models import BotProfile
from app.schemas import BotProfileResponse, BotScanRequest, BotStatsResponse
from app.services.analyzer import ThreatAnalyzerService

router = APIRouter(prefix="/bots", tags=["Bot & Astroturf Detection"])

@router.get("", response_model=List[BotProfileResponse], summary="List monitored and flagged bot accounts")
def get_bots(
    flagged_only: bool = Query(False, description="Filter only flagged malicious accounts"),
    cluster: Optional[str] = Query(None, description="Filter by network cluster ID"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(BotProfile)
    if flagged_only:
        query = query.filter(BotProfile.is_flagged == True)
    if cluster:
        query = query.filter(BotProfile.network_cluster.ilike(f"%{cluster}%"))
    
    return query.order_by(desc(BotProfile.bot_probability)).limit(limit).all()

@router.get("/stats", response_model=BotStatsResponse, summary="Get summary statistics on bot networks and clusters")
def get_bot_stats(db: Session = Depends(get_db)):
    all_bots = db.query(BotProfile).all()
    flagged = [b for b in all_bots if b.is_flagged]
    
    avg_score = (sum(b.bot_probability for b in all_bots) / len(all_bots)) if all_bots else 0.0

    # Cluster grouping
    clusters_query = (
        db.query(BotProfile.network_cluster, func.count(BotProfile.id))
        .filter(BotProfile.network_cluster.isnot(None))
        .group_by(BotProfile.network_cluster)
        .all()
    )
    cluster_list = [{"cluster": name, "count": count} for name, count in clusters_query]

    top_flagged = (
        db.query(BotProfile)
        .filter(BotProfile.is_flagged == True)
        .order_by(desc(BotProfile.bot_probability))
        .limit(10)
        .all()
    )

    return BotStatsResponse(
        total_analyzed=len(all_bots),
        flagged_bots_count=len(flagged),
        average_bot_score=round(avg_score, 1),
        active_clusters_count=len(cluster_list),
        clusters=cluster_list,
        top_flagged_bots=top_flagged
    )

@router.post("/scan", response_model=BotProfileResponse, status_code=status.HTTP_200_OK, summary="Scan an account handle for bot activity")
def scan_account(payload: BotScanRequest, db: Session = Depends(get_db)):
    username_clean = payload.username.strip()
    if not username_clean.startswith("@"):
        username_clean = f"@{username_clean}"

    # Check if profile already exists in DB
    existing = db.query(BotProfile).filter(BotProfile.username.ilike(username_clean)).first()
    if existing:
        return existing

    # Perform heuristic bot analysis
    analysis = ThreatAnalyzerService.analyze_bot_profile(
        username=username_clean,
        followers=payload.followers_count,
        following=payload.following_count,
        posts_per_hr=payload.posts_frequency_per_hr,
        account_age_days=payload.account_age_days
    )

    new_bot = BotProfile(
        username=analysis["username"],
        platform=payload.platform or "X",
        followers_count=analysis["followers_count"],
        following_count=analysis["following_count"],
        posts_frequency_per_hr=analysis["posts_frequency_per_hr"],
        account_age_days=analysis["account_age_days"],
        bot_probability=analysis["bot_probability"],
        abnormal_patterns=analysis["abnormal_patterns"],
        network_cluster=analysis["network_cluster"],
        is_flagged=analysis["is_flagged"]
    )

    db.add(new_bot)
    db.commit()
    db.refresh(new_bot)
    return new_bot
