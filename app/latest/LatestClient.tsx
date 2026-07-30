"use client";

import { useState } from "react";
import { Prompt } from "@/types/prompt";
import PromptGrid from "@/components/ui/prompt-grid/PromptGrid";
import Pagination from "@/components/ui/Pagination"; // Apne Pagination component ka exact path check kar lein

type LatestClientProps = {
  prompts: Prompt[];
};

export default function LatestClient({ prompts }: LatestClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9; // Har page par kitne prompts dikhane hain

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