"use client";

import Link from "next/link";

import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import PromptGrid from "@/components/ui/prompt-grid/PromptGrid";
import { Prompt } from "@/types/prompt";

type LatestProps = {
  prompts: Prompt[];
};

export default function Latest({ prompts }: LatestProps) {
  // Always pass top 9 items to Grid, CSS media queries will handle hiding (5 on Mobile, 6 on Tablet, 9 on Desktop)
  const visiblePrompts = prompts.slice(0, 9);

  return (
    <section className="latest-section">
      <Container>
        <SectionHeader title="✨Latests Prompts" />

        <PromptGrid prompts={visiblePrompts} />

        {prompts.length > 5 && (
          <div className="section-view-all">
            <Link href="/latest" className="btn-outline">
              View All Prompts
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}