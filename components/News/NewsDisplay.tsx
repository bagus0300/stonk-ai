"use client";
import { useState, useEffect, useContext } from "react";
import { Article } from "@/types/Article";
import { SearchContext, SearchContextProps } from "@/contexts/SearchContext";
import Card from "@/components/News/Card";
import Loading from "@/components/Loader/Loading";
import MultiSelectDropdown from "@/components/Dropdown/Multiselect";
import SingleSelectDropdown from "@/components/Dropdown/Singleselect";

const NewsDisplay = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const tickerOptions = [
    "AAPL",
    "MSFT",
    "AMZN",
    "GOOGL",
    "TSLA",
    "JPM",
    "V",
    "FB",
    "NVDA",
    "NFLX",
    "DIS",
    "PYPL",
    "BA",
    "JNJ",
    "KO",
    "PFE",
    "AMD",
    "XOM",
    "T",
    "WMT",
  ];
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const sentimentOptions = ["Positive", "Negative", "Neutral"];
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(
    null
  );
  const priceActionOptions = ["Positive", "Negative", "NA"];
  const [selectedPriceAction, setSelectedPriceAction] = useState<string | null>(
    null
  );
  const { searchQuery, category } = useContext(
    SearchContext
  ) as SearchContextProps;

  const loadArticles = async () => {
    try {
      const queryParams = new URLSearchParams({
        cursor: cursor.toString(),
        search_query: searchQuery || "",
        tickers: selectedTickers.join(","),
        sentiment: selectedSentiment || "",
        price_action: selectedPriceAction || "",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles?${queryParams}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getNewlyFilteredArticles = async () => {
    setLoading(true);
    setCursor(0);
    const data = await loadArticles();
    if (data) {
      setArticles(data.articles);
      setCursor(data.cursor);
      setLoading(false);
    }
  };

  const loadNextPageArticles = async () => {
    setLoadingMore(true);
    const data = await loadArticles();
    setArticles((prevArticles) => [...prevArticles, ...data.articles]);
    setCursor(data.cursor);
    setLoadingMore(false);
  };

  useEffect(() => {
    getNewlyFilteredArticles();
  }, [selectedSentiment, selectedPriceAction, searchQuery]);

  return (
    <div className="max-w-screen-lg mx-auto mt-3 mb-20">
      <div className="mx-10">
        <div className="font-bold text-5xl mb-2">News</div>
        <div className="mt-3 text-xl">View the latest financial news</div>
        <div className="border-b border-gray-400 mb-2m mt-3"></div>
        <div className="mt-5 flex gap-3"></div>
        <div className="flex flex-row items-center space-x-3">
          <MultiSelectDropdown
            originalOptions={tickerOptions}
            selectedOptions={selectedTickers}
            setSelectedOptions={setSelectedTickers}
            handleSubmit={getNewlyFilteredArticles}
          />
          <SingleSelectDropdown
            placeholder={"Sentiment"}
            originalOptions={sentimentOptions}
            selectedOption={selectedSentiment}
            setSelectedOption={setSelectedSentiment}
          />
          <SingleSelectDropdown
            placeholder={"Price Action"}
            originalOptions={priceActionOptions}
            selectedOption={selectedPriceAction}
            setSelectedOption={setSelectedPriceAction}
          />
        </div>
        <div />
        {loading ? (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <Loading />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-7 mx-10">
              {articles.map((article: Article, index: number) => (
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
              ) : articles.length != 0 ? (
                <button
                  className={
                    "mt-10 border text-green-500 border-green-500 hover:text-white hover:bg-green-600 transform hover:scale-105 font-semibold py-2 px-4 rounded inline-block transition duration-300 ease-in-out cursor-pointer"
                  }
                  onClick={loadNextPageArticles}
                >
                  Load More
                </button>
              ) : (
                <div>No Articles Available</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsDisplay;
