"use client";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { Article } from "@/src/types/Article";
import {
  SearchContext,
  SearchContextProps,
} from "@/src/contexts/SearchContext";
import { getDateDaysBefore } from "@/src/utils/FilterUtils";
import Card from "@/src/components/News/Card";
import Loader from "@/src/components/units/Loader";
import MultiSelectDropdown from "@/src/components/Dropdown/Multiselect";
import SingleSelectDropdown from "@/src/components/Dropdown/Singleselect";
import NextButton from "@/src/components/units/NextButton";

const NewsDisplay = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { searchQuery } = useContext(SearchContext) as SearchContextProps;

  const [tickerOptions, setTickerOptions] = useState<string[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState<number | null>(null);
  const [selectedPriceAction, setSelectedPriceAction] = useState<number | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<number | null>(null);

  const sentimentOptions = new Map<number, string>([
    [0, "Positive"],
    [1, "Negative"],
    [2, "Neutral"],
  ]);

  const priceActionOptions = new Map<number, string>([
    [0, "Positive"],
    [1, "Negative"],
    [2, "NA"],
  ]);

  const dateRangeOptions = new Map<number, string>([
    [0, "Last 24 hours"],
    [1, "Last 3 days"],
    [2, "Last week"],
  ]);

  const dateRanges = new Map<number, Array<string>>([
    [0, [getDateDaysBefore(1), getDateDaysBefore(0)]],
    [1, [getDateDaysBefore(3), getDateDaysBefore(0)]],
    [2, [getDateDaysBefore(7), getDateDaysBefore(0)]],
  ]);

  const loadArticles = async (curr_page: number) => {
    try {
      const sentiment =
        selectedSentiment != null
          ? sentimentOptions.get(selectedSentiment) || ""
          : "";
      const priceAction =
        selectedPriceAction != null
          ? priceActionOptions.get(selectedPriceAction) || ""
          : "";
      const dateRange =
        selectedDateRange != null ? dateRanges.get(selectedDateRange) : null;
      const startDate = dateRange ? dateRange[0] : "";
      const endDate = dateRange ? dateRange[1] : "";

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/article`,
        {
          params: {
            page: curr_page.toString(),
            search_query: searchQuery || "",
            tickers: selectedTickers.join(","),
            sentiment: sentiment,
            price_action: priceAction,
            start_date: startDate,
            end_date: endDate,
          },
        }
      );
      setPage((prev) => prev + 1);
      if (response.status === 200) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching articles: ", error);
    }
  };

  const getNewlyFilteredArticles = async () => {
    setLoading(true);
    const data = await loadArticles(0);
    setArticles(data.articles);
    setLoading(false);
  };

  const loadNextPageArticles = async () => {
    setLoadingMore(true);
    const data = await loadArticles(page + 1);
    setArticles((prevArticles) => [...prevArticles, ...data.articles]);
    setLoadingMore(false);
  };

  useEffect(() => {
    getNewlyFilteredArticles();
  }, [selectedSentiment, selectedPriceAction, searchQuery, selectedDateRange]);

  useEffect(() => {
    axios
      .get("/api/stock/ticker")
      .then((response) => {
        setTickerOptions(response.data.tickers);
      })
      .catch((error) => {
        console.error("Error fetching tickers: ", error);
      });
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto mt-3 mb-20">
      <div className="mx-10">
        <div className="font-bold text-4xl sm:text-5xl mb-2">News</div>
        <div className="mt-3 text-xl">View the latest financial news</div>
        <div className="border-b border-gray-400 mb-8 mt-6" />
        <div className="flex flex-row items-center space-x-3">
          <MultiSelectDropdown
            selectName={"Stocks"}
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
          <SingleSelectDropdown
            placeholder={"Date"}
            originalOptions={dateRangeOptions}
            selectedOption={selectedDateRange}
            setSelectedOption={setSelectedDateRange}
          />
        </div>

        {loading ? (
          <div className="fixed top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <Loader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
              {articles &&
                articles.map((article: Article, index: number) => (
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
              {loadingMore ? (
                <Loader />
              ) : articles && articles.length != 0 ? (
                <NextButton onClick={loadNextPageArticles} />
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
