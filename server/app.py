from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from model import predict_next

app = Flask(__name__)
CORS(app)

# ✅ ROOT ROUTE (Fixes 404 error)
@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "Smart Food Waste Backend is Running 🚀"
    })


# ✅ PREDICTION ROUTE
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data received"}), 400

        df = pd.DataFrame(data)

        # Ensure date column exists
        if "date" not in df.columns:
            return jsonify({"error": "Date column missing"}), 400

        prediction = predict_next(df)

        return jsonify({
            "status": "success",
            "predicted_waste_next_week": round(prediction, 2)
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)