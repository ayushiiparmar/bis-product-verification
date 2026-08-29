import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "bis_standards.json"

with open(DATA_FILE, "r", encoding="utf-8") as file:
    standards = json.load(file)

print("BIS Knowledge Base loaded successfully!")
print("Number of standards:", len(standards))