import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return "/blog";
    return `/blog/page/${page}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center gap-1 rounded-lg border border-amber-300/50 bg-white/80 px-3 py-2 text-sm font-detective text-amber-900 transition-colors hover:bg-amber-100/80"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 rounded-lg border border-amber-200/30 bg-amber-50/50 px-3 py-2 text-sm font-detective text-amber-400 cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-2 text-amber-600"
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={`min-w-[40px] rounded-lg px-3 py-2 text-center text-sm font-detective transition-colors ${
                page === currentPage
                  ? "bg-amber-800/90 text-amber-100"
                  : "border border-amber-300/50 bg-white/80 text-amber-900 hover:bg-amber-100/80"
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center gap-1 rounded-lg border border-amber-300/50 bg-white/80 px-3 py-2 text-sm font-detective text-amber-900 transition-colors hover:bg-amber-100/80"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 rounded-lg border border-amber-200/30 bg-amber-50/50 px-3 py-2 text-sm font-detective text-amber-400 cursor-not-allowed">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
