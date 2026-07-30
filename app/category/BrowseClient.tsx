"use client";

import { useState, useEffect } from "react"; // 💡 FIX: useEffect import add kiya
import { LayoutGrid, Filter } from "lucide-react";
import { Prompt, Category } from "@/types/prompt";
import PromptCard from "@/components/ui/prompt-card";
import Pagination from "@/components/ui/Pagination";
import "@/styles/category-filters.css";

type BrowseClientProps = {
  initialPrompts: Prompt[];
  categories: Category[];
  initialCategorySlug?: string;
};

// 💡 FIX: Text ko slug format mein convert karne ka helper
const makeSlug = (text: string) => {
  if (!text || text === "all") return "all";
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export default function BrowseClient({
  initialPrompts,
  categories = [],
  initialCategorySlug = "all",
}: BrowseClientProps) {
  // 💡 FIX: URL param ko turant slug banakar state mein set karein
  const [selectedSlug, setSelectedSlug] = useState<string>(makeSlug(initialCategorySlug));
  const [sortBy, setSortBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  // 💡 FIX: Jab URL/Link change ho toh dropdown automatically update ho jaye
  useEffect(() => {
    setSelectedSlug(makeSlug(initialCategorySlug));
    setCurrentPage(1); // Category change par page 1 par bhej dein
  }, [initialCategorySlug]);

  // 1. Filtering Logic
  const filteredPrompts = initialPrompts.filter((prompt) => {
    if (selectedSlug === "all") return true;

    return prompt.category.some((cat) => {
      const catSlug = makeSlug(cat.name);
      return catSlug === selectedSlug;
    });
  });

  // 2. Sorting Logic
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (sortBy === "latest") {
      return (
        new Date(b.publishDate || 0).getTime() -
        new Date(a.publishDate || 0).getTime()
      );
    }
    if (sortBy === "oldest") {
      return (
        new Date(a.publishDate || 0).getTime() -
        new Date(b.publishDate || 0).getTime()
      );
    }
    return 0;
  });

  // 3. Pagination Logic
  const totalPages = Math.ceil(sortedPrompts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrompts = sortedPrompts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pa-category-container">
      {/* Top Filter Controls Bar */}
      <div className="pa-filter-bar">
        {/* Category Dropdown */}
        <div className="pa-dropdown-wrapper">
          <LayoutGrid size={18} className="pa-dropdown-icon" />
          <select
            value={selectedSlug}
            onChange={(e) => {
              setSelectedSlug(e.target.value);
              setCurrentPage(1);
            }}
            className="pa-filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name} ({cat.promptCount})
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter Dropdown */}
        <div className="pa-dropdown-wrapper">
          <Filter size={18} className="pa-dropdown-icon" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pa-filter-select"
          >
            <option value="latest">Sort by: Latest</option>
            <option value="oldest">Sort by: Oldest</option>
          </select>
        </div>
      </div>

      {/* Prompts Grid Section */}
      <div className="pa-grid-3">
        {currentPrompts.length > 0 ? (
          currentPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              {...prompt}
              description={prompt.shortDescription}
              href={`/prompt/${prompt.slug}`}
            />
          ))
        ) : (
          <div className="pa-no-prompts">No prompts found in this category.</div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}