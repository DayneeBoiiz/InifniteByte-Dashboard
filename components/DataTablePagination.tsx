import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPageNumbers } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-2 py-4">
      {/* Page info and navigation */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Navigation buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* First page */}
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 sm:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="size-4" />
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="size-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <Button
                    key={`ellipsis-${index}`}
                    variant="outline"
                    size="icon"
                    className="size-8"
                    disabled
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                );
              }

              const pageNumber = page as number;
              const isActive = currentPage === pageNumber;

              return (
                <Button
                  key={pageNumber}
                  variant={isActive ? "default" : "outline"}
                  size="icon"
                  className="size-8 text-xs"
                  onClick={() => table.setPageIndex(pageNumber - 1)}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="size-4" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 sm:flex"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
