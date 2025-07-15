import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const [jumpToPage, setJumpToPage] = useState("");

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const page = parseInt(jumpToPage);
    if (page && page > 0 && page <= totalPages) {
      onPageChange(page);
      setJumpToPage("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-950/80 p-2 rounded-full shadow-sm border border-blue-100 dark:border-gray-800/80">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 rounded-full hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-blue-900 dark:hover:text-teal-300 text-indigo-700 dark:text-gray-200 transition-all duration-200 border-none"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant={currentPage === 1 ? "default" : "ghost"}
            size="icon"
            onClick={() => onPageChange(1)}
            className={`h-9 w-9 rounded-full transition-all duration-200 border-none ${
              currentPage === 1
                ? "bg-indigo-100 text-indigo-800 font-bold"
                : "hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-blue-900 dark:hover:text-teal-300 text-indigo-700"
            }`}
          >
            1
          </Button>

          {currentPage > 2 && (
            <span className="text-slate-400 dark:text-gray-400 px-1">...</span>
          )}

          {currentPage !== 1 && currentPage !== totalPages && (
            <Button
              variant="default"
              size="icon"
              className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-800 font-bold border-none"
            >
              {currentPage}
            </Button>
          )}

          {currentPage < totalPages - 1 && (
            <span className="text-slate-400 dark:text-gray-400 px-1">...</span>
          )}

          {totalPages > 1 && (
            <Button
              variant={currentPage === totalPages ? "default" : "ghost"}
              size="icon"
              onClick={() => onPageChange(totalPages)}
              className={`h-9 w-9 rounded-full transition-all duration-200 border-none ${
                currentPage === totalPages
                  ? "bg-indigo-100 text-indigo-800 font-bold"
                  : "hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-blue-900 dark:hover:text-teal-300 text-indigo-700"
              }`}
            >
              {totalPages}
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 rounded-full hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-blue-900 dark:hover:text-teal-300 text-indigo-700 dark:text-gray-200 transition-all duration-200 border-none"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-950/80 p-2 rounded-full shadow-sm border border-blue-100 dark:border-gray-800/80">
        <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            placeholder="Go to page"
            className="w-40 h-9 rounded-full text-center bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-gray-100 border-blue-100 dark:border-gray-800 focus:border-indigo-400 dark:focus:border-blue-800 focus:ring-2 focus:ring-indigo-200/20 dark:focus:ring-blue-800/20 transition-all duration-200"
          />
          <Button
            type="submit"
            size="sm"
            variant="default"
            className="h-9 px-4 rounded-full bg-indigo-600 hover:bg-teal-500 text-white dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-200 dark:hover:text-white transition-all duration-200 border-none"
          >
            Go
          </Button>
        </form>
      </div>
    </div>
  );
}
