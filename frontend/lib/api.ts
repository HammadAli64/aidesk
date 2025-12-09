import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout to allow news fetch + summarization
});

// Add error interceptor for better error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNREFUSED" || error.message.includes("Network Error")) {
      error.message = `Cannot connect to backend server at ${API_BASE_URL}. Make sure the backend is running.`;
    }
    return Promise.reject(error);
  }
);

export interface NewsArticle {
  id: number;
  title: string;
  content: string | null;
  url: string;
  source: string;
  summary: string | null;
  keywords: string | null;
  category: string | null;
  published_at: string | null;
  created_at: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  categories: string[];
}

export const newsApi = {
  getLatest: async (params?: {
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<NewsArticle[]> => {
    const response = await api.get("/news/latest", { params });
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get("/news/categories");
    return response.data.categories;
  },

  fetchNews: async (): Promise<{ status: string; message: string }> => {
    const response = await api.post("/news/fetch");
    return response.data;
  },

  getArticle: async (id: number): Promise<NewsArticle> => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  health: async (): Promise<{ status: string }> => {
    const response = await api.get("/health");
    return response.data;
  },
};

