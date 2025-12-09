# Troubleshooting Guide

## Frontend Not Showing Anything

### 1. Check Backend is Running

**Verify the backend server is running:**
```bash
cd backend
python run.py
```

You should see output like:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test the backend directly:**
- Open browser: http://localhost:8000/health
- Should return: `{"status":"healthy","timestamp":"..."}`
- Open: http://localhost:8000/docs (Swagger UI)

### 2. Check Frontend is Running

**Verify the frontend server is running:**
```bash
cd frontend
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

### 3. Check Environment Variables

**Backend `.env` file** (in `backend/` directory):
```env
OPENAI_API_KEY=your_key_here
# Optional but recommended:
NEWSDATA_KEY=your_key_here
GNEWS_KEY=your_key_here
MEDIASTACK_KEY=your_key_here
SERPER_KEY=your_key_here
DATABASE_URL=sqlite:///./aidesk.db
```

**Frontend `.env.local` file** (in `frontend/` directory):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Database is Empty

If the backend is running but no articles show:

1. **Click "Refresh News" button** on the frontend
2. **Or manually trigger fetch:**
   ```bash
   curl -X POST http://localhost:8000/news/fetch
   ```
3. **Wait a few seconds** for processing, then refresh the page

### 5. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for errors
- **Network tab**: Check if API calls are failing
  - Should see calls to `http://localhost:8000/news/latest`
  - Check if they return 200 (success) or errors

### 6. Common Issues

#### CORS Errors
- **Symptom**: "CORS policy" errors in browser console
- **Fix**: Make sure backend CORS allows `http://localhost:3000`
- Check `backend/app/main.py` has CORS middleware configured

#### Connection Refused
- **Symptom**: "Cannot connect to backend" error
- **Fix**: 
  1. Make sure backend is running on port 8000
  2. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
  3. Try accessing http://localhost:8000/health directly

#### No Articles Showing
- **Symptom**: Page loads but shows "No articles found"
- **Fix**:
  1. Database might be empty - click "Refresh News"
  2. Check backend logs for errors
  3. Verify at least one news API key is configured
  4. Check API key quotas/limits

#### OpenAI API Errors
- **Symptom**: Backend logs show OpenAI errors
- **Fix**:
  1. Verify `OPENAI_API_KEY` is correct in `.env`
  2. Check API key has credits/quota
  3. Check backend logs for specific error messages

### 7. Test Backend Endpoints Manually

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Get Latest News:**
```bash
curl http://localhost:8000/news/latest
```

**Get Categories:**
```bash
curl http://localhost:8000/news/categories
```

**Fetch News:**
```bash
curl -X POST http://localhost:8000/news/fetch
```

### 8. Check Backend Logs

Look for errors in the terminal where you ran `python run.py`:
- API key errors
- Database errors
- Network errors
- OpenAI API errors

### 9. Verify Database

Check if database file exists:
```bash
cd backend
ls -la aidesk.db  # Linux/Mac
dir aidesk.db     # Windows
```

If it doesn't exist, the database will be created on first run.

### 10. Reset Everything

If nothing works:

1. **Stop both servers** (Ctrl+C)
2. **Delete database** (optional):
   ```bash
   cd backend
   rm aidesk.db  # Linux/Mac
   del aidesk.db # Windows
   ```
3. **Restart backend:**
   ```bash
   cd backend
   python run.py
   ```
4. **Restart frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
5. **Click "Refresh News"** on the frontend

## Still Having Issues?

1. Check all terminal windows for error messages
2. Verify all API keys are correct
3. Make sure ports 3000 and 8000 are not in use by other applications
4. Check firewall settings
5. Try accessing backend directly: http://localhost:8000/docs

