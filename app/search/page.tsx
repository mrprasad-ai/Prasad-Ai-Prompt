import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Container from "@/components/ui/Container";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";

import { getLatestPrompts } from "@/lib/notion-queries";
import "@/styles/search-page.css";
import SearchClient from "./SearchClient";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // URL params se query extract karein (?q=query)
  const resolvedParams = await searchParams;
  const queryParam = resolvedParams?.q || "";
  const cleanQuery = queryParam.trim().toLowerCase();

  // Notion se prompts fetch karein
  const allPrompts = await getLatestPrompts();

  // Multi-field Filter (Title, Description, Category)
  const filteredPrompts = !cleanQuery
    ? allPrompts
    : allPrompts.filter((prompt: any) => {
        const rawTitle = prompt.title || prompt.name || "";
        const titleMatch = String(rawTitle).toLowerCase().includes(cleanQuery);

        const rawDesc = prompt.shortDescription || prompt.description || "";
        const descMatch = String(rawDesc).toLowerCase().includes(cleanQuery);

        let categoryMatch = false;
        if (Array.isArray(prompt.category)) {
          categoryMatch = prompt.category.some((cat: any) => {
            if (typeof cat === "string") return cat.toLowerCase().includes(cleanQuery);
            if (cat?.name) return String(cat.name).toLowerCase().includes(cleanQuery);
            return false;
          });
        } else if (typeof prompt.category === "string") {
          categoryMatch = prompt.category.toLowerCase().includes(cleanQuery);
        }

        return titleMatch || descMatch || categoryMatch;
      });

  return (
    <>
      <Header />
      <main className="pa-search-page">
        <Container>
          {/* Top Heading Section */}
          <div className="pa-search-page-header">
            <Link href="/" className="back-link">
              <ArrowLeft size={18} /> Back to Home
            </Link>

            <div className="search-title-wrapper">
              <SectionHeader title="Search results" align="left" />
              {queryParam && (
                <span className="search-query-badge">"{queryParam}"</span>
              )}
            </div>

            <p className="search-results-count">
              Found {filteredPrompts.length}{" "}
              {filteredPrompts.length === 1 ? "prompt" : "prompts"}
            </p>
          </div>

          {/* Results Grid with Client-Side Pagination */}
          <SearchClient prompts={filteredPrompts} queryParam={queryParam} />
        </Container>
      </main>
      <Footer />
    </>
  );
}