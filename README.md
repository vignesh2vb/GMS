# Student Grievance System

## Prerequisites
- Python 3.x
- Node.js & npm

## Setup & Installation

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### 1. Start the Backend Server
Open a terminal and run:
```bash
cd backend
python app.py
```
The server will start at `http://127.0.0.1:5000`.

### 2. Start the Frontend Application
Open a **new** terminal and run:
```bash
cd frontend
npm run dev
```
The application will be accessible at the URL shown in the terminal (usually `http://localhost:5173`).

## default Logins

### Admin
- **Identifier**: `aasif`
- **Password**: `aasif123`

### Student (Example)
- **Identifier**: `S202`
- **Password**: `2000-01-01` (DOB)

### Faculty (Example)
- **Identifier**: `F202`
- **Password**: `pass`

> **Note**: You can see all user credentials in the Admin Dashboard after logging in as Admin.
