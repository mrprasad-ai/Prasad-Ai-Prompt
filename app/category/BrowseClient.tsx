
"use client";

import { useState, useEffect } from "react";
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

export default function BrowseClient({
  initialPrompts,
  categories = [],
  initialCategorySlug = "all",
}: BrowseClientProps) {
  // 1. Slug ya Name ke bajaye ab hum Direct Category ID (slug/id match karke) state maintain karenge
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  // 2. Initial load ya URL change hone par category ko match karke uska ID set karna
  useEffect(() => {
    if (!initialCategorySlug || initialCategorySlug === "all") {
      setSelectedCategoryId("all");
    } else {
      // URL ke slug se category dhoondho
      const matchedCat = categories.find((c) => c.slug === initialCategorySlug);
      setSelectedCategoryId(matchedCat ? matchedCat.id : "all");
    }
    setCurrentPage(1);
  }, [initialCategorySlug, categories]);

  // 3. Filtering Logic (Ab yeh Category ID ke base par chalega, name change hone par bhi nahi tutegea)
  const filteredPrompts = initialPrompts.filter((prompt) => {
    if (selectedCategoryId === "all") return true;

    // Prompt ke androni relation/category structure se match karwana
    return prompt.category.some((cat: any) => {
      // Agar category object mein ID available hai toh usse match karo
      if (cat.id) return cat.id === selectedCategoryId;
      
      // Fallback: Agar naam se match karna pade toh safe comparison
      const targetCat = categories.find((c) => c.id === selectedCategoryId);
      return targetCat && cat.name.trim().toLowerCase() === targetCat.name.trim().toLowerCase();
    });
  });

  // 4. Sorting Logic
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

  // 5. Pagination Logic
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
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setCurrentPage(1);
            }}
            className="pa-filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
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