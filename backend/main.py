from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.routers import (
    posts_router,
    trends_router,
    bots_router,
    links_router,
    reports_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite tables on startup
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed mock data (50+ Indian posts, bot profiles, threat links)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
        
    yield

# FastAPI Application Instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Tech Netra - AI Social Media Cyber Threat & Misinformation Detection Platform API",
    lifespan=lifespan
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modular API Routers Registration
app.include_router(posts_router, prefix=settings.API_V1_STR)
app.include_router(trends_router, prefix=settings.API_V1_STR)
app.include_router(bots_router, prefix=settings.API_V1_STR)
app.include_router(links_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["System"])
def root():
    return {
        "platform": "Tech Netra",
        "status": "operational",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "endpoints": [
            f"{settings.API_V1_STR}/posts",
            f"{settings.API_V1_STR}/trends",
            f"{settings.API_V1_STR}/trends/heatmap",
            f"{settings.API_V1_STR}/trends/analytics",
            f"{settings.API_V1_STR}/bots",
            f"{settings.API_V1_STR}/bots/stats",
            f"{settings.API_V1_STR}/links",
            f"{settings.API_V1_STR}/links/stats",
            f"{settings.API_V1_STR}/reports"
        ]
    }

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
