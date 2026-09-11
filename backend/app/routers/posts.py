from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from app.core.database import get_db
from app.models import Post
from app.schemas import PostResponse, PostCreate
from app.services.analyzer import ThreatAnalyzerService

router = APIRouter(prefix="/posts", tags=["Social Media Posts"])

@router.get("", response_model=List[PostResponse], summary="Retrieve and filter social media posts")
def get_posts(
    platform: Optional[str] = Query(None, description="Filter by platform (X, Instagram, Telegram, YouTube)"),
    region: Optional[str] = Query(None, description="Filter by Indian State/Region"),
    risk_level: Optional[str] = Query(None, description="Filter by risk (Low, Medium, High)"),
    sentiment: Optional[str] = Query(None, description="Filter by sentiment (Positive, Neutral, Negative)"),
    is_flagged: Optional[bool] = Query(None, description="Filter only flagged/misinformation posts"),
    topic: Optional[str] = Query(None, description="Filter by topic hashtag"),
    search: Optional[str] = Query(None, description="Search keyword in text or username"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Post)

    if platform:
        query = query.filter(Post.platform.ilike(platform))
    if region:
        query = query.filter(Post.region.ilike(region))
    if risk_level:
        query = query.filter(Post.risk_level.ilike(risk_level))
    if sentiment:
        query = query.filter(Post.sentiment.ilike(sentiment))
    if is_flagged is not None:
        query = query.filter(Post.is_flagged == is_flagged)
    if topic:
        query = query.filter(Post.topic.ilike(f"%{topic}%"))
    if search:
        query = query.filter((Post.text.ilike(f"%{search}%")) | (Post.username.ilike(f"%{search}%")))

    posts = query.order_by(desc(Post.timestamp)).offset(offset).limit(limit).all()
    return posts

@router.get("/{post_id}", response_model=PostResponse, summary="Get post by ID")
def get_post_by_id(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED, summary="Create and analyze a new social post")
def create_post(payload: PostCreate, db: Session = Depends(get_db)):
    # Perform automated NLP sentiment & risk analysis
    analysis = ThreatAnalyzerService.analyze_text(payload.text)
    
    # Geocoding fallback if coordinates not provided
    coords = (payload.latitude, payload.longitude)
    if coords[0] is None or coords[1] is None:
        coords = ThreatAnalyzerService.get_coordinates_for_region(payload.region)

    new_post = Post(
        platform=payload.platform,
        username=payload.username,
        text=payload.text,
        region=payload.region,
        latitude=coords[0],
        longitude=coords[1],
        likes=payload.likes or 0,
        retweets=payload.retweets or 0,
        sentiment=analysis["sentiment"],
        sentiment_score=analysis["sentiment_score"],
        risk_level=analysis["risk_level"],
        is_flagged=analysis["is_flagged"],
        topic=payload.topic or "General"
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post
