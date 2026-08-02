import PromptCard from "@/components/ui/prompt-card";
import { Prompt } from "@/types/prompt";
import "./prompt-grid.css";

type PromptGridProps = {
  prompts: Prompt[];
};

export default function PromptGrid({
  prompts,
}: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="prompt-grid-empty">
        <p>No prompts available.</p>
      </div>
    );
  }

  return (
    <div className="prompt-grid">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          href={`/prompt/${prompt.slug}`}
          title={prompt.title}
          description={prompt.shortDescription}
          thumbnail={prompt.thumbnail}
          category={prompt.category}
        />
      ))}
    </div>
  );
}