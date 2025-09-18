# visualize_rl_metrics.py
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# -----------------------------
# Simulated Data (replace with logs from training if available)
# -----------------------------
episodes = np.arange(1, 201)
rewards = np.random.normal(loc=200, scale=50, size=len(episodes)).cumsum() / np.arange(1, len(episodes) + 1)
raw_rewards = np.random.normal(loc=200, scale=50, size=len(episodes))
entropy = np.linspace(1.0, 0.2, len(episodes)) + np.random.normal(0, 0.05, len(episodes))
times = np.linspace(0.1, 20, len(episodes))  # fake training times

# Compute metrics
moving_avg = pd.Series(raw_rewards).rolling(window=10).mean()
reward_variance = pd.Series(raw_rewards).rolling(window=10).var()

# -----------------------------
# 1. Reward Metrics
# -----------------------------

# Cumulative Reward (Learning Curve)
fig1 = px.line(x=episodes, y=rewards, title="Cumulative Reward / Return Over Episodes",
               labels={"x": "Episode", "y": "Average Return"})
fig1.show()

# Moving Average of Rewards
fig2 = px.line(x=episodes, y=moving_avg, title="Moving Average of Rewards (10-episode window)",
               labels={"x": "Episode", "y": "Smoothed Reward"})
fig2.show()

# Distribution of Rewards
fig3 = px.histogram(raw_rewards, nbins=30, title="Distribution of Rewards Across Episodes",
                    labels={"value": "Reward"}, color_discrete_sequence=["skyblue"])
fig3.show()

# -----------------------------
# 2. Stability & Exploration Metrics
# -----------------------------

# Reward Variance
fig4 = px.line(x=episodes, y=reward_variance, title="Reward Variance Over Episodes",
               labels={"x": "Episode", "y": "Variance"})
fig4.show()

# Entropy of Policy
fig5 = px.line(x=episodes, y=entropy, title="Entropy of Policy Over Episodes",
               labels={"x": "Episode", "y": "Entropy"})
fig5.show()

# -----------------------------
# 3. Efficiency Metrics
# -----------------------------

# Training Time vs Performance
fig6 = px.scatter(x=times, y=rewards, title="Training Time vs Performance",
                  labels={"x": "Training Time (s)", "y": "Average Return"},
                  color=episodes)
fig6.show()

# Sample Efficiency (Episodes to reach threshold)
threshold = 180
episodes_to_target = np.argmax(rewards >= threshold) if np.any(rewards >= threshold) else None

fig7 = go.Figure()
fig7.add_trace(go.Scatter(x=episodes, y=rewards, mode="lines", name="Return"))
fig7.add_hline(y=threshold, line_dash="dash", line_color="red", annotation_text="Target Return")
if episodes_to_target:
    fig7.add_vline(x=episodes_to_target, line_dash="dot", line_color="green",
                   annotation_text=f"Reached at Episode {episodes_to_target}")
fig7.update_layout(title="Sample Efficiency: Episodes to Reach Target Return",
                   xaxis_title="Episode", yaxis_title="Average Return")
fig7.show()
