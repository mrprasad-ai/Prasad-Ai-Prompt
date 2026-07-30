import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getTrendingPrompts } from "@/lib/notion-queries";
import TrendingClient from "./TrendingClient";

export default async function TrendingPage() {
  const trendingPromptsRaw = await getTrendingPrompts();

  // Valid Prompts filter karein
  const trendingPrompts = (trendingPromptsRaw || []).filter(
    (prompt) => prompt && prompt.title && prompt.thumbnail
  );

  return (
    <main>
      <Header />
      <section style={{ padding: "40px 0 60px" }}>
        <Container>
          <SectionHeader
            title="Trending Prompts🔥"
            description="Explore all the most popular AI prompts"
            align="left"
          />
          
          {/* Client Component with Pagination */}
          <TrendingClient prompts={trendingPrompts} />
        </Container>
      </section>
      <Footer />
    </main>
  );
}