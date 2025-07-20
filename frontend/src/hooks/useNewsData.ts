// src/hooks/useNewsData.ts
import { useEffect, useState } from "react";
import Papa from "papaparse";

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publisher: string;
  image?: string;
  category: string;
}

type NewsByCategory = Record<string, NewsItem[]>;

const useNewsData = (): [NewsByCategory, boolean] => {
  const [newsData, setNewsData] = useState<NewsByCategory>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse("/news_feed.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const grouped: NewsByCategory = {};
        (result.data as NewsItem[]).forEach((item) => {
          const category = item.category || "Uncategorized";
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(item);
        });
        setNewsData(grouped);
        setLoading(false);
      },
    });
  }, []);

  return [newsData, loading];
};

export default useNewsData;
