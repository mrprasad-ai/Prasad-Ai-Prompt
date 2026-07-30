import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Trending from "@/components/home/Trending";
import Latest from "@/components/home/Latest";
import Footer from "@/components/layout/Footer";

import {
  getTrendingPrompts,
  getLatestPrompts,
} from "@/lib/notion-queries";

import { getCategories } from "@/lib/notion-categories";

export default async function HomePage() {
  const [
    trendingPrompts,
    latestPrompts,
    categories,
  ] = await Promise.all([
    getTrendingPrompts(),
    getLatestPrompts(),
    getCategories(),
  ]);

  return (
    <main>
      <Header />

      <Hero />

      <Categories
        categories={categories}
      />

      <Trending
        prompts={trendingPrompts}
      />

      <Latest
        prompts={latestPrompts}
      />

      <Footer />
    </main>
  );
}