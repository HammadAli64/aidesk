"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import { newsApi, NewsArticle } from "@/lib/api";

export default function NewsDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const id = parseInt(params.id as string);
        const data = await newsApi.getArticle(id);
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      AI: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      LLMs: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Robotics: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Tools: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Research: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Innovation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Industry: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    };
    return colors[category || "AI"] || colors.AI;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <Loader />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Article Not Found
            </h1>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Return to Dashboard
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(
                  article.category
                )}`}
              >
                {article.category || "AI"}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(article.published_at)}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span>Source: {article.source}</span>
              {article.keywords && (
                <div className="flex flex-wrap gap-2">
                  <span className="font-semibold">Keywords:</span>
                  {article.keywords.split(",").map((keyword, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {article.summary && (
            <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Summary
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {article.summary}
              </p>
            </div>
          )}

          {article.content && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Full Article
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {article.content}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Read Original Article
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}

