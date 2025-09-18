import os
import numpy as np
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
from stable_baselines3 import PPO
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# -----------------------------
# Paths (absolute)
# -----------------------------
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
LOGS_DIR = os.path.join(PROJECT_ROOT, "logs", "logs_pricing")

MODEL_PATH = os.path.join(MODELS_DIR, "pricing_model.zip")
SCALER_PATH = os.path.join(MODELS_DIR, "scaler.pkl")
DATA_PATH = os.path.join(DATA_DIR, "synthetic_ecommerce_data.csv")

# -----------------------------
# Load model + scaler
# -----------------------------
model = PPO.load(MODEL_PATH)
meta = joblib.load(SCALER_PATH)
scaler = meta["scaler"]
features = meta["features"]

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Request schema
# -----------------------------
class Product(BaseModel):
    actual_price: float
    selling_price: float
    ebay_price: float
    stock: float
    demand_index: float
    user_interest: float
    sales: float
    day_of_week: int = 2
    season: int = 0

# -----------------------------
# Preprocessing
# -----------------------------
def make_obs_from_product(p: Product):
    arr = np.array([[p.actual_price, p.selling_price, p.ebay_price, p.stock,
                     p.demand_index, p.user_interest, p.sales, p.day_of_week, p.season]])
    obs = scaler.transform(arr)[0].astype(np.float32)
    return obs

# -----------------------------
# Business rules
# -----------------------------
def apply_pricing_rules(predicted_price, p: Product):
    adjusted_price = predicted_price
    rule_applied = "none"

    if adjusted_price > p.ebay_price * 1.05:
        adjusted_price = p.ebay_price * 1.05
        rule_applied = "cap_above_competitor"

    if p.stock > 50 and p.demand_index < 0.5:
        adjusted_price = min(adjusted_price, p.ebay_price * 0.95)
        rule_applied = "stock_clearance_discount"

    if p.demand_index > 0.8 and p.user_interest > 0.7:
        adjusted_price *= 1.1
        rule_applied = "high_demand_premium"

    if adjusted_price < p.actual_price:
        adjusted_price = p.actual_price
        rule_applied = "min_price_safeguard"

    return float(round(adjusted_price, 2)), rule_applied

# -----------------------------
# Endpoint
# -----------------------------
@app.get("/")
def health_check():
    return {"status": "ok"}

@app.post("/predict")
def predict_price(product: Product):
    # Model inference
    obs = make_obs_from_product(product)
    action, _ = model.predict(obs, deterministic=True)
    adjustment = float(action[0])

    predicted_pre_rule = float(product.selling_price * (1.0 + adjustment))
    predicted_price, rule_applied = apply_pricing_rules(predicted_pre_rule, product)

    # Sales & profit estimation
    demand_factor = max(0.0, (0.6 * product.demand_index + 0.4 * product.user_interest))
    price_ratio = predicted_price / max(1e-6, product.selling_price)
    expected_sales = product.sales * demand_factor * np.exp(-3.0 * (price_ratio - 1.0))
    expected_sales = max(0.0, expected_sales)
    est_profit = (predicted_price - product.actual_price) * expected_sales

    return {
        "action_adjustment": round(adjustment, 4),
        "predicted_price_pre_rule": round(predicted_pre_rule, 2),
        "predicted_price": predicted_price,
        "rule_applied": rule_applied,
        "expected_sales_estimate": round(float(expected_sales), 2),
        "estimated_profit": round(float(est_profit), 2),
    }

# -----------------------------
# Entry point
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Render sets PORT
    uvicorn.run(app, host="0.0.0.0", port=port)
