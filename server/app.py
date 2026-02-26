from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)

# ✅ Enable CORS for frontend connection
CORS(app)

# Database file
DATABASE = "food.db"


# ---------------------------
# Create Database Table
# ---------------------------
def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS food_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            food_item TEXT,
            meal_type TEXT,
            prepared_quantity REAL,
            consumed_quantity REAL
        )
    """)

    conn.commit()
    conn.close()


init_db()


# ---------------------------
# Root Route (Health Check)
# ---------------------------
@app.route("/")
def home():
    return jsonify({
        "message": "Smart Food Waste Backend is Running 🚀",
        "status": "success"
    })


# ---------------------------
# Add Food Data Route
# ---------------------------
@app.route("/add", methods=["POST"])
def add_food():
    try:
        data = request.json

        date = data.get("date")
        food_item = data.get("food_item")
        meal_type = data.get("meal_type")
        prepared_quantity = data.get("prepared_quantity")
        consumed_quantity = data.get("consumed_quantity")

        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO food_data 
            (date, food_item, meal_type, prepared_quantity, consumed_quantity)
            VALUES (?, ?, ?, ?, ?)
        """, (date, food_item, meal_type, prepared_quantity, consumed_quantity))

        conn.commit()
        conn.close()

        return jsonify({"message": "Data saved successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------
# Get All Data Route
# ---------------------------
@app.route("/data", methods=["GET"])
def get_data():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM food_data")
    rows = cursor.fetchall()

    conn.close()

    return jsonify(rows)


# ---------------------------
# Run App
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)