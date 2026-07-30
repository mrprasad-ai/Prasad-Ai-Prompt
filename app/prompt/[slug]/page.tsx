import Container from "@/components/ui/Container";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPromptBySlug } from "@/lib/notion-queries";
import PromptDetailClient from "@/components/prompt-detail/PromptDetailClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PromptDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const prompt = await getPromptBySlug(resolvedParams.slug);

  if (!prompt) {
    return (
      <>
        <Header />
        <Container>
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <h2>Prompt not found</h2>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ padding: "30px 0 60px", background: "#f8fafc" }}>
        <Container>
          <PromptDetailClient prompt={prompt} />
        </Container>
      </main>
      <Footer />
    </>
  );
}