from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load models
with open('knn_depression.pkl', 'rb') as file:
    depression_model = pickle.load(file)

with open('knn_stress.pkl', 'rb') as file:
    stress_model = pickle.load(file)

with open('knn_anxiety.pkl', 'rb') as file:
    anxiety_model = pickle.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['responses']
    
    # Assume data is already formatted in arrays for each category
    depression_responses = data['depression']
    stress_responses = data['stress']
    anxiety_responses = data['anxiety']

    # Create a DataFrame for each model to ensure valid feature names
    depression_df = pd.DataFrame([depression_responses])
    stress_df = pd.DataFrame([stress_responses])
    anxiety_df = pd.DataFrame([anxiety_responses])
    
    # Make predictions for each model
    depression_pred = depression_model.predict(depression_df)[0]
    stress_pred = stress_model.predict(stress_df)[0]
    anxiety_pred = anxiety_model.predict(anxiety_df)[0]
    
    # Map predictions to readable labels (update based on your classification labels)
    labels = ['Extremely Severe', 'Severe', 'Moderate', 'Mild', 'Normal']
    
    return jsonify({
        'depression': labels[depression_pred],
        'stress': labels[stress_pred],
        'anxiety': labels[anxiety_pred]
    })

if __name__ == '__main__':
    app.run(debug=True)
