"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import PromptGrid from "@/components/ui/prompt-grid/PromptGrid";
import { Prompt } from "@/types/prompt";

type TrendingProps = {
  prompts: Prompt[];
};

export default function Trending({ prompts }: TrendingProps) {
  // Always pass top 9 items to Grid, CSS will instantly hide extra items based on screen size
  const visiblePrompts = prompts.slice(0, 9);

  return (
    <section className="trending-section">
      <Container>
        <SectionHeader title="🔥Trending Prompts" />
        <PromptGrid prompts={visiblePrompts} />

        {prompts.length > 5 && (
          <div className="section-view-all">
            <Link href="/trending" className="btn-outline">
              View All Prompts
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}