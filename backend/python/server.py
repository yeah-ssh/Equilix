from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load models from this file's folder so the working directory doesn't matter
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(MODEL_DIR, 'svm_model.pkl'), 'rb') as file:
    depression_model = pickle.load(file)

with open(os.path.join(MODEL_DIR, 'svm_model_st.pkl'), 'rb') as file:
    stress_model = pickle.load(file)

with open(os.path.join(MODEL_DIR, 'svm_model_ax.pkl'), 'rb') as file:
    anxiety_model = pickle.load(file)

@app.route('/health')
def health():
    return jsonify({'ok': True})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['responses']
    
    
    depression_responses = data['depression']
    stress_responses = data['stress']
    anxiety_responses = data['anxiety']

    # Create a DataFrame for each model to ensure valid feature names
    depression_df = pd.DataFrame([depression_responses], columns=depression_model.feature_names_in_)
    stress_df = pd.DataFrame([stress_responses], columns=stress_model.feature_names_in_)
    anxiety_df = pd.DataFrame([anxiety_responses], columns=anxiety_model.feature_names_in_)
    
    # Make predictions for each model
    depression_pred = depression_model.predict(depression_df)[0]
    stress_pred = stress_model.predict(stress_df)[0]
    anxiety_pred = anxiety_model.predict(anxiety_df)[0]
    
    # LabelEncoder sorted the labels alphabetically during training (main.py),
    # so the model's class indices follow that order.
    labels = ['Extremely Severe', 'Mild', 'Moderate', 'Normal', 'Severe']
    
    return jsonify({
        'depression': labels[depression_pred],
        'stress': labels[stress_pred],
        'anxiety': labels[anxiety_pred]
    })

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get('PORT', 5001)))
