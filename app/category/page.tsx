import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import { getCategories } from "@/lib/notion-categories";
import { getAllPrompts } from "@/lib/notion-queries";
import BrowseClient from "./BrowseClient";

type CategoryPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function CategoryPage({ searchParams }: CategoryPageProps) {
  const { category } = await searchParams;
  const selectedCategorySlug = category ?? "all";

  // Notion Data Fetching
  const allPrompts = (await getAllPrompts()) || [];
  const categories = (await getCategories()) || [];

  return (
    <>
      <Header />

      <main className="pa-container pa-section-sm">
        <SectionHeader
          title="Browse by Category"
          description="Discover premium AI prompts by category"
          align="left"
        />

        <BrowseClient
          initialPrompts={allPrompts}
          categories={categories}
          initialCategorySlug={selectedCategorySlug}
        />
      </main>

      <Footer />
    </>
  );
}