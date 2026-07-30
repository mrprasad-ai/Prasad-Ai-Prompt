"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Frown } from "lucide-react";
import { Prompt } from "@/types/prompt";
import PromptGrid from "@/components/ui/prompt-grid/PromptGrid";
import Pagination from "@/components/ui/Pagination";

type SearchClientProps = {
  prompts: Prompt[];
  queryParam: string;
};

export default function SearchClient({ prompts, queryParam }: SearchClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9; // Per page prompts limit

  // Query change hone par page ko reset karke 1 par lana
  useEffect(() => {
    setCurrentPage(1);
  }, [queryParam]);

  if (prompts.length === 0) {
    return (
      <div className="pa-search-empty">
        <Frown size={44} className="empty-icon" />
        <h2>No prompts found</h2>
        <p>
          We couldn't find any prompt matching "{queryParam}". Try searching
          with another keyword like "cinematic", "3d", or "portrait".
        </p>
        <Link href="/" className="empty-btn">
          Explore All Prompts
        </Link>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(prompts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrompts = prompts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PromptGrid prompts={currentPrompts} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}