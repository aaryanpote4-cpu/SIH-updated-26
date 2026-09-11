from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from app.core.database import SessionLocal, engine, Base
from app.models import Post, BotProfile, LinkScan
from app.services.analyzer import ThreatAnalyzerService

SAMPLE_INDIAN_POSTS = [
    # --- Banking & Financial Scams ---
    {"platform": "X", "region": "Maharashtra", "topic": "#BankingScamAlert", "username": "@mumbai_citizen_ravi", "text": "WARNING: Received a text message saying my bank account will be suspended tonight if I do not verify my PAN card on this link. Do not click, this is a scam!"},
    {"platform": "Telegram", "region": "Delhi", "topic": "#BankingScamAlert", "username": "@delhi_security_alerts", "text": "Urgent alert: Fake electricity bill payment messages are spreading. They claim power will be disconnected at 9:30 PM. Please do not call the given number!"},
    {"platform": "X", "region": "Karnataka", "topic": "#BankingScamAlert", "username": "@bengaluru_tech_news", "text": "New online refund scam targeting citizens. Fraudsters are asking people to enter their UPI PIN to 'receive' cashback rewards."},
    {"platform": "Instagram", "region": "Gujarat", "topic": "#BankingScamAlert", "username": "@ahmedabad_updates", "text": "Important notice: Fake Aadhaar card update links are circulating in Ahmedabad and Surat. Citizens reported unauthorized bank deductions."},
    {"platform": "Telegram", "region": "Uttar Pradesh", "topic": "#BankingScamAlert", "username": "@free_kisan_subsidy_bot", "text": "Claim your instant farmer subsidy bonus today! Click this link to receive 6000 rupees directly into your bank without entering OTP."},
    {"platform": "X", "region": "Telangana", "topic": "#BankingScamAlert", "username": "@hyderabad_safe_cyber", "text": "Cyber police department issues advisory regarding part-time work-from-home video rating jobs. Over 40 fraud cases reported this week."},
    {"platform": "X", "region": "West Bengal", "topic": "#BankingScamAlert", "username": "@kolkata_voice_today", "text": "Fake job interview letters with forged corporate stamps sent to college graduates in Kolkata requesting security deposit fees."},
    {"platform": "YouTube", "region": "Punjab", "topic": "#BankingScamAlert", "username": "@punjab_tech_guide", "text": "Step-by-step video guide: How to identify malicious banking APK apps and protect your smartphone from unauthorized access."},

    # --- Exams & Student Demonstrations ---
    {"platform": "X", "region": "Delhi", "topic": "#ExamPaperLeakRumor", "username": "@delhi_student_union", "text": "Peaceful student demonstration outside the examination board office requesting transparent review procedures. Traffic redirected safely."},
    {"platform": "Telegram", "region": "Uttar Pradesh", "topic": "#ExamPaperLeakRumor", "username": "@leak_alerts_fast_news", "text": "Breaking news: Tomorrow's state government recruitment question paper has been leaked online! Join this channel for full PDF download!"},
    {"platform": "X", "region": "Bihar", "topic": "#ExamPaperLeakRumor", "username": "@bihar_factcheck_desk", "text": "Official Statement: Rumors claiming exam paper leaks in Patna are completely FALSE. Examinations started on time across all centers."},
    {"platform": "Instagram", "region": "Rajasthan", "topic": "#ExamPaperLeakRumor", "username": "@jaipur_aspirants_cell", "text": "Police security deployed at all test centers in Jaipur and Kota. Official verification checks are active. Students stay calm."},
    {"platform": "X", "region": "Madhya Pradesh", "topic": "#ExamPaperLeakRumor", "username": "@bhopal_student_forum", "text": "Student representatives submitted their suggestions to the board peacefully. Official press release will be issued in the evening."},

    # --- Deepfakes & Synthetic Media ---
    {"platform": "X", "region": "Maharashtra", "topic": "#DeepfakeVideoAlert", "username": "@factcheck_desk_india", "text": "ALERT: The viral audio clip claiming state-wide bank closures is a 100% AI SYNTHETIC VOICE CLONE. Please verify before forwarding."},
    {"platform": "YouTube", "region": "Delhi", "topic": "#DeepfakeVideoAlert", "username": "@cyber_intelligence_lab", "text": "Forensic breakdown of the viral election speech deepfake: Notice unnatural lighting and distorted facial edges around mouth movement."},
    {"platform": "Instagram", "region": "Karnataka", "topic": "#DeepfakeVideoAlert", "username": "@bengaluru_tech_watch", "text": "Beware of fake video showing a celebrity promoting an unverified crypto trading app. It is an AI deepfake scam designed to steal money!"},
    {"platform": "Telegram", "region": "Tamil Nadu", "topic": "#DeepfakeVideoAlert", "username": "@chennai_viral_stream", "text": "Old explosion video from another country is being falsely shared as an incident at Chennai port. Fact-checkers confirm it is false."},

    # --- Public Safety & City Infrastructure ---
    {"platform": "X", "region": "Delhi", "topic": "#CitySafetyUpdate", "username": "@delhi_metro_updates", "text": "Yellow line metro train operations running on schedule with minor 3-minute delay due to routine track maintenance."},
    {"platform": "Telegram", "region": "Maharashtra", "topic": "#EmergencyRumorHoax", "username": "@mumbai_panic_alert_bot", "text": "URGENT WARNING: City tap water supply in South Mumbai has been poisoned! Do not drink any municipal tap water tonight!"},
    {"platform": "X", "region": "Maharashtra", "topic": "#CitySafetyUpdate", "username": "@mumbai_police_factcheck", "text": "The viral social message claiming contaminated tap water in Mumbai is completely FALSE. Legal action is being taken against rumor mongers."},
    {"platform": "X", "region": "Karnataka", "topic": "#CitySafetyUpdate", "username": "@bengaluru_traffic_live", "text": "Flyover repair work on Outer Ring Road completed ahead of schedule. Traffic is moving smoothly in both directions."},
    {"platform": "Instagram", "region": "Kerala", "topic": "#WeatherSafetyAlert", "username": "@kochi_weather_patrol", "text": "Weather office issues rain advisory for two districts. Emergency rescue teams on standby with 24x7 control room numbers."},
    {"platform": "X", "region": "Tamil Nadu", "topic": "#WeatherSafetyAlert", "username": "@chennai_civic_cell", "text": "City drainage pumps operational across major subway roads. Public bus transport running without disruption."},
    {"platform": "X", "region": "Assam", "topic": "#WeatherSafetyAlert", "username": "@guwahati_relief_unit", "text": "River water levels have receded below the danger threshold. Relief supply distribution is proceeding smoothly."},
    {"platform": "X", "region": "Odisha", "topic": "#WeatherSafetyAlert", "username": "@odisha_disaster_monitor", "text": "Coastal low-pressure weather system has moved into deep sea. Normal fishing and port operations resumed safely."},

    # --- Automated Spam & Fake Bot Campaigns ---
    {"platform": "X", "region": "Delhi", "topic": "#BoycottOnlineRetailers", "username": "@spam_bot_node_01", "text": "Boycott all online shopping apps immediately! They are stealing personal user information! Retweet 100 times! #BoycottOnlineRetailers"},
    {"platform": "X", "region": "Maharashtra", "topic": "#BoycottOnlineRetailers", "username": "@spam_bot_node_02", "text": "Boycott all online shopping apps immediately! They are stealing personal user information! Retweet 100 times! #BoycottOnlineRetailers"},
    {"platform": "X", "region": "Karnataka", "topic": "#BoycottOnlineRetailers", "username": "@spam_bot_node_03", "text": "Boycott all online shopping apps immediately! They are stealing personal user information! Retweet 100 times! #BoycottOnlineRetailers"},
    {"platform": "X", "region": "Punjab", "topic": "#BoycottOnlineRetailers", "username": "@spam_bot_node_04", "text": "Boycott all online shopping apps immediately! They are stealing personal user information! Retweet 100 times! #BoycottOnlineRetailers"},
    {"platform": "X", "region": "Gujarat", "topic": "#BoycottOnlineRetailers", "username": "@spam_bot_node_05", "text": "Boycott all online shopping apps immediately! They are stealing personal user information! Retweet 100 times! #BoycottOnlineRetailers"},

    # --- Technology & Cybersecurity Awareness ---
    {"platform": "X", "region": "Karnataka", "topic": "#TechInnovationIndia", "username": "@space_research_watcher", "text": "Great achievement as Indian indigenous semiconductor and quantum computing startups receive international innovation awards!"},
    {"platform": "YouTube", "region": "Telangana", "topic": "#TechInnovationIndia", "username": "@hyderabad_innovation_hub", "text": "Technology incubator announces funding grants for 50 new artificial intelligence cybersecurity startup companies."},
    {"platform": "Instagram", "region": "Maharashtra", "topic": "#CyberSafetyAwareness", "username": "@pune_cyber_division", "text": "Cyber safety workshop conducted for 1,200 citizens on how to avoid digital arrest scams and fake police call threats."},
    {"platform": "X", "region": "Delhi", "topic": "#CyberSafetyAwareness", "username": "@national_cert_official", "text": "Security Advisory: Router security updates released to fix software vulnerabilities. Please update device firmware immediately."},
    {"platform": "X", "region": "Tamil Nadu", "topic": "#TechInnovationIndia", "username": "@tamilnadu_tech_board", "text": "New advanced electronics fabrication facility inaugurated in Coimbatore, creating thousands of specialized engineering jobs."},

    # --- Public Announcements & Verified News ---
    {"platform": "X", "region": "Uttar Pradesh", "topic": "#PublicElectionNotice", "username": "@lucknow_civic_desk", "text": "Election Commission releases digital voter slip mobile application with verified data protection and privacy safeguards."},
    {"platform": "Telegram", "region": "West Bengal", "topic": "#PublicElectionNotice", "username": "@bengal_factcheck_stream", "text": "The viral image claiming voting dates have changed is an unofficial forgery. Official election schedule remains unchanged."},
    {"platform": "X", "region": "Bihar", "topic": "#PublicElectionNotice", "username": "@patna_news_today", "text": "High voter participation recorded peacefully across state voting centers with zero safety incidents reported."},
    {"platform": "X", "region": "Punjab", "topic": "#AgriculturalUpdate", "username": "@amritsar_farmer_voice", "text": "State government launches single-window solar power connection subsidy portal for rural farming communities."},
    {"platform": "Instagram", "region": "Rajasthan", "topic": "#RenewableEnergy", "username": "@bikaner_clean_energy", "text": "Desert solar installation in Bhadla achieves record 4 Gigawatt clean renewable energy generation milestone today!"}
]

EXTENDED_POSTS = [
    {"platform": "Telegram", "region": "Delhi", "topic": "#BankingScamAlert", "username": "@fake_recharge_5g_bot", "text": "Free 1-Year unlimited 5G mobile recharge offer! Click link now to activate before offer expires tonight: bit.ly/free-5g-telecom"},
    {"platform": "X", "region": "Uttar Pradesh", "topic": "#CyberSafetyAwareness", "username": "@varanasi_police_desk", "text": "Advisory: Beware of fraudsters making video calls claiming to be police officers threatening fake arrest warrants. Report to 1930."},
    {"platform": "X", "region": "Maharashtra", "topic": "#CyberSafetyAwareness", "username": "@thane_cyber_patrol", "text": "Senior citizen protected from losing savings in fake parcel courier scam thanks to timely bank intervention."},
    {"platform": "Instagram", "region": "Karnataka", "topic": "#TechInnovationIndia", "username": "@iisc_research_updates", "text": "Scientists develop affordable indigenous clean water filtration membranes for remote rural settlements."},
    {"platform": "X", "region": "Telangana", "topic": "#CyberSafetyAwareness", "username": "@hyderabad_infosec_feed", "text": "Security Alert: Fake Android app named 'Quick Electricity Bill' found stealing banking SMS verification codes."},
    {"platform": "X", "region": "West Bengal", "topic": "#CyberSafetyAwareness", "username": "@wb_cyber_police", "text": "Notice: 12 fraudulent call centers raided in Kolkata. 24 suspects arrested in connection with illegal loan app scams."},
    {"platform": "X", "region": "Punjab", "topic": "#AgriculturalUpdate", "username": "@ludhiana_agri_desk", "text": "Automated drone pesticide spraying demonstration conducted successfully for 500 wheat farmers."},
    {"platform": "Telegram", "region": "Bihar", "topic": "#CryptoFraudAlert", "username": "@fake_crypto_profit_bot", "text": "Guaranteed 500% cash returns in 24 hours! Send cryptocurrency to receive double deposit payment instantly!"},
    {"platform": "X", "region": "Rajasthan", "topic": "#CyberSafetyAwareness", "username": "@rajasthan_tourism_safety", "text": "Travel Advisory: Book state wildlife safari permits only through official government portal. Fake duplicate sites blocked."},
    {"platform": "YouTube", "region": "Madhya Pradesh", "topic": "#CyberSafetyAwareness", "username": "@digital_security_101", "text": "Video Guide: How to easily turn on two-step verification security on your email and social messaging accounts."},
    {"platform": "X", "region": "Assam", "topic": "#FactCheckDesk", "username": "@assam_police_factcheck", "text": "Fake video showing old foreign civil disturbance is falsely tagged as local event. Legal notices sent to spreading accounts."},
    {"platform": "X", "region": "Odisha", "topic": "#TechInnovationIndia", "username": "@odisha_skill_center", "text": "Skill training center graduates 2,400 students in modern cybersecurity and software engineering domains."}
]

SAMPLE_BOTS = [
    {"username": "@spam_bot_node_01", "platform": "X", "followers": 12, "following": 4890, "posts_per_hr": 84.0, "account_age": 4},
    {"username": "@spam_bot_node_02", "platform": "X", "followers": 8, "following": 4910, "posts_per_hr": 88.5, "account_age": 4},
    {"username": "@spam_bot_node_03", "platform": "X", "followers": 15, "following": 4820, "posts_per_hr": 79.0, "account_age": 3},
    {"username": "@spam_bot_node_04", "platform": "X", "followers": 5, "following": 4950, "posts_per_hr": 92.0, "account_age": 2},
    {"username": "@spam_bot_node_05", "platform": "X", "followers": 19, "following": 4800, "posts_per_hr": 81.0, "account_age": 5},
    {"username": "@fake_recharge_5g_bot", "platform": "Telegram", "followers": 3, "following": 3400, "posts_per_hr": 55.0, "account_age": 6},
    {"username": "@mumbai_panic_alert_bot", "platform": "Telegram", "followers": 22, "following": 2900, "posts_per_hr": 62.0, "account_age": 8},
    {"username": "@fake_crypto_profit_bot", "platform": "Telegram", "followers": 14, "following": 4100, "posts_per_hr": 48.0, "account_age": 11},
    {"username": "@leak_alerts_fast_news", "platform": "Telegram", "followers": 45, "following": 2200, "posts_per_hr": 38.0, "account_age": 14},
    {"username": "@mumbai_citizen_ravi", "platform": "X", "followers": 1420, "following": 510, "posts_per_hr": 1.2, "account_age": 1400},
    {"username": "@bengaluru_tech_news", "platform": "X", "followers": 8900, "following": 620, "posts_per_hr": 0.8, "account_age": 2100},
    {"username": "@national_cert_official", "platform": "X", "followers": 95000, "following": 45, "posts_per_hr": 0.4, "account_age": 3500}
]

SAMPLE_LINKS = [
    {"url": "http://secure-login-hdfc-kyc-update.xyz/verify-pan"},
    {"url": "http://192.168.45.12/sbi-yono-apk-download.apk"},
    {"url": "http://gov-portal-subsidy-claim-forms.online/free-kisan"},
    {"url": "http://free-5g-telecom-recharge-bonus.site/claim"},
    {"url": "http://exam-question-paper-leak-download.ru/download.zip"},
    {"url": "http://urgent-bank-pan-card-update.buzz/login"},
    {"url": "https://cybercrime.gov.in"},
    {"url": "https://sbi.co.in"},
    {"url": "https://cert-in.org.in"},
    {"url": "https://isro.gov.in"}
]

def seed_database(db: Session = None):
    should_close = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        should_close = True

    try:
        db.query(Post).delete()
        db.query(BotProfile).delete()
        db.query(LinkScan).delete()
        db.commit()

        print("[INFO] Seeding Tech Netra with 50+ pure English social media posts...")

        all_post_records = SAMPLE_INDIAN_POSTS + EXTENDED_POSTS
        post_objects = []
        base_time = datetime.utcnow()

        for idx, item in enumerate(all_post_records):
            coords = ThreatAnalyzerService.get_coordinates_for_region(item["region"])
            analysis = ThreatAnalyzerService.analyze_text(item["text"])
            
            lat = coords[0] + random.uniform(-0.06, 0.06)
            lon = coords[1] + random.uniform(-0.06, 0.06)
            
            post_time = base_time - timedelta(minutes=random.randint(5, 1440))
            likes = random.randint(50, 4500) if not analysis["is_flagged"] else random.randint(2, 450)
            retweets = random.randint(10, 1200) if not analysis["is_flagged"] else random.randint(50, 2400)

            post_obj = Post(
                platform=item["platform"],
                username=item["username"],
                text=item["text"],
                timestamp=post_time,
                region=item["region"],
                latitude=round(lat, 5),
                longitude=round(lon, 5),
                likes=likes,
                retweets=retweets,
                sentiment=analysis["sentiment"],
                sentiment_score=analysis["sentiment_score"],
                risk_level=analysis["risk_level"],
                is_flagged=analysis["is_flagged"],
                topic=item["topic"]
            )
            post_objects.append(post_obj)

        db.add_all(post_objects)
        db.commit()
        print(f"[SUCCESS] Seeded {len(post_objects)} social media posts across 15 Indian regions in pure English.")

        bot_objects = []
        for b in SAMPLE_BOTS:
            bot_data = ThreatAnalyzerService.analyze_bot_profile(
                username=b["username"],
                followers=b["followers"],
                following=b["following"],
                posts_per_hr=b["posts_per_hr"],
                account_age_days=b["account_age"]
            )
            bot_obj = BotProfile(
                username=bot_data["username"],
                platform=b["platform"],
                followers_count=bot_data["followers_count"],
                following_count=bot_data["following_count"],
                posts_frequency_per_hr=bot_data["posts_frequency_per_hr"],
                account_age_days=bot_data["account_age_days"],
                bot_probability=bot_data["bot_probability"],
                abnormal_patterns=bot_data["abnormal_patterns"],
                network_cluster=bot_data["network_cluster"],
                is_flagged=bot_data["is_flagged"]
            )
            bot_objects.append(bot_obj)

        db.add_all(bot_objects)
        db.commit()
        print(f"[SUCCESS] Seeded {len(bot_objects)} bot profiles.")

        link_objects = []
        for l in SAMPLE_LINKS:
            scan_res = ThreatAnalyzerService.scan_url(l["url"])
            link_obj = LinkScan(
                url=scan_res["url"],
                domain=scan_res["domain"],
                threat_type=scan_res["threat_type"],
                confidence_score=scan_res["confidence_score"],
                risk_factors=scan_res["risk_factors"],
                redirect_count=scan_res["redirect_count"]
            )
            link_objects.append(link_obj)

        db.add_all(link_objects)
        db.commit()
        print(f"[SUCCESS] Seeded {len(link_objects)} scanned URL records.")

    finally:
        if should_close:
            db.close()

if __name__ == "__main__":
    seed_database()
