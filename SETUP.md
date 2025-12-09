# Quick Setup Guide

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Copy the example and edit with your keys
# Windows:
copy .env.example .env
# macOS/Linux:
cp .env.example .env

# Edit .env file and add your API keys
# At minimum, you need OPENAI_API_KEY
# Add news API keys for better coverage
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env.local file
# Windows:
copy .env.local.example .env.local
# macOS/Linux:
cp .env.local.example .env.local

# Edit .env.local if your backend runs on a different port
```

### 3. Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
# Activate venv if not already activated
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Getting API Keys

### Required
- **OpenAI API Key**: https://platform.openai.com/api-keys

### Optional (but recommended)
- **NewsData.io**: https://newsdata.io/pricing
- **GNews**: https://gnews.io/
- **Mediastack**: https://mediastack.com/
- **Serper**: https://serper.dev/

> **Note**: You need at least one news API key. The more you add, the more comprehensive your news feed will be.

## First Run

1. Start the backend server
2. Start the frontend server
3. Click "Refresh News" button on the dashboard to fetch initial articles
4. Articles will automatically update every 30 minutes

## Troubleshooting

### Backend won't start
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify your `.env` file exists and has at least `OPENAI_API_KEY`
- Check Python version: `python --version` (should be 3.9+)

### Frontend won't start
- Check that Node.js is installed: `node --version` (should be 18+)
- Install dependencies: `npm install`
- Check that `.env.local` exists

### No articles showing
- Click "Refresh News" button to manually trigger fetch
- Check backend logs for errors
- Verify at least one news API key is configured
- Check API key quotas/limits

### CORS errors
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local` matches backend URL
- Verify CORS settings in `backend/app/main.py`

