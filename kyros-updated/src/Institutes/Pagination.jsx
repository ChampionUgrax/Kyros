
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

function getPageNumbers(currentPage, totalPages) {
  const pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showPageSize = true,
  showSummary = true,
  className = "",
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem =
    totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;

  const endItem = Math.min(safePage * pageSize, totalItems);

  const pages = getPageNumbers(safePage, totalPages);

  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === safePage) return;
    onPageChange?.(page);
  };

  if (totalItems === 0) return null;

  return (
    <div className={`institute-pagination ${className}`}>
      <div className="institute-pagination-left">
        {showSummary && (
          <span className="institute-pagination-summary">
            Showing <strong>{startItem}–{endItem}</strong> of{" "}
            <strong>{totalItems}</strong> records
          </span>
        )}

        {showPageSize && onPageSizeChange && (
          <label className="institute-pagination-size">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(event) =>
                onPageSizeChange(Number(event.target.value))
              }
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="institute-pagination-controls">
        <button
          type="button"
          className="institute-pagination-arrow"
          onClick={() => changePage(1)}
          disabled={safePage === 1}
          aria-label="First page"
          title="First page"
        >
          <ChevronsLeft size={15} />
        </button>

        <button
          type="button"
          className="institute-pagination-arrow"
          onClick={() => changePage(safePage - 1)}
          disabled={safePage === 1}
          aria-label="Previous page"
          title="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span
              className="institute-pagination-ellipsis"
              key={`ellipsis-${index}`}
            >
              ...
            </span>
          ) : (
            <button
              type="button"
              key={page}
              className={`institute-pagination-page ${
                safePage === page ? "active" : ""
              }`}
              onClick={() => changePage(page)}
              aria-label={`Go to page ${page}`}
              aria-current={safePage === page ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          className="institute-pagination-arrow"
          onClick={() => changePage(safePage + 1)}
          disabled={safePage === totalPages}
          aria-label="Next page"
          title="Next page"
        >
          <ChevronRight size={15} />
        </button>

        <button
          type="button"
          className="institute-pagination-arrow"
          onClick={() => changePage(totalPages)}
          disabled={safePage === totalPages}
          aria-label="Last page"
          title="Last page"
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  );
}
