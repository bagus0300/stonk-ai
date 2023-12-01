"use client";
import { useState, useEffect } from "react";
import { Article } from "@/types/Article";
import Card from "@/components/Card";

const NewsDisplay = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);

  const loadArticles = async () => {
    try {
        const response = await fetch(`http://localhost:8000/articles/${page}`)
      const data = await response.json();
      setArticles((prevArticles) => [...prevArticles, ...data.articles]);
      setLoading(false);
      setPage((prevPage) => prevPage + 1);
      if (data.articles.length === 0) {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Handles initial loading
  useEffect(() => {
    loadArticles();
    console.log("added");
  }, []);

  // Handles lazy loading
  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
      ) {
        console.log(page);
        loadArticles();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  return (
    <div className="max-w-screen-lg mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article, index) => (
          <Card
            key={index}
            title={article.title}
            publication_datetime={article.publication_datetime}
            summary={article.summary}
            ticker={article.ticker}
            sentiment={article.sentiment}
            image_url={article.image_url}
            article_url={article.article_url}
            market_date={article.market_date}
            open_price={article.open_price}
            close_price={article.close_price}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsDisplay;
