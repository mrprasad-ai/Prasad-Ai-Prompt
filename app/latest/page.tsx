import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getLatestPrompts } from "@/lib/notion-queries";
import LatestClient from "./LatestClient";

export default async function LatestPage() {
  const latestPromptsRaw = await getLatestPrompts();

  // Valid Prompts filter karein
  const latestPrompts = (latestPromptsRaw || []).filter(
    (prompt) => prompt && prompt.title && prompt.thumbnail
  );

  return (
    <main>
      <Header />
      <section style={{ padding: "40px 0 60px" }}>
        <Container>
          <SectionHeader
            title="Latest Prompts✨"
            description="Explore all the newly added AI prompts"
            align="left"
          />
          
          {/* Client component with Pagination */}
          <LatestClient prompts={latestPrompts} />
        </Container>
      </section>
      <Footer />
    </main>
  );
}