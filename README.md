# EQUILIX

This project is a full-stack application built with **React (frontend)** and a **Python server (backend)**. Since it’s not deployed yet, you can run it locally to explore the available routes and features.  

---

## 🚀 Features & Routes  

After starting the project, you can navigate through the following routes in your browser:  

- `/` → **Landing Page**  
- `/login` → **Login Page**  
- `/main` → **Main Dashboard**  
- `/report` → **Report Page**  
- `/games` → **Concentration Game**  
- `/gpt` → **AI Component (uses external API keys)**  
- `/maze` → **Maze Game**  

---

## 🛠️ Getting Started  

### 1. Clone the Repository  
```bash
git clone <your-repo-url>
cd <your-project-folder>
```
2. Install Dependencies
Frontend (React)
```bash
cd frontend   # or the folder where your React app lives
npm install
```
Backend (Python Server)
Make sure you have Python 3.9+ installed.
```bash
cd backend    # or the folder where your Python server lives
pip install -r requirements.txt
```
3. Start the Servers
   
Start the Python server in Backend folder.
```bash
python main.py   # or uvicorn main:app --reload (if FastAPI/Flask setup differs)

```
Start the React frontend
```
npm start
```
