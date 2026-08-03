"use client";

import { Prompt } from "@/types/prompt";
import PromptGrid from "@/components/ui/prompt-grid/PromptGrid";
import Pagination from "@/components/ui/Pagination";
import { usePaginationState } from "@/hooks/usePaginationState";

type TrendingClientProps = {
  prompts: Prompt[];
};

export default function TrendingClient({ prompts }: TrendingClientProps) {
  const itemsPerPage = 9; // Per page prompts count
  const { currentPage, changePage } = usePaginationState();

  // Pagination Logic
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