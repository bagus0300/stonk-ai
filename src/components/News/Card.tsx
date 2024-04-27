"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { Article } from "@/src/types/Article";
import { getPriceDifference, getPriceAction } from "@/src/utils/FilterUtils";

const Card: React.FC<Article> = ({
  title,
  publication_datetime,
  summary,
  image_url,
  article_url,
  ticker,
  sentiment,
  market_date,
  open_price,
  close_price,
}) => {
  const [sentimentOptions, setSentimentOptions] = useState({
    Positive: new Set(),
    Negative: new Set(),
    Neutral: new Set(),
  });

  const truncateSummary = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  const getSentimentColorClass = (sentiment: string) => {
    if (sentimentOptions.Positive.has(sentiment)) return "text-green-500";
    if (sentimentOptions.Negative.has(sentiment)) return "text-red-500";
    return "";
  };

  useEffect(() => {
    const fetchSentiments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/article/sentiments`
        );
        if (response.data && response.status === 200) {
          setSentimentOptions({
            Positive: new Set(response.data.Positive),
            Negative: new Set(response.data.Negative),
            Neutral: new Set(response.data.Neutral),
          });
        }
      } catch (error) {
        console.error("Error fetching sentiment options:", error);
      }
    };

    fetchSentiments();
  }, []);

  return (
    <div className="flex-shrink-0 shadow-md border dark:border-white rounded-lg overflow-hidden flex p-4">
      <div className="w-full p-4">
        <img
          src={image_url}
          alt={title}
          className="w-full h-60 object-cover mb-3 rounded-lg"
        />
        <p className="italic mb-2">{publication_datetime}</p>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <div className="flex flex-row space-x-4">
          <p className="text-red-400 text-xl font-bold mb-2">{ticker}</p>
          <p
            className={`text-xl font-semibold ${getSentimentColorClass(sentiment)}`}
          >
            {sentiment}
          </p>
        </div>
        <p>{truncateSummary(summary, 300)}</p>

        <h1 className="italic mt-4 text-lg mb-2">
          Price Action On: {market_date}
        </h1>
        {open_price ? (
          <div className="flex flex-row space-x-4">
            <p>O: {open_price}</p>
            <p>C: {close_price}</p>
            <p
              className={`${
                open_price < close_price
                  ? "text-green-500"
                  : open_price > close_price
                  ? "text-red-500"
                  : ""
              }`}
            >
              {open_price < close_price
                ? "▲"
                : open_price > close_price
                ? "▼"
                : ""}
              {getPriceDifference(open_price, close_price)} (
              {getPriceAction(open_price, close_price)}%)
            </p>
          </div>
        ) : (
          <h1>Not available yet</h1>
        )}

        <a
          href={article_url}
          className={`border text-red-500 border-red-500 hover:text-white hover:bg-red-500 transform hover:scale-105 font-semibold py-2 px-4 rounded mt-4 inline-block transition duration-300 ease-in-out cursor-pointer`}
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default Card;
