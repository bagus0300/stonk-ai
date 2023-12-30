"use client";
import { useState, useEffect, useContext } from "react";
import { Article } from "@/types/Article";
import { SearchContext, SearchContextProps } from "@/contexts/SearchContext";
import Card from "@/components/News/Card";
import Loading from "@/components/Loader/Loading";

const NewsDisplay = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { searchQuery, category } = useContext(
    SearchContext
  ) as SearchContextProps;

  const loadArticles = async () => {
    try {
      if (!loading) {
        setLoadingMore(true);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${page}`
      );

      const data = await response.json();
      setArticles((prevArticles) => [...prevArticles, ...data.articles]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const filterArticlesUsingSearch = () => {
    if (category === "News" && searchQuery.length !== 0 && articles) {
      const searchWords = new Set(searchQuery.toLowerCase().split(/\s+/));
      const filteredData = articles.filter((item: Article) => {
        const titleWords = item.title.toLowerCase().split(/\s+/);
        const titleMatch = titleWords.some((word) => searchWords.has(word));
        const tickerMatch = searchWords.has(item.ticker.toLowerCase());
        const sentimentMatch = searchWords.has(item.sentiment.toLowerCase());
        return titleMatch || tickerMatch || sentimentMatch;
      });

      return filteredData;
    } else {
      return articles;
    }
  };

  useEffect(() => {
    loadArticles();
    setLoading(false);
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto mt-10 mb-20">
      {loading ? (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-4 ">
          <Loading />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filterArticlesUsingSearch().map((article, index) => (
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
          <div className="flex justify-center">
            {loadingMore ? (
              <div className="mt-10">
                <Loading />
              </div>
            ) : (
              <button
                className={
                  "mt-10 border text-green-500 border-green-500 hover:text-white hover:bg-green-600 transform hover:scale-105 font-semibold py-2 px-4 rounded inline-block transition duration-300 ease-in-out cursor-pointer"
                }
                onClick={loadArticles}
              >
                Load More
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NewsDisplay;
