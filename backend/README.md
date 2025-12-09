# AI Desk Backend

FastAPI backend for the AI Desk news dashboard.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file with your API keys (see `.env.example`)

3. Run the server:
```bash
python run.py
```

The server will start on `http://localhost:8000`

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Scheduled Jobs

News is automatically fetched every 30 minutes. The scheduler starts when the server starts.

