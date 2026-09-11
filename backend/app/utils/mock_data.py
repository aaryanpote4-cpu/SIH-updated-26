from sqlalchemy.orm import Session
from app.models.trend import TrendTopic, GeoActivity
from app.models.bot import BotAccount
from app.models.link import ScannedLink
from app.models.report import AnalyticsReport
from datetime import datetime, timedelta

def seed_database(db: Session):
    # Check if database is already seeded
    if db.query(TrendTopic).first():
        return

    # Seed Trends
    trends = [
        TrendTopic(
            hashtag="#CriticalInfraAlert",
            volume=84200,
            sentiment_positive=8.5,
            sentiment_neutral=22.0,
            sentiment_negative=69.5,
            misinformation_risk="High",
            risk_score=88.4,
            category="National Security"
        ),
        TrendTopic(
            hashtag="#BankingScamUpdate",
            volume=45300,
            sentiment_positive=12.0,
            sentiment_neutral=18.0,
            sentiment_negative=70.0,
            misinformation_risk="Critical",
            risk_score=94.2,
            category="Cyber Fraud"
        ),
        TrendTopic(
            hashtag="#DeepfakeCelebrityLeak",
            volume=128000,
            sentiment_positive=15.0,
            sentiment_neutral=35.0,
            sentiment_negative=50.0,
            misinformation_risk="High",
            risk_score=82.0,
            category="Synthetic Media"
        ),
        TrendTopic(
            hashtag="#Elections2026",
            volume=310000,
            sentiment_positive=34.0,
            sentiment_neutral=26.0,
            sentiment_negative=40.0,
            misinformation_risk="Medium",
            risk_score=54.5,
            category="Governance"
        ),
        TrendTopic(
            hashtag="#TechInnovationSummit",
            volume=62000,
            sentiment_positive=78.0,
            sentiment_neutral=17.0,
            sentiment_negative=5.0,
            misinformation_risk="Low",
            risk_score=12.0,
            category="Technology"
        )
    ]
    db.add_all(trends)

    # Seed Geo Hotspots
    geo_hotspots = [
        GeoActivity(region="New Delhi", country_code="IN", latitude=28.6139, longitude=77.2090, anomaly_score=84.2, active_threats_count=42, primary_topic="#BankingScamUpdate"),
        GeoActivity(region="Mumbai", country_code="IN", latitude=19.0760, longitude=72.8777, anomaly_score=78.5, active_threats_count=36, primary_topic="#CriticalInfraAlert"),
        GeoActivity(region="Bengaluru", country_code="IN", latitude=12.9716, longitude=77.5946, anomaly_score=32.0, active_threats_count=11, primary_topic="#TechInnovationSummit"),
        GeoActivity(region="Hyderabad", country_code="IN", latitude=17.3850, longitude=78.4867, anomaly_score=68.9, active_threats_count=27, primary_topic="#DeepfakeCelebrityLeak"),
        GeoActivity(region="Kolkata", country_code="IN", latitude=22.5726, longitude=88.3639, anomaly_score=62.4, active_threats_count=19, primary_topic="#Elections2026")
    ]
    db.add_all(geo_hotspots)

    # Seed Bot Accounts
    bots = [
        BotAccount(
            username="@bot_net_alpha_09",
            platform="Twitter/X",
            bot_score=96.4,
            is_flagged=True,
            followers_count=14,
            following_count=4900,
            posts_frequency_per_hr=85.2,
            account_age_days=3,
            coordinated_network_id="NET-KRAKEN-01",
            suspicious_patterns="High post frequency, Duplicate copypasta, Stock avatar"
        ),
        BotAccount(
            username="@alert_patriot_news99",
            platform="Twitter/X",
            bot_score=91.8,
            is_flagged=True,
            followers_count=320,
            following_count=1200,
            posts_frequency_per_hr=64.0,
            account_age_days=12,
            coordinated_network_id="NET-KRAKEN-01",
            suspicious_patterns="Synthetic sentiment amplification, Coordinated retweets"
        ),
        BotAccount(
            username="@crypto_fast_rewards",
            platform="Telegram",
            bot_score=88.5,
            is_flagged=True,
            followers_count=5,
            following_count=3200,
            posts_frequency_per_hr=42.5,
            account_age_days=8,
            coordinated_network_id="NET-PHISH-04",
            suspicious_patterns="Phishing link spam, AI text pattern match"
        ),
        BotAccount(
            username="@daily_tech_insight",
            platform="Twitter/X",
            bot_score=14.2,
            is_flagged=False,
            followers_count=15400,
            following_count=820,
            posts_frequency_per_hr=1.2,
            account_age_days=1240,
            coordinated_network_id=None,
            suspicious_patterns="Normal organic activity"
        )
    ]
    db.add_all(bots)

    # Seed Scanned Links
    links = [
        ScannedLink(
            url="http://secure-login-hdfc-kyc-update.xyz/verify",
            domain="secure-login-hdfc-kyc-update.xyz",
            is_phishing=True,
            is_malicious=True,
            risk_score=98.5,
            threat_category="Credential Phishing",
            redirect_chain_count=3,
            domain_age_days=2,
            ssl_valid=False
        ),
        ScannedLink(
            url="https://gov-portal-subsidy-claim-forms.online",
            domain="gov-portal-subsidy-claim-forms.online",
            is_phishing=True,
            is_malicious=True,
            risk_score=93.0,
            threat_category="Impersonation & Scam",
            redirect_chain_count=2,
            domain_age_days=5,
            ssl_valid=True
        ),
        ScannedLink(
            url="https://github.com/fastapi/fastapi",
            domain="github.com",
            is_phishing=False,
            is_malicious=False,
            risk_score=1.2,
            threat_category="Safe",
            redirect_chain_count=0,
            domain_age_days=5400,
            ssl_valid=True
        )
    ]
    db.add_all(links)

    # Seed Intelligence Reports
    report = AnalyticsReport(
        title="Threat Briefing: Coordinated Disinformation & KYC Phishing Surge",
        summary="A coordinated bot cluster (#NET-KRAKEN-01) with 40+ detected nodes is actively amplifying false banking security alerts in Mumbai and Delhi regions while disseminating fraudulent KYC verification links.",
        threat_level="High",
        total_bots_flagged=28,
        total_phishing_detected=14,
        top_misinfo_narratives="Emergency Bank Freeze Hoax, Fake Aadhaar-KYC mandates",
        actionable_recommendations="1. Blacklist domains matching '*-kyc-update.xyz'. 2. Issue public advisory via CERT-In on social media. 3. Escalate flagged bot nodes to platform Trust & Safety teams."
    )
    db.add(report)

    db.commit()
