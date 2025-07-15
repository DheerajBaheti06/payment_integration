import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NewsCard({
  news,
  viewMode = "grid",
  isPremium = false,
  onUpgradeClick,
}) {
  const handleClick = (e) => {
    if (isPremium) {
      e.preventDefault();
      onUpgradeClick?.();
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.01] bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {news.urlToImage && (
            <div className="relative w-full md:w-64 h-48 overflow-hidden flex-shrink-0">
              <img
                src={news.urlToImage}
                alt={news.title}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition-colors mb-2">
              {news.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {news.description}
            </p>
            <div className="flex justify-between items-center">
              {isPremium ? (
                <Button
                  onClick={handleClick}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 hover:gap-2"
                >
                  Upgrade to Read
                  <span className="transition-transform duration-200">→</span>
                </Button>
              ) : (
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 hover:gap-2"
                >
                  Read more
                  <span className="transition-transform duration-200">→</span>
                </a>
              )}
              {news.source?.name && (
                <Badge
                  variant="secondary"
                  className="bg-white/90 dark:bg-blue-900/50 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-blue-800/70 transition-colors border border-blue-200 dark:border-blue-800/50"
                >
                  {news.source.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.01] h-full flex flex-col bg-blue-50/50 dark:from-indigo-500/40 bg-gray-300 border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm">
      {news.urlToImage && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={news.urlToImage}
            alt={news.title}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
          {news.title}
        </h3>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {news.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          {isPremium ? (
            <Button
              onClick={handleClick}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 hover:gap-2"
            >
              Upgrade to Read
              <span className="transition-transform duration-200">→</span>
            </Button>
          ) : (
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 hover:gap-2"
            >
              Read more
              <span className="transition-transform duration-200">→</span>
            </a>
          )}
          {news.source?.name && (
            <Badge
              variant="secondary"
              className="bg-white/90 dark:bg-blue-900/50 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-blue-800/70 transition-colors border border-blue-200 dark:border-blue-800/50"
            >
              {news.source.name}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
