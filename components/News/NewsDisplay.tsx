"use client";
import { useState, useEffect, Suspense } from "react";
import { Article } from "@/types/Article";
import Card from "@/components/News/Card";
import Loading from "@/components/Loader/Loading";

const NewsDisplay = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${page}`
      );

      const data = await response.json();
      setArticles((prevArticles) => [...prevArticles, ...data.articles]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto mt-10 mb-20">
      {loading ? (
        <div className="text-center mt-4">
          <Loading />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
          <div className="flex justify-center mt-10">
            <button
              className={`border text-green-500 border-green-500 hover:text-white hover:bg-green-600 transform hover:scale-105 font-semibold py-2 px-4 rounded mt-4 inline-block transition duration-300 ease-in-out cursor-pointer`}
              onClick={loadArticles}
            >
              Load More
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsDisplay;
