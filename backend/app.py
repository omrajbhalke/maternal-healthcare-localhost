# # cd backend
# # pip install flask flask-cors joblib
# # python app.py

# # cd frontend
# # python -m http.server 8000
# # http://localhost:8000

# # net start MongoDB

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
from pymongo import MongoClient
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Load the trained model and preprocessors
# model = joblib.load("ensemble_model.pkl")
# scaler = joblib.load("scaler.pkl")
# label_encoder = joblib.load("label_encoder.pkl")  # Trained with ['Healthy', 'Risky']

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, "ensemble_model.pkl"))
encoder = joblib.load(os.path.join(BASE_DIR, "label_encoder.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))

# Connect to MongoDB
# client = MongoClient("mongodb://localhost:27017/")
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URL)
db = client["health_db"]
collection = db["patients"]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    try:
        # Extract input features
        name = data["name"]
        age = data["age"]
        diastolic = data["diastolic"]
        bs = data["bs"]
        temp = data["temp"]
        pulse = data["pulse"]

        # Preprocess and predict
        input_data = [age, diastolic, bs, temp, pulse]
        input_scaled = scaler.transform([input_data])
        prediction = model.predict(input_scaled)  # Output: [0] or [1]
        risk_label = encoder.inverse_transform(prediction)[0]  # 'Healthy' or 'Risky'

        # Store result in MongoDB
        collection.insert_one({
            "name": name,
            "age": age,
            "diastolic": diastolic,
            "bs": bs,
            "temp": temp,
            "pulse": pulse,
            "risk": risk_label,
            "timestamp": datetime.now()
        })

        return jsonify({"risk": risk_label})

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": "Prediction failed"}), 400

@app.route('/patients', methods=['GET'])
def get_patients():
    try:
        # Fetch all patient records
        patients = list(collection.find({}, {'_id': 0}))
        total = len(patients)

        # Count Healthy vs Risky
        risk_counts = {"Healthy": 0, "Risky": 0}
        for p in patients:
            risk = p.get('risk', 'Unknown')
            if risk in risk_counts:
                risk_counts[risk] += 1

        return jsonify({
            "total": total,
            "riskCounts": risk_counts,
            "patients": patients
        })

    except Exception as e:
        print("Error fetching patients:", e)
        return jsonify({"error": "Failed to fetch patient data"}), 500
    
# Serve frontend
@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../frontend', path)


if __name__ == "__main__":
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=5000, debug=True)

