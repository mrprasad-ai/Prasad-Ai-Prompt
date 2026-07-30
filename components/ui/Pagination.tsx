"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/pagination.css";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Screen size check karne ke liye hook
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = isMobile ? 5 : 7; // Mobile me 5, Desktop me 7 slots

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (isMobile) {
        // Mobile Logic (Max 5 Slots: 1 ... active ... totalPages)
        if (currentPage <= 3) {
          pages.push(2, 3, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push("...", totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push("...", currentPage, "...", totalPages);
        }
      } else {
        // Desktop Logic (Max 7 Slots: 1 ... prev active next ... totalPages)
        if (currentPage > 3) pages.push("...");

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="pa-pagination">
      <button
        className="pa-page-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <ChevronLeft size={18} />
      </button>

      {getPageNumbers().map((page, idx) =>
        typeof page === "number" ? (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`pa-page-num ${
              currentPage === page ? "is-active" : ""
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={`dots-${idx}`} className="pa-page-dots">
            {page}
          </span>
        )
      )}

      <button
        className="pa-page-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}