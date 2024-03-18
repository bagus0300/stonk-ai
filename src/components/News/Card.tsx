import React from "react";
import { Article } from "@/src/types/Article";

import { getPriceDifference, getPriceAction } from "@/src/utils/FilterUtils"

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
  const truncateSummary = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  

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
            className={`text-xl font-semibold ${
              sentiment === "Positive"
                ? "text-green-500"
                : sentiment === "Negative"
                ? "text-red-500"
                : ""
            }`}
          >
            {sentiment}
          </p>
        </div>
        <p>{truncateSummary(summary, 300)}</p>

        <h1 className="italic mt-4 text-lg mb-2">Price Action On: {market_date}</h1>
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
