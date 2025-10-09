import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = ''
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate pagination numbers with ellipsis - compact layout
  const getPaginationNumbers = () => {
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const range = [];
    
    // Always show first page
    range.push(1);
    
    if (currentPage <= 4) {
      // Show pages 1, 2, 3, 4, 5, ..., last
      range.push(2, 3, 4, 5);
      if (totalPages > 5) {
        range.push("...");
      }
    } else if (currentPage >= totalPages - 3) {
      // Show 1, ..., last-4, last-3, last-2, last-1, last
      if (totalPages > 5) {
        range.push("...");
      }
      for (let i = totalPages - 4; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Show 1, ..., current-1, current, current+1, ..., last
      range.push("...");
      range.push(currentPage - 1, currentPage, currentPage + 1);
      range.push("...");
    }
    
    // Always show last page if it's not already included
    if (totalPages > 1 && !range.includes(totalPages)) {
      range.push(totalPages);
    }

    return range;
  };

  if (totalPages === 0) {
    return null;
  }

  return (
    <div className={`bg-white shadow rounded-lg px-4 py-3 sm:px-6 ${className}`}>
      {/* Pagination - Compact layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Results info */}
        <div className="text-center sm:text-left">
          <p className="text-xs sm:text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(endIndex, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span>{" "}
            results
          </p>
        </div>
        
        {/* Pagination navigation - compact */}
        <div className="flex justify-center">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>

            {getPaginationNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center sm:px-4 px-2 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`relative inline-flex items-center sm:px-4 px-2  py-2 border text-xs sm:text-sm font-medium ${
                    currentPage === page
                      ? "z-10 bg-primary- border-primary-dark text-primary-dark"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

