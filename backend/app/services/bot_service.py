from sqlalchemy.orm import Session
from app.models.bot import BotAccount
from app.schemas.bot import BotScanRequest
import random

class BotService:
    @staticmethod
    def get_all_bots(db: Session, flagged_only: bool = False):
        query = db.query(BotAccount)
        if flagged_only:
            query = query.filter(BotAccount.is_flagged == True)
        return query.order_by(BotAccount.bot_score.desc()).all()

    @staticmethod
    def get_stats(db: Session):
        all_bots = db.query(BotAccount).all()
        flagged = [b for b in all_bots if b.is_flagged]
        avg_score = sum(b.bot_score for b in all_bots) / len(all_bots) if all_bots else 0
        networks = len(set(b.coordinated_network_id for b in all_bots if b.coordinated_network_id))

        return {
            "total_scanned": len(all_bots),
            "flagged_bots_count": len(flagged),
            "avg_bot_score": round(avg_score, 1),
            "active_bot_networks": networks,
            "top_flagged_accounts": flagged[:10]
        }

    @staticmethod
    def scan_account(db: Session, request: BotScanRequest) -> BotAccount:
        # Check if already scanned
        existing = db.query(BotAccount).filter(BotAccount.username.ilike(request.username)).first()
        if existing:
            return existing

        # Heuristic calculation for hackathon demo scanning
        username = request.username.strip()
        has_digits = sum(c.isdigit() for c in username) >= 3
        is_bot_likely = has_digits or "bot" in username.lower() or "alert" in username.lower() or "crypto" in username.lower()
        
        bot_score = round(random.uniform(75.0, 98.5), 1) if is_bot_likely else round(random.uniform(5.0, 35.0), 1)
        is_flagged = bot_score >= 60.0

        patterns = []
        if has_digits:
            patterns.append("Random generated username suffix")
        if bot_score > 70:
            patterns.append("Burst posting anomaly")
            patterns.append("High follower-to-following skew")
        else:
            patterns.append("Organic posting cadence")

        new_bot = BotAccount(
            username=username if username.startswith("@") else f"@{username}",
            platform=request.platform or "Twitter/X",
            bot_score=bot_score,
            is_flagged=is_flagged,
            followers_count=random.randint(1, 150) if is_flagged else random.randint(500, 10000),
            following_count=random.randint(2000, 5000) if is_flagged else random.randint(100, 800),
            posts_frequency_per_hr=round(random.uniform(30.0, 90.0), 1) if is_flagged else round(random.uniform(0.5, 3.0), 1),
            account_age_days=random.randint(1, 30) if is_flagged else random.randint(100, 1500),
            coordinated_network_id="NET-SUSPECT-NEW" if is_flagged else None,
            suspicious_patterns=", ".join(patterns)
        )

        db.add(new_bot)
        db.commit()
        db.refresh(new_bot)
        return new_bot
