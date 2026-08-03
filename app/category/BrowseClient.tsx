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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const page = params.get("page");
      return page && !isNaN(Number(page)) ? Number(page) : 1;
    }
    return 1;
  });
  const itemsPerPage = 9;

  // 💡 URL Search Params aur Back/Forward button (popstate) ko handle karne ka foolproof tarika
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const categorySlugFromUrl = params.get("category");
      const pageFromUrl = params.get("page");

      if (!categorySlugFromUrl || categorySlugFromUrl === "all") {
        setSelectedCategoryId("all");
      } else {
        const matchedCat = categories.find((c) => c.slug === categorySlugFromUrl);
        setSelectedCategoryId(matchedCat ? matchedCat.id : "all");
      }
      
      if (pageFromUrl && !isNaN(Number(pageFromUrl))) {
        setCurrentPage(Number(pageFromUrl));
      } else {
        setCurrentPage(1);
      }
    };

    handleUrlChange();
    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [categories]);

  const filteredPrompts = initialPrompts.filter((prompt) => {
    if (selectedCategoryId === "all") return true;

    return prompt.category.some((cat: any) => {
      if (cat.id) return cat.id === selectedCategoryId;
      
      const targetCat = categories.find((c) => c.id === selectedCategoryId);
      return targetCat && cat.name.trim().toLowerCase() === targetCat.name.trim().toLowerCase();
    });
  });

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

  const totalPages = Math.ceil(sortedPrompts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrompts = sortedPrompts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 💡 Page change hone par URL mein page aur category dono maintain rahein
    const params = new URLSearchParams(window.location.search);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    const query = params.toString();
    const newUrl = query ? `/category?${query}` : "/category";
    window.history.pushState({ page }, "", newUrl);
  };

  return (
    <div className="pa-category-container">
      <div className="pa-filter-bar">
        <div className="pa-dropdown-wrapper">
          <LayoutGrid size={18} className="pa-dropdown-icon" />
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              const newCatId = e.target.value;
              setSelectedCategoryId(newCatId);
              setCurrentPage(1);

              // 💡 Dropdown change hone par URL mein category update ho aur page reset ho jaye
              const params = new URLSearchParams(window.location.search);
              params.delete("page"); // Category badalte hi page 1 ho jayega

              if (newCatId === "all") {
                params.delete("category");
              } else {
                const targetCategory = categories.find((c) => c.id === newCatId);
                if (targetCategory && targetCategory.slug) {
                  params.set("category", targetCategory.slug);
                }
              }

              const query = params.toString();
              const newUrl = query ? `/category?${query}` : "/category";
              window.history.pushState({}, "", newUrl);
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}