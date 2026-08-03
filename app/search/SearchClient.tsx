"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Frown } from "lucide-react";
import { Prompt } from "@/types/prompt";
import PromptGrid from "@/components/ui/prompt-grid/PromptGrid";
import Pagination from "@/components/ui/Pagination";
import { usePaginationState } from "@/hooks/usePaginationState"; // 💡 Hook import karein

type SearchClientProps = {
  prompts: Prompt[];
  queryParam: string;
};

export default function SearchClient({ prompts, queryParam }: SearchClientProps) {
  const itemsPerPage = 9;
  const { currentPage, changePage } = usePaginationState();

  // 💡 Sirf tabhi page 1 par reset ho jab query badle, back aane par nahi
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageFromUrl = params.get("page");
    
    if (!pageFromUrl) {
      changePage(1);
    }
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

  return (
    <>
      <PromptGrid prompts={currentPrompts} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}
        />
      )}
    </>
  );
}