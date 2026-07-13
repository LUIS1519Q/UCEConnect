import { ChevronLeft, ChevronRight } from "../../icons";

import { Button } from "../../atoms/Button";

import type { PaginationProps } from "./Pagination.types";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const maxVisiblePages = 5;

  let startPage = Math.max(
    1,
    currentPage - Math.floor(maxVisiblePages / 2)
  );

  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;

    startPage = Math.max(
      1,
      endPage - maxVisiblePages + 1
    );
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        <ChevronLeft size={18} />

        <span>Previous</span>
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          variant={
            page === currentPage
              ? "primary"
              : "ghost"
          }
          size="sm"
          aria-current={
            page === currentPage
              ? "page"
              : undefined
          }
          onClick={() =>
            onPageChange(page)
          }
        >
          {page}
        </Button>
      ))}

      <Button
        variant="ghost"
        size="sm"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        <span>Next</span>

        <ChevronRight size={18} />
      </Button>
    </nav>
  );
}