"use client";

import { useState } from "react";
import { Prompt } from "@/types/prompt";
import PromptGrid from "@/components/ui/prompt-grid/PromptGrid";
import Pagination from "@/components/ui/Pagination";

type TrendingClientProps = {
  prompts: Prompt[];
};

export default function TrendingClient({ prompts }: TrendingClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9; // Per page prompts count

  // Pagination Logic
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