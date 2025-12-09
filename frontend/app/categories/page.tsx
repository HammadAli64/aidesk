"use client";

import { Suspense, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import Loader from "@/components/Loader";
import { newsApi, NewsArticle } from "@/lib/api";
import { useSearchParams } from "next/navigation";

function CategoriesContent() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    setSelectedCategory(category);
  }, [searchParams]);

  const fetchNews = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await newsApi.getLatest({
        limit: 100,
        category: selectedCategory || undefined,
      });
      setArticles(data || []);
    } catch (error: any) {
      console.error("Error fetching news:", error);
      setError(
        error?.response?.data?.detail || 
        error?.message || 
        "Failed to fetch news. Make sure the backend server is running."
      );
      setArticles([]);
    } finally {
      setLoading(false);
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
        "Failed to fetch categories. Make sure the backend server is running."
      );
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
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

    if (selectedCategory !== null) {
      fetchNews().finally(() => {
        timeoutCleared = true;
        clearTimeout(timeoutId);
      });
    } else {
      setLoading(false);
      setArticles([]);
      timeoutCleared = true;
      clearTimeout(timeoutId);
    }

    return () => {
      timeoutCleared = true;
      clearTimeout(timeoutId);
    };
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            News by Category
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse articles by category
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Categories
          </h2>
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
          ) : categories.length === 0 ? (
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No categories available. The database might be empty. Try fetching news first from the dashboard.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <a
                  key={category}
                  href={`/categories?category=${encodeURIComponent(category)}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {category}
                </a>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 font-medium">Error: {error}</p>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {selectedCategory
                ? `No articles found in ${selectedCategory} category.`
                : "Select a category to view articles."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {articles.length} article{articles.length !== 1 ? "s" : ""}
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CategoriesContent />
    </Suspense>
  );
}

