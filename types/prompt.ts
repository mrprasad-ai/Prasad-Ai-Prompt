export interface Prompt {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: {name: string;color: string;}[];
  categoryColor: string;
  thumbnail: string;
  publishDate: string;
  trending: boolean;
 
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color: string;
  notionColor?: string;
  promptCount?: number;
}

export interface PromptGridProps {
  prompts: Prompt[];
}