"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import CTAButton from "../ui/CTAButton";

export default function Search() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault(); // Default form submit reload ko rokega
    
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      // URL query parameter ke saath Search Page par redirect karein
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-box">
      <div className="search-icon">
        <SearchIcon size={20} strokeWidth={2} />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search prompts..."
        className="search-input"
      />

      <CTAButton type="submit" className="search-button">
        Search
      </CTAButton>
    </form>
  );
}