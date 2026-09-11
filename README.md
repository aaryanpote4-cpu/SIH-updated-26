# Tech Netra: Social Media Analytics & Misinformation Detection Platform

An AI-driven Cyber Security & Misinformation Detection platform for social media threat intelligence, bot detection, phishing URL scanning, and automated intelligence briefing.

---

## 📁 Monorepo Folder Structure

```text
SIH/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py             # Settings, CORS configuration
│   │   │   └── database.py           # SQLite engine, SessionLocal, Base
│   │   ├── models/                   # SQLAlchemy Models
│   │   │   ├── __init__.py
│   │   │   ├── bot.py                # Bot account schema & metrics
│   │   │   ├── link.py               # Phishing / Malicious link model
│   │   │   ├── report.py             # Synthesized threat reports
│   │   │   └── trend.py              # Trending topics & geo hotspots
│   │   ├── schemas/                  # Pydantic validation schemas
│   │   │   ├── __init__.py
│   │   │   ├── bot.py
│   │   │   ├── link.py
│   │   │   ├── report.py
│   │   │   └── trend.py
│   │   ├── services/                 # Business logic & detection algorithms
│   │   │   ├── __init__.py
│   │   │   ├── bot_service.py
│   │   │   ├── link_service.py
│   │   │   ├── report_service.py
│   │   │   └── trend_service.py
│   │   ├── routers/                  # Modular FastAPI routers
│   │   │   ├── __init__.py
│   │   │   ├── bots.py               # /api/bots
│   │   │   ├── links.py              # /api/links
│   │   │   ├── reports.py            # /api/reports
│   │   │   └── trends.py             # /api/trends
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── mock_data.py          # Auto-seeder for demo telemetry
│   ├── main.py                       # FastAPI entrypoint & router registration
│   └── requirements.txt              # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/               # UI components & badges
│   │   ├── App.jsx                   # Cyber dashboard with 4 modular views
│   │   ├── index.css                 # Tailwind directives + dark theme styling
│   │   └── main.jsx                  # React entry point
│   ├── index.html                    # Root HTML
│   ├── package.json                  # Frontend dependencies
│   ├── postcss.config.js             # PostCSS Tailwind config
│   ├── tailwind.config.js            # Cybersecurity theme tokens
│   └── vite.config.js                # Vite config + backend API proxy
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup (FastAPI + SQLite)

```bash
cd backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Base URL**: `http://localhost:8000/api`

---

### 2. Frontend Setup (React + Vite + Tailwind CSS)

```bash
cd frontend

# Install npm dependencies
npm install

# Start development server
npm run dev
```
- **Dashboard UI**: [http://localhost:5173](http://localhost:5173)

---

## 📡 Modular API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/trends` | `GET` | List all monitored topics with sentiment analysis |
| `/api/trends/geo` | `GET` | Geographical anomaly & coordination hotspots |
| `/api/trends/overview`| `GET` | High-level summary metrics & risk topics |
| `/api/bots` | `GET` | List flagged bot accounts & coordinated clusters |
| `/api/bots/stats` | `GET` | Bot cluster metrics & top risk profiles |
| `/api/bots/scan` | `POST` | Scan a handle/username for bot behavior |
| `/api/links` | `GET` | List inspected URLs |
| `/api/links/stats` | `GET` | Phishing detection counters & threat summaries |
| `/api/links/scan` | `POST` | Scan a URL for phishing and malware payload markers |
| `/api/reports` | `GET` | Retrieve synthesized threat intelligence briefs |
| `/api/reports/generate`| `POST` | Synthesize a new SOC briefing report |
