"use client";

import { Prompt } from "@/types/prompt";
import PromptGrid from "@/components/ui/prompt-grid/PromptGrid";
import Pagination from "@/components/ui/Pagination"; // Apne Pagination component ka exact path check kar lein
import { usePaginationState } from "@/hooks/usePaginationState";

type LatestClientProps = {
  prompts: Prompt[];
};

export default function LatestClient({ prompts }: LatestClientProps) {
  const itemsPerPage = 9; // Har page par kitne prompts dikhane hain
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