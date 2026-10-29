# Equilix

Equilix helps teens check in on how they're doing. It runs the DASS-21 questionnaire, scores
depression, anxiety and stress with a trained model, explains the results in plain language, and
offers calming games and an AI assistant to talk things through.

It has three parts:

| Folder | What it is | Port |
|---|---|---|
| `frontend/` | React app | 3000 |
| `server/` | Node + Express API: accounts (MongoDB) and the AI chat (Groq) | 3001 |
| `backend/python/` | Flask API that scores check-ins with the saved SVM models | 5001 |

## Pages

- `/`: landing page
- `/login`: sign in or create an account (with the bubble field)
- `/main`: home and the check-in
- `/report`: results, response times, games and chat
- `/games`: memory cards, whack-a-mole, cat & mouse maze
- `/gpt`: talk to the assistant

## Running it locally

### 1. Node server

```bash
cd server
cp .env.example .env   # then fill in the values
npm install
npm run dev
```

`.env` needs:

- `MONGO_URI`: a MongoDB connection string
- `GROQ_API_KEY`: a key from console.groq.com
- `GROQ_MODEL`: optional, defaults to `openai/gpt-oss-120b`
- `JWT_SECRET`: any long random string
- `CORS_ORIGIN`: optional, sites allowed to call the API (comma-separated), defaults to `http://localhost:3000`

### 2. Python scoring API

Requires Python 3.9 or newer.

```bash
cd backend/python
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python server.py
```

It runs on port 5001, because macOS AirPlay Receiver uses port 5000.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

To point the frontend at deployed APIs, set `REACT_APP_API_URL` and `REACT_APP_ML_URL` before
building.
