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
      "AI Tool": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Tools: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Research: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Innovation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Innovations: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Industry: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    };
    return colors[category || "AI"] || colors.AI;
  };

  return (
    <Link href={`/news/${article.id}`}>
      <div className="card-aurora rounded-2xl p-[1px] h-full transition transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/20">
        <div className="card-surface rounded-2xl p-5 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                  article.category
                )}`}
              >
                {article.category || "AI"}
              </span>
              <span className="text-[11px] text-slate-300/70 border border-white/10 rounded-full px-2 py-1">
                {article.source}
              </span>
            </div>
            <span className="text-xs text-slate-300/70">
              {formatDate(article.published_at)}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-white mb-3 leading-tight line-clamp-2">
            {article.title}
          </h3>

          {article.summary && (
            <p className="text-slate-200/80 mb-4 line-clamp-3 flex-grow">
              {article.summary}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span className="text-xs text-emerald-100">AI-summarized</span>
            </div>
            {article.keywords && (
              <div className="flex flex-wrap gap-1 justify-end">
                {article.keywords
                  .split(",")
                  .slice(0, 3)
                  .map((keyword, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-white/5 text-slate-100 px-2 py-1 rounded-full border border-white/10"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

