import { useState, useEffect } from "react";

export function usePaginationState(defaultPage = 1) {
  // 💡 Initial load par hi turant URL se page read karke state set karein
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const page = params.get("page");
      return page && !isNaN(Number(page)) ? Number(page) : defaultPage;
    }
    return defaultPage;
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get("page") ? Number(params.get("page")) : defaultPage;
      setCurrentPage(isNaN(page) ? defaultPage : page);
    };

    // 💡 Browser ka Back/Forward button (popstate) dabane par turant run ho
    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [defaultPage]);

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const params = new URLSearchParams(window.location.search);
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }

    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    
    // 💡 pushState ki jagah history update karein taaki back button exact match kare
    window.history.pushState({ page: newPage }, "", newUrl);
  };

  return { currentPage, changePage };
}