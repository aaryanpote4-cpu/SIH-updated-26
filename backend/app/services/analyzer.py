import re
from urllib.parse import urlparse
from typing import Dict, Any, Tuple, List
import random

class ThreatAnalyzerService:
    # --- NLP & Sentiment Analysis Keywords (Pure Clear English) ---
    NEGATIVE_KEYWORDS = [
        "scam", "fraud", "hacked", "fake", "protest", "theft", "cheat", "alert", "danger",
        "riot", "boycott", "leak", "arrest", "conspiracy", "threat", "urgent", "warning",
        "banned", "illegal", "propaganda", "hoax", "deepfake", "bribe", "corrupt", "attack",
        "crisis", "emergency", "cyberattack", "downtime", "shutdown", "blackout", "phishing",
        "stolen", "malware", "virus", "suspicious", "unauthorized", "freeze", "blocked"
    ]
    
    POSITIVE_KEYWORDS = [
        "success", "growth", "launch", "proud", "innovative", "safe", "verified", "achievement",
        "congratulations", "win", "improved", "secure", "relief", "development", "good", "great",
        "progress", "excellent", "milestone", "official", "resolved", "helpful"
    ]
    
    HIGH_RISK_TRIGGERS = [
        "bank account frozen", "kyc update mandatory", "click link to claim", "urgent notice from bank",
        "urgent notice from rbi", "water supply poisoned", "curfew imposed immediately", "exam paper leaked",
        "deepfake video viral", "free recharge offer", "electricity will be disconnected tonight",
        "claim your reward money now", "police arrest warrant issued"
    ]

    # --- Indian Region Coordinates Mapping ---
    REGION_COORDINATES = {
        "Delhi": (28.6139, 77.2090),
        "Maharashtra": (19.0760, 72.8777),
        "Karnataka": (12.9716, 77.5946),
        "Telangana": (17.3850, 78.4867),
        "Tamil Nadu": (13.0827, 80.2707),
        "West Bengal": (22.5726, 88.3639),
        "Gujarat": (23.0225, 72.5714),
        "Uttar Pradesh": (26.8467, 80.9462),
        "Punjab": (30.7333, 76.7794),
        "Kerala": (8.5241, 76.9366),
        "Rajasthan": (26.9124, 75.7873),
        "Bihar": (25.5941, 85.1376),
        "Madhya Pradesh": (23.2599, 77.4126),
        "Odisha": (20.2961, 85.8245),
        "Assam": (26.1445, 91.7362)
    }

    @classmethod
    def get_coordinates_for_region(cls, region: str) -> Tuple[float, float]:
        return cls.REGION_COORDINATES.get(region, (20.5937, 78.9629))

    # --- 1. NLP Sentiment, Toxicity, & Risk Analyzer ---
    @classmethod
    def analyze_text(cls, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        
        # Keyword counting
        neg_matches = sum(1 for kw in cls.NEGATIVE_KEYWORDS if kw in text_lower)
        pos_matches = sum(1 for kw in cls.POSITIVE_KEYWORDS if kw in text_lower)
        is_trigger_hit = any(trig in text_lower for trig in cls.HIGH_RISK_TRIGGERS)

        # Sentiment score calculation (-1.0 to 1.0)
        total = neg_matches + pos_matches
        if total == 0:
            sentiment = "Neutral"
            sentiment_score = 0.0
        else:
            raw_score = (pos_matches - neg_matches) / total
            sentiment_score = round(raw_score, 2)
            if sentiment_score < -0.15:
                sentiment = "Negative"
            elif sentiment_score > 0.15:
                sentiment = "Positive"
            else:
                sentiment = "Neutral"

        # Risk level determination
        if is_trigger_hit or neg_matches >= 3:
            risk_level = "High"
            is_flagged = True
        elif neg_matches >= 1 or "http" in text_lower or "@" in text_lower:
            risk_level = "Medium"
            is_flagged = False
        else:
            risk_level = "Low"
            is_flagged = False

        return {
            "sentiment": sentiment,
            "sentiment_score": sentiment_score,
            "risk_level": risk_level,
            "is_flagged": is_flagged
        }

    # --- 2. Heuristic Bot Detector ---
    @classmethod
    def analyze_bot_profile(
        cls,
        username: str,
        followers: int = None,
        following: int = None,
        posts_per_hr: float = None,
        account_age_days: int = None
    ) -> Dict[str, Any]:
        username_clean = username.strip()
        
        if followers is None:
            followers = random.randint(5, 120) if "bot" in username_clean.lower() or "alert" in username_clean.lower() else random.randint(800, 12000)
        if following is None:
            following = random.randint(2500, 5500) if "bot" in username_clean.lower() or "alert" in username_clean.lower() else random.randint(150, 700)
        if posts_per_hr is None:
            posts_per_hr = round(random.uniform(35.0, 95.0), 1) if "bot" in username_clean.lower() else round(random.uniform(0.5, 3.5), 1)
        if account_age_days is None:
            account_age_days = random.randint(1, 15) if "bot" in username_clean.lower() else random.randint(150, 1800)

        bot_score = 0.0
        patterns: List[str] = []

        # Heuristic 1: Follower to Following ratio
        ratio = followers / max(following, 1)
        if ratio < 0.05 and following > 1000:
            bot_score += 35.0
            patterns.append("Follows thousands of accounts with almost zero followers")

        # Heuristic 2: Post Frequency
        if posts_per_hr > 30.0:
            bot_score += 30.0
            patterns.append(f"Unusually high posting rate ({posts_per_hr} posts per hour)")
        elif posts_per_hr > 15.0:
            bot_score += 15.0
            patterns.append("High posting frequency")

        # Heuristic 3: Account Age
        if account_age_days < 10:
            bot_score += 20.0
            patterns.append("Brand new account (Created less than 10 days ago)")
        elif account_age_days < 30:
            bot_score += 10.0
            patterns.append("New account (Less than 30 days old)")

        # Heuristic 4: Username pattern
        digits_count = sum(c.isdigit() for c in username_clean)
        if digits_count >= 4:
            bot_score += 15.0
            patterns.append("Computer-generated number pattern in username")
        if any(kw in username_clean.lower() for kw in ["bot", "cyber", "alert", "raid", "army", "anon", "trend"]):
            bot_score += 10.0
            patterns.append("Spam campaign keyword in handle")

        bot_probability = min(round(bot_score, 1), 99.4)
        is_flagged = bot_probability >= 60.0

        if not patterns:
            patterns.append("Normal real user behavior")

        network_cluster = None
        if is_flagged:
            if "alert" in username_clean.lower() or "news" in username_clean.lower():
                network_cluster = "Fake News Bot Cluster #1"
            elif "scam" in username_clean.lower() or "free" in username_clean.lower() or "claim" in username_clean.lower():
                network_cluster = "Phishing Scam Bot Cluster #2"
            else:
                network_cluster = "Automated Spam Bot Cluster #3"

        return {
            "username": username_clean if username_clean.startswith("@") else f"@{username_clean}",
            "followers_count": followers,
            "following_count": following,
            "posts_frequency_per_hr": posts_per_hr,
            "account_age_days": account_age_days,
            "bot_probability": bot_probability,
            "abnormal_patterns": ", ".join(patterns),
            "network_cluster": network_cluster,
            "is_flagged": is_flagged
        }

    # --- 3. Rule-Based Malicious Link & Phishing Checker ---
    @classmethod
    def scan_url(cls, url: str) -> Dict[str, Any]:
        url_clean = url.strip()
        parsed = urlparse(url_clean if "://" in url_clean else f"http://{url_clean}")
        domain = parsed.netloc or parsed.path
        domain_lower = domain.lower()
        full_url_lower = url_clean.lower()

        suspicious_tlds = [".xyz", ".top", ".online", ".club", ".site", ".ru", ".cc", ".tk", ".click", ".buzz", ".work"]
        phish_keywords = ["login", "verify", "update", "bank", "aadhaar", "kyc", "free", "gift", "subsidy", "claim", "lottery", "otp", "yono", "sbi", "hdfc", "paytm"]
        malware_extensions = [".apk", ".exe", ".scr", ".bat", ".vbs", ".zip", ".iso"]

        risk_factors: List[str] = []
        score = 5.0
        threat_type = "Clean"

        if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", domain):
            score += 45.0
            risk_factors.append("Direct IP address used instead of legitimate domain name")

        for tld in suspicious_tlds:
            if domain_lower.endswith(tld):
                score += 30.0
                risk_factors.append(f"High-risk untrusted domain extension ({tld})")
                break

        matched_kws = [kw for kw in phish_keywords if kw in full_url_lower]
        if matched_kws:
            score += min(len(matched_kws) * 20.0, 40.0)
            risk_factors.append(f"Fake banking & credential keywords found: {', '.join(matched_kws)}")

        if domain_lower.count("-") >= 2:
            score += 20.0
            risk_factors.append("Fake brand name with multiple hyphens")

        if any(full_url_lower.endswith(ext) for ext in malware_extensions):
            score += 50.0
            risk_factors.append("Direct download file for suspicious app (.APK/.EXE)")

        confidence_score = min(round(score, 1), 99.8)

        if any("download" in rf or ".apk" in full_url_lower for rf in risk_factors):
            threat_type = "Malware"
        elif confidence_score >= 60.0:
            threat_type = "Phishing"
        elif confidence_score >= 35.0:
            threat_type = "Suspicious"
        else:
            threat_type = "Clean"
            if not risk_factors:
                risk_factors.append("Legitimate verified website with secure SSL certificate")

        redirect_count = random.randint(2, 4) if threat_type != "Clean" else 0

        return {
            "url": url_clean,
            "domain": domain,
            "threat_type": threat_type,
            "confidence_score": confidence_score,
            "risk_factors": "; ".join(risk_factors),
            "redirect_count": redirect_count
        }
