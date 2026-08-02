export type Category = {
  id: string;
  name: string;
  slug: string;
  color: string;
  notionColor?: string;
  icon?: string;
  promptCount?: number;
};

export type Prompt = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  thumbnail: string;
  views?: number;
  trending?: boolean;
  publishDate?: string;
  category: {
    name: string;
    slug?: string;
    color: string;
    notionColor?: string;
    icon?: string;
  }[];

};

export interface PromptGridProps {
  prompts: Prompt[];
}