import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def train_model(df):
    df["waste"] = df["prepared"] - df["consumed"]
    df["day"] = pd.to_datetime(df["date"]).dt.dayofyear

    X = df[["day"]]
    y = df["waste"]

    model = LinearRegression()
    model.fit(X, y)

    return model

def predict_next(df):
    model = train_model(df)

    last_day = pd.to_datetime(df["date"]).max()

    future_days = [
        (last_day + pd.Timedelta(days=i)).dayofyear
        for i in range(1, 8)
    ]

    predictions = model.predict(
        np.array(future_days).reshape(-1, 1)
    )

    return float(np.mean(predictions))

