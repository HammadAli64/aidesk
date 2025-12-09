"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import Loader from "@/components/Loader";
import CategoryFilter from "@/components/CategoryFilter";
import { newsApi, NewsArticle } from "@/lib/api";

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");

  const fetchNews = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await newsApi.getLatest({
        limit: 50,
        category: selectedCategory || undefined,
        search: searchQuery || undefined,
      });
      setArticles(data || []);
    } catch (error: any) {
      console.error("Error fetching news:", error);
      setError(
        error?.response?.data?.detail || 
        error?.message || 
        "Failed to fetch news. Make sure the backend server is running on http://localhost:8000"
      );
      setArticles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);
      const data = await newsApi.getCategories();
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setCategoriesError(
        error?.response?.data?.detail || 
        error?.message || 
        "Failed to fetch categories"
      );
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await newsApi.fetchNews();
      // Wait a bit for processing, then fetch latest
      setTimeout(() => {
        fetchNews();
      }, 2000);
    } catch (error) {
      console.error("Error refreshing news:", error);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Check backend health
    const checkBackend = async () => {
      try {
        await newsApi.health();
        setBackendStatus("online");
      } catch (error) {
        setBackendStatus("offline");
      }
    };
    checkBackend();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Safety timeout to prevent infinite loading
    let timeoutCleared = false;
    const timeoutId = setTimeout(() => {
      if (!timeoutCleared) {
        setLoading(false);
        setError("Request timed out. The backend may not be responding. Check if the server is running.");
      }
    }, 15000); // 15 second timeout

    fetchNews().finally(() => {
      timeoutCleared = true;
      clearTimeout(timeoutId);
    });

    return () => {
      timeoutCleared = true;
      clearTimeout(timeoutId);
    };
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                AI News Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Stay updated with the latest AI, LLM, and tech news
              </p>
            </div>
            <div className="flex items-center gap-2">
              {backendStatus === "checking" && (
                <span className="text-sm text-gray-500">Checking connection...</span>
              )}
              {backendStatus === "online" && (
                <span className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Backend Online
                </span>
              )}
              {backendStatus === "offline" && (
                <span className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Backend Offline
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search articles by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            {refreshing ? "Refreshing..." : "Refresh News"}
          </button>
        </div>

        {/* Category Selection Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter by Category
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {categoriesLoading ? (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <span>Loading categories...</span>
            </div>
          ) : categoriesError ? (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                {categoriesError}
              </p>
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-4">
              {/* Dropdown for mobile/small screens */}
              <div className="block md:hidden">
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chip buttons for desktop */}
              <div className="hidden md:block">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No categories available yet. Click "Refresh News" to fetch articles and generate categories.
              </p>
            </div>
          )}

          {selectedCategory && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-between">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-semibold">Filtered:</span> Showing articles in category{" "}
                <span className="font-bold">{selectedCategory}</span>
                {articles.length > 0 && (
                  <span className="ml-2">({articles.length} article{articles.length !== 1 ? "s" : ""})</span>
                )}
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Show All
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 font-medium">Error: {error}</p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-2">
              Make sure the backend server is running: <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded">python run.py</code> in the backend directory
            </p>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : articles.length === 0 && !error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No articles found. The database might be empty.
            </p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Fetch News Now
            </button>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
}

