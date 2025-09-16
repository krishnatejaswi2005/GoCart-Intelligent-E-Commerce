import os
import gym
from gym import spaces
import numpy as np
import pandas as pd
import joblib
import math
import random

class ContinuousPricingEnv(gym.Env):
    """
    Continuous pricing environment that returns a normalized observation vector (0-1)
    based on scaler saved in preprocess. 
    Action is a single float: percent change (-0.3..0.3).
    """

    def __init__(self,
                 data_path=None,
                 scaler_path=None,
                 max_price=None,
                 max_stock=None,
                 elasticity=3.0,
                 holding_cost_per_unit=0.5,
                 min_margin=0.01):

        super(ContinuousPricingEnv, self).__init__()

        # -----------------------------
        # Resolve paths (absolute)
        # -----------------------------
        PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        DATA_DIR = os.path.join(PROJECT_ROOT, "data")
        MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

        data_path = data_path or os.path.join(DATA_DIR, "synthetic_ecommerce_data.csv")
        scaler_path = scaler_path or os.path.join(MODELS_DIR, "scaler.pkl")

        # -----------------------------
        # Load data & scaler
        # -----------------------------
        self.df = pd.read_csv(data_path).reset_index(drop=True)
        s = joblib.load(scaler_path)
        self.scaler = s["scaler"]
        self.features = s["features"]

        self.current_step = 0
        self.elasticity = elasticity
        self.holding_cost_per_unit = holding_cost_per_unit
        self.min_margin = min_margin
        self.n_features = len(self.features)

        # Observation & action space
        self.observation_space = spaces.Box(
            low=0.0, high=1.0, shape=(self.n_features,), dtype=np.float32
        )
        self.action_space = spaces.Box(
            low=-0.3, high=0.3, shape=(1,), dtype=np.float32
        )

        self.max_price = max_price
        self.max_stock = max_stock
        self.seed()

    def seed(self, s=None):
        self.np_random, seed = gym.utils.seeding.np_random(s)
        return [seed]

    def reset(self):
        self.current_step = random.randint(0, max(0, len(self.df) - 1))
        row = self.df.iloc[self.current_step]
        self._load_row(row)
        return self._get_obs_from_row(row)

    def _load_row(self, row):
        self.actual_price = float(row["actual_price"])
        self.selling_price = float(row["selling_price"])
        self.ebay_price = float(row["ebay_price"])
        self.stock = float(row["stock"])
        self.demand_index = float(row["demand_index"])
        self.user_interest = float(row["user_interest"])
        self.sales = float(row["sales"])
        self.day_of_week = int(row.get("day_of_week", 0))
        self.season = int(row.get("season", 0))

    def _get_obs_from_row(self, row):
        vals = row[self.features].astype(float).values.reshape(1, -1)
        obs = self.scaler.transform(vals)[0].astype(np.float32)
        return obs

    def step(self, action):
        adjustment = float(np.clip(
            action[0],
            float(self.action_space.low),
            float(self.action_space.high),
        ))

        old_price = self.selling_price
        new_price = old_price * (1.0 + adjustment)

        # Apply minimum margin constraint
        min_allowed = max(self.actual_price * (1.0 + self.min_margin), 0.01)
        if new_price < min_allowed:
            new_price = min_allowed

        if self.max_price:
            new_price = min(new_price, self.max_price)

        # Demand & sales simulation
        demand_factor = max(0.0, (0.6 * self.demand_index + 0.4 * self.user_interest))
        price_ratio = new_price / max(1e-6, old_price)
        expected_sales = self.sales * demand_factor * math.exp(
            -self.elasticity * (price_ratio - 1.0)
        )
        expected_sales = max(0.0, expected_sales)

        # Profit & penalties
        profit = (new_price - self.actual_price) * expected_sales
        competitor_gap = max(0.0, new_price - self.ebay_price)
        competitor_penalty = competitor_gap * 0.01 * expected_sales
        leftover = max(0.0, self.stock - expected_sales)
        holding_penalty = leftover * self.holding_cost_per_unit

        reward = (profit - competitor_penalty - holding_penalty) / 1000.0
        self.selling_price = new_price

        # Move to next step
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
        return obs, float(reward), done, info
