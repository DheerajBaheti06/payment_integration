import NewsCard from "./NewsCard";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";

export default function NewsSection({
  title,
  news,
  isPremium = false,
  onUpgradeClick,
  isLoading = false,
  error = null,
  viewMode: initialViewMode = "grid",
  onViewModeChange,
}) {
  const [viewMode, setViewMode] = useState(initialViewMode);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    onViewModeChange?.(mode);
  };

  return (
    <div className="rounded-lg shadow-lg border border-blue-200 dark:border-blue-800/50 p-6 backdrop-blur-sm dark:bg-blue-950/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blake-900 dark:text-gray-100">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          {isPremium && (
            <Button
              onClick={onUpgradeClick}
              className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:hover:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium border border-yellow-200 dark:border-yellow-800/50 transition-colors"
            >
              Upgrade to Premium
            </Button>
          )}
          <div className="flex items-center gap-2 bg-white/80 dark:bg-blue-950/30 p-1 rounded-lg border border-blue-200 dark:border-blue-800/50 backdrop-blur-sm">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => handleViewModeChange("grid")}
              className={`h-8 w-8 ${
                viewMode === "grid"
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 text-white dark:text-blue-200"
                  : "hover:bg-gray-50 dark:hover:bg-blue-900/50"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => handleViewModeChange("list")}
              className={`h-8 w-8 ${
                viewMode === "list"
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 text-white dark:text-blue-200"
                  : "hover:bg-gray-50 dark:hover:bg-blue-900/50"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 dark:text-red-400 p-4">
          {error}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
          }
        >
          {news.map((item, index) => (
            <NewsCard
              key={index}
              news={item}
              viewMode={viewMode}
              isPremium={isPremium}
              onUpgradeClick={onUpgradeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
