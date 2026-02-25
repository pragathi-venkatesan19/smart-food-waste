from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score

app = Flask(__name__)
CORS(app)

# ---------------- DATABASE ----------------

def get_connection():
    return sqlite3.connect("food.db", check_same_thread=False)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS food_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        item TEXT,
        category TEXT,
        unit TEXT,
        prepared REAL,
        consumed REAL
    )
    """)
    conn.commit()
    conn.close()

init_db()

# ---------------- ADD ENTRY ----------------

@app.route("/add", methods=["POST"])
def add_entry():
    try:
        data = request.json

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO food_data (date, item, category, unit, prepared, consumed)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            data["date"],
            data["item"],
            data["category"],
            data.get("unit", "kg"),
            float(data["prepared"]),
            float(data["consumed"])
        ))

        conn.commit()
        conn.close()

        return jsonify({"message": "Saved successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- GET ALL DATA ----------------

@app.route("/all", methods=["GET"])
def get_all():
    conn = get_connection()
    df = pd.read_sql_query("SELECT * FROM food_data ORDER BY date", conn)
    conn.close()
    return df.to_json(orient="records")


# ---------------- DELETE ENTRY ----------------

@app.route("/delete/<int:id>", methods=["DELETE"])
def delete_entry(id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM food_data WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted successfully"})


# ---------------- EXCEL UPLOAD ----------------

@app.route("/upload", methods=["POST"])
def upload():
    try:
        file = request.files["file"]
        df = pd.read_excel(file)

        # Normalize column names
        df.columns = df.columns.str.lower().str.strip()

        required = ["date", "item", "category", "prepared", "consumed"]

        for col in required:
            if col not in df.columns:
                return jsonify({"error": f"Missing column: {col}"}), 400

        if "unit" not in df.columns:
            df["unit"] = "kg"

        conn = get_connection()
        cursor = conn.cursor()

        for _, row in df.iterrows():
            cursor.execute("""
            INSERT INTO food_data (date, item, category, unit, prepared, consumed)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (
                str(row["date"]),
                row["item"],
                row["category"],
                row["unit"],
                float(row["prepared"]),
                float(row["consumed"])
            ))

        conn.commit()
        conn.close()

        return jsonify({"message": "Excel uploaded successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- ADVANCED AI PREDICTION ----------------

@app.route("/predict", methods=["GET"])
def predict():

    conn = get_connection()
    df = pd.read_sql_query("SELECT * FROM food_data", conn)
    conn.close()

    if len(df) < 21:
        return jsonify({"message": "Minimum 21 days required for strong AI prediction"})

    df["date"] = pd.to_datetime(df["date"])
    df["waste"] = df["prepared"] - df["consumed"]

    daily = df.groupby("date")["waste"].sum().reset_index()
    daily = daily.sort_values("date")

    daily["day_index"] = range(len(daily))

    X = daily[["day_index"]]
    y = daily["waste"]

    model = RandomForestRegressor(n_estimators=300)
    model.fit(X, y)

    train_pred = model.predict(X)
    confidence = round(r2_score(y, train_pred), 2)

    future = np.array([[len(daily) + i] for i in range(7)])
    predictions = model.predict(future)

    avg_prediction = round(float(np.mean(predictions)), 2)
    last_week_avg = round(float(daily["waste"].tail(7).mean()), 2)

    trend = "Increasing" if avg_prediction > last_week_avg else "Decreasing"

    volatility = round(float(np.std(daily["waste"])), 2)

    if avg_prediction < 30:
        severity = "Low"
    elif avg_prediction < 70:
        severity = "Moderate"
    else:
        severity = "High"

    reasoning = (
        f"AI analysed {len(daily)} days of waste data. "
        f"The predicted average waste for the next 7 days is {avg_prediction} kg. "
        f"Compared to last week's average of {last_week_avg} kg, "
        f"the trend is {trend}. "
        f"Volatility level is {volatility}. "
        f"Severity classified as {severity}. "
        f"Model confidence score: {confidence}."
    )

    return jsonify({
        "prediction": avg_prediction,
        "trend": trend,
        "severity": severity,
        "confidence": confidence,
        "reasoning": reasoning
    })


if __name__ == "__main__":
    app.run(debug=True)