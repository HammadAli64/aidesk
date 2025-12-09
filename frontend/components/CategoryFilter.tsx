"use client";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      AI: "bg-blue-500 hover:bg-blue-600",
      LLMs: "bg-purple-500 hover:bg-purple-600",
      Robotics: "bg-green-500 hover:bg-green-600",
      "AI Tool": "bg-orange-500 hover:bg-orange-600",
      Tools: "bg-orange-500 hover:bg-orange-600",
      Research: "bg-red-500 hover:bg-red-600",
      Innovation: "bg-yellow-500 hover:bg-yellow-600",
      Innovations: "bg-yellow-500 hover:bg-yellow-600",
      Industry: "bg-indigo-500 hover:bg-indigo-600",
    };
    return colors[category] || "bg-gray-500 hover:bg-gray-600";
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
          selectedCategory === null
            ? "bg-white/15 text-white ring-2 ring-offset-2 ring-offset-slate-900 ring-emerald-300/70 shadow-lg shadow-emerald-500/20"
            : "bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10"
        }`}
      >
        All Categories
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium text-white transition ${
            selectedCategory === category
              ? `${getCategoryColor(category)} opacity-100 shadow-lg shadow-sky-500/25 ring-2 ring-white/40`
              : `${getCategoryColor(category)} opacity-80 hover:opacity-100`
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

