import Link from "next/link";
import { NewsArticle } from "@/lib/api";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  return (
    <Link href={`/news/${article.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 h-full flex flex-col border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
              article.category
            )}`}
          >
            {article.category || "AI"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(article.published_at)}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {article.title}
        </h3>

        {article.summary && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
            {article.summary}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {article.source}
          </span>
          {article.keywords && (
            <div className="flex flex-wrap gap-1">
              {article.keywords
                .split(",")
                .slice(0, 3)
                .map((keyword, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                  >
                    {keyword.trim()}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

