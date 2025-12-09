# AI Desk - AI News Dashboard

A production-grade AI news dashboard that automatically fetches, summarizes, and categorizes the latest AI, LLM, and tech news from multiple sources.

## 🚀 Features

- **Multi-Source News Aggregation**: Fetches news from NewsData.io, GNews, Mediastack, and Serper APIs
- **AI-Powered Summarization**: Uses OpenAI GPT to summarize articles into 2-3 lines
- **Automatic Categorization**: Classifies articles into categories (AI, LLMs, Robotics, Tools, Research, Innovation, Industry)
- **Keyword Extraction**: Automatically extracts relevant keywords from articles
- **Deduplication**: Removes duplicate articles across different sources
- **Scheduled Updates**: Automatically fetches news every 30 minutes
- **Modern UI**: Beautiful, responsive dashboard built with Next.js 15 and TailwindCSS
- **Search & Filter**: Search articles by title/keywords and filter by category

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- API Keys for:
  - OpenAI (required)
  - NewsData.io (optional)
  - GNews (optional)
  - Mediastack (optional)
  - Serper (optional)

> **Note**: At least one news API key is required. The more APIs you configure, the more comprehensive your news feed will be.

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aidesk
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
NEWSDATA_KEY=your_newsdata_api_key_here
GNEWS_KEY=your_gnews_api_key_here
MEDIASTACK_KEY=your_mediastack_api_key_here
SERPER_KEY=your_serper_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./aidesk.db
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 5. Configure Frontend Environment

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Running the Application

### Start the Backend

```bash
cd backend

# Activate virtual environment (if not already activated)
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Run the FastAPI server
python run.py
```

The backend will be available at `http://localhost:8000`

### Start the Frontend

In a new terminal:

```bash
cd frontend

# Run the Next.js development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📖 API Endpoints

### Backend API (FastAPI)

- `GET /health` - Health check endpoint
- `GET /news/latest` - Get latest news articles
  - Query parameters:
    - `limit` (int): Number of articles to return (default: 50)
    - `category` (string): Filter by category
    - `search` (string): Search in title and keywords
- `GET /news/categories` - Get all available categories
- `POST /news/fetch` - Manually trigger news fetch
- `GET /news/{id}` - Get a specific article by ID

### API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🏗️ Project Structure

```
aidesk/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── database.py          # Database configuration
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── news_fetcher.py      # News API fetchers
│   │   ├── summarizer.py        # OpenAI summarization
│   │   └── cron_job.py          # Scheduled tasks
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Dashboard page
│   │   ├── categories/
│   │   │   └── page.tsx         # Categories page
│   │   └── news/
│   │       └── [id]/
│   │           └── page.tsx     # Article detail page
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── NewsCard.tsx
│   │   ├── Loader.tsx
│   │   └── CategoryFilter.tsx
│   ├── lib/
│   │   └── api.ts               # API client
│   ├── package.json
│   └── .env.local.example
└── README.md
```

## 🔧 Configuration

### Scheduled Jobs

The backend automatically fetches news every 30 minutes using APScheduler. The scheduler starts when the FastAPI server starts.

To modify the schedule, edit `backend/app/cron_job.py`:

```python
scheduler.add_job(
    fetch_and_process_news,
    "interval",
    minutes=30,  # Change this value
    id="fetch_news",
    replace_existing=True,
)
```

### OpenAI Model

By default, the summarizer uses `gpt-3.5-turbo`. To change the model, edit `backend/app/summarizer.py`:

```python
response = self.client.chat.completions.create(
    model="gpt-4",  # Change model here
    ...
)
```

## 🎨 Features in Detail

### News Fetching

The system fetches news from multiple sources simultaneously and merges the results. Articles are deduplicated based on URL to avoid duplicates.

### AI Summarization

Each article is sent to OpenAI with a prompt that:
1. Summarizes the article into 2-3 lines
2. Extracts 3-6 keywords
3. Classifies the article into a category

### Categories

Articles are automatically classified into one of these categories:
- **AI**: General artificial intelligence news
- **LLMs**: Large Language Models and GPT-related news
- **Robotics**: Robotics and automation news
- **Tools**: AI tools and applications
- **Research**: Research papers and academic news
- **Innovation**: Innovation and startup news
- **Industry**: Industry news and business updates

## 🐛 Troubleshooting

### Backend Issues

1. **Database errors**: Make sure SQLite is accessible and the database file can be created
2. **API key errors**: Verify all API keys in `.env` are correct
3. **Import errors**: Ensure all dependencies are installed: `pip install -r requirements.txt`

### Frontend Issues

1. **API connection errors**: Verify `NEXT_PUBLIC_API_URL` in `.env.local` matches your backend URL
2. **Build errors**: Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### News Fetching Issues

- If no articles appear, check:
  1. At least one news API key is configured
  2. API keys are valid and have sufficient quota
  3. Check backend logs for error messages

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using FastAPI, Next.js 15, and OpenAI**

>>>>>>> cbd37a9 (Add AI Desk full-stack app (FastAPI + Next.js))
