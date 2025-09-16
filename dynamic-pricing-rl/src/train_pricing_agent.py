import os
import random
import math
import joblib
import numpy as np
import pandas as pd
import gym
from gym import spaces
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv
from stable_baselines3.common.callbacks import CheckpointCallback, EvalCallback, CallbackList

# -----------------------------
# Project paths (absolute)
# -----------------------------
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
LOGS_DIR = os.path.join(PROJECT_ROOT, "logs", "logs_pricing")

DATA_PATH = os.path.join(DATA_DIR, "synthetic_ecommerce_data.csv")
SCALER_PATH = os.path.join(MODELS_DIR, "scaler.pkl")
MODEL_PATH = os.path.join(MODELS_DIR, "pricing_model")  # SB3 auto-adds .zip

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)

# -----------------------------
# ContinuousPricingEnv
# -----------------------------
class ContinuousPricingEnv(gym.Env):
    """ Continuous pricing environment.
    Action: single float percentage adjustment in [-0.3, 0.3]
    Observation: normalized features using scaler.pkl
    """

    metadata = {"render.modes": []}

    def __init__(self, data_path=DATA_PATH, scaler_path=SCALER_PATH,
                 max_price=None, max_stock=None, elasticity=3.0, holding_cost_per_unit=0.5,
                 min_margin=0.01, seed=None):
        super().__init__()

        # load data & scaler
        self.df = pd.read_csv(data_path).reset_index(drop=True)
        meta = joblib.load(scaler_path)
        self.scaler = meta["scaler"]
        self.features = meta["features"]

        self.elasticity = elasticity
        self.holding_cost_per_unit = holding_cost_per_unit
        self.min_margin = min_margin
        self.max_price = max_price
        self.max_stock = max_stock

        # spaces
        self.n_features = len(self.features)
        self.observation_space = spaces.Box(low=0.0, high=1.0, shape=(self.n_features,), dtype=np.float32)
        self.action_space = spaces.Box(low=-0.3, high=0.3, shape=(1,), dtype=np.float32)

        self.current_step = 0
        self.seed(seed)

    def seed(self, s=None):
        self.np_random, seed = gym.utils.seeding.np_random(s)
        return [seed]

    def reset(self):
        self.current_step = random.randint(0, max(0, len(self.df) - 1))
        row = self.df.iloc[self.current_step]
        self._load_row(row)
        return self._get_obs_from_row(row)

    def _load_row(self, row):
        self.actual_price = float(row.get("actual_price", 0.0))
        self.selling_price = float(row.get("selling_price", 0.0))
        self.ebay_price = float(row.get("ebay_price", 0.0))
        self.stock = float(row.get("stock", 0.0))
        self.demand_index = float(row.get("demand_index", 0.0))
        self.user_interest = float(row.get("user_interest", 0.0))
        self.sales = float(row.get("sales", 0.0))
        self.day_of_week = int(row.get("day_of_week", 0))
        self.season = int(row.get("season", 0))

    def _get_obs_from_row(self, row):
        vals = row[self.features].astype(float).values.reshape(1, -1)
        obs = self.scaler.transform(vals)[0].astype(np.float32)
        return obs

    def _safe_action_to_scalar(self, action):
        try:
            import torch
            if isinstance(action, torch.Tensor):
                action = action.detach().cpu().numpy()
        except Exception:
            pass
        action_np = np.array(action, dtype=float).flatten()
        raw = float(action_np[0]) if action_np.size > 0 else 0.0
        low, high = float(self.action_space.low[0]), float(self.action_space.high[0])
        return float(np.clip(raw, low, high))

    def step(self, action):
        adjustment = self._safe_action_to_scalar(action)
        old_price = self.selling_price if self.selling_price > 0 else max(1.0, self.actual_price * (1 + self.min_margin))
        new_price = old_price * (1.0 + adjustment)

        min_allowed = max(self.actual_price * (1.0 + self.min_margin), 0.01)
        if new_price < min_allowed:
            new_price = min_allowed
        if self.max_price is not None:
            new_price = min(new_price, self.max_price)

        demand_factor = max(0.0, (0.6 * self.demand_index + 0.4 * self.user_interest))
        price_ratio = new_price / max(1e-6, old_price)
        expected_sales = self.sales * demand_factor * math.exp(-self.elasticity * (price_ratio - 1.0))
        expected_sales = max(0.0, expected_sales)

        profit = (new_price - self.actual_price) * expected_sales
        competitor_gap = max(0.0, new_price - self.ebay_price)
        competitor_penalty = competitor_gap * 0.01 * expected_sales
        leftover = max(0.0, self.stock - expected_sales)
        holding_penalty = leftover * self.holding_cost_per_unit

        reward = float((profit - competitor_penalty - holding_penalty) / 1000.0)
        self.selling_price = new_price

        self.current_step += 1
        done = self.current_step >= len(self.df)
        if not done:
            row = self.df.iloc[self.current_step]
            self._load_row(row)
            obs = self._get_obs_from_row(row)
        else:
            obs = np.zeros(self.n_features, dtype=np.float32)

        info = {
            "adjustment": adjustment,
            "predicted_sales": expected_sales,
            "profit": profit,
            "competitor_penalty": competitor_penalty,
            "holding_penalty": holding_penalty,
            "new_price": new_price,
        }
        return obs, reward, done, info

# -----------------------------
# Training script
# -----------------------------
def make_env():
    return ContinuousPricingEnv(data_path=DATA_PATH, scaler_path=SCALER_PATH,
                                elasticity=3.0, holding_cost_per_unit=0.5, min_margin=0.02)

vec_env = DummyVecEnv([make_env])
eval_env = DummyVecEnv([make_env])

checkpoint_callback = CheckpointCallback(save_freq=10000, save_path=LOGS_DIR, name_prefix="pricing_model")
eval_callback = EvalCallback(eval_env, best_model_save_path=LOGS_DIR, log_path=LOGS_DIR,
                             eval_freq=20000, n_eval_episodes=5, deterministic=True, render=False)
callback = CallbackList([checkpoint_callback, eval_callback])

policy_kwargs = dict(net_arch=[dict(pi=[256, 128], vf=[256, 128])])

model = PPO("MlpPolicy", vec_env, verbose=1, learning_rate=3e-4,
            n_steps=1024, batch_size=64, n_epochs=10, gamma=0.99,
            policy_kwargs=policy_kwargs, tensorboard_log=LOGS_DIR)

TOTAL_TIMESTEPS = 50_000

try:
    model.learn(total_timesteps=TOTAL_TIMESTEPS, callback=callback)
except KeyboardInterrupt:
    print("Training interrupted. Saving model...")
    model.save(MODEL_PATH)
    raise

model.save(MODEL_PATH)
print("✅ Saved model to", MODEL_PATH + ".zip")
