from app.routers.posts import router as posts_router
from app.routers.trends import router as trends_router
from app.routers.bots import router as bots_router
from app.routers.links import router as links_router
from app.routers.reports import router as reports_router

__all__ = ["posts_router", "trends_router", "bots_router", "links_router", "reports_router"]
