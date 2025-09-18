import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import joblib
import os

# -----------------------------
# Project paths (absolute)
# -----------------------------
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

DATA_PATH = os.path.join(DATA_DIR, "synthetic_ecommerce_data.csv")
SCALER_PATH = os.path.join(MODELS_DIR, "scaler.pkl")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

# -----------------------------
# Load and preprocess data
# -----------------------------
df = pd.read_csv(DATA_PATH)

# Ensure required columns exist
expected_cols = [
    "actual_price", "selling_price", "ebay_price", "stock",
    "demand_index", "user_interest", "sales", "day_of_week", "season"
]
for col in expected_cols:
    if col not in df.columns:
        df[col] = 0 if col not in ["day_of_week", "season"] else 0

# Fix missing values
df[[
    "actual_price", "selling_price", "ebay_price",
    "stock", "demand_index", "user_interest", "sales"
]] = df[[
    "actual_price", "selling_price", "ebay_price",
    "stock", "demand_index", "user_interest", "sales"
]].fillna(0)

# -----------------------------
# Fit scaler
# -----------------------------
features = expected_cols  # feature order consistency
X = df[features].astype(float).values

scaler = MinMaxScaler(feature_range=(0.0, 1.0))
scaler.fit(X)

# Save scaler
joblib.dump({"scaler": scaler, "features": features}, SCALER_PATH)
print(f"✅ Saved scaler to {SCALER_PATH}")
