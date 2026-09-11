import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.seed import seed_database

if __name__ == "__main__":
    print("[INIT] Starting Tech Netra database seeder...")
    seed_database()
    print("[COMPLETE] Database seed finished successfully.")
