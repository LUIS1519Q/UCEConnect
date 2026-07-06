import { ChevronLeft, ChevronRight } from "../../icons";

import { Button } from "../../atoms/Button";

import type { PaginationProps } from "./Pagination.types";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={18} />
        Prev
      </Button>

      {Array.from(
        { length: totalPages },
        (_, index) => {
          const page = index + 1;

          return (
            <Button
              key={page}
              variant={
                page === currentPage
                  ? "primary"
                  : "ghost"
              }
              size="sm"
              onClick={() =>
                onPageChange(page)
              }
            >
              {page}
            </Button>
          );
        }
      )}

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
        Next
        <ChevronRight size={18} />
      </Button>
    </div>
  );
}