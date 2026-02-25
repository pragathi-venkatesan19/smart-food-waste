import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def predict_next(df):
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")

    df["day_of_year"] = df["date"].dt.dayofyear

    X = df[["day_of_year"]]
    y = df["waste_kg"]

    model = LinearRegression()
    model.fit(X, y)

    last_day = df["date"].max()

    future_days = [
        (last_day + pd.Timedelta(days=i)).dayofyear
        for i in range(1, 8)
    ]

    predictions = model.predict(
        np.array(future_days).reshape(-1, 1)
    )

    return float(np.mean(predictions))
