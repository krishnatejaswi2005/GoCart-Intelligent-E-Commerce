import os
import pandas as pd
import numpy as np
import joblib
from stable_baselines3 import PPO

# -----------------------------
# Project paths (absolute)
# -----------------------------
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

MODEL_PATH = os.path.join(MODELS_DIR, "pricing_model")  # no .zip needed
SCALER_PATH = os.path.join(MODELS_DIR, "scaler.pkl")
DATA_PATH = os.path.join(DATA_DIR, "synthetic_ecommerce_data.csv")

# -----------------------------
# Load model & scaler
# -----------------------------
model = PPO.load(MODEL_PATH)
meta = joblib.load(SCALER_PATH)
features = meta["features"]
scaler = meta["scaler"]

# -----------------------------
# Load dataset
# -----------------------------
df = pd.read_csv(DATA_PATH)

# -----------------------------
# Helper functions
# -----------------------------
def make_obs(row):
    vals = row[features].astype(float).values.reshape(1, -1)
    return scaler.transform(vals)[0]

def simulate_expected_sales(row, old_price, new_price, elasticity=3.0):
    demand_factor = max(
        0.0, 
        (0.6 * float(row["demand_index"]) + 0.4 * float(row["user_interest"]))
    )
    price_ratio = new_price / max(1e-6, old_price)
    expected_sales = (
        float(row["sales"]) * demand_factor * np.exp(-elasticity * (price_ratio - 1.0))
    )
    return max(0.0, expected_sales)

# -----------------------------
# Run quick simulation
# -----------------------------
for idx in range(10):
    row = df.iloc[idx]
    obs = make_obs(row)
    action, _ = model.predict(obs, deterministic=True)
    adjustment = float(action[0])

    old_price = float(row["selling_price"])
    predicted_price = old_price * (1 + adjustment)
    exp_sales = simulate_expected_sales(row, old_price, predicted_price)
    profit = (predicted_price - float(row["actual_price"])) * exp_sales

    print(
        f"idx {idx} | old_price {old_price:.2f} adj {adjustment:.4f} "
        f"-> predicted {predicted_price:.2f} | exp_sales {exp_sales:.2f} "
        f"| est_profit {profit:.2f}"
    )
