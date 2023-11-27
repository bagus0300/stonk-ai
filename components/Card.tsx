import React from "react";
import { Article } from '@/types/Article'

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

  const getPriceAction = (openPrice: number, closePrice: number) => {
    return (((closePrice - openPrice) / closePrice) * 100).toFixed(2);
  };
  
  const getSentimentClass = (sentiment: string) => {
    if (sentiment === "Positive") {
      return "text-green-500";
    } else if (sentiment === "Negative") {
      return "text-red-500";
    }
  };

  const getPriceClass = (openPrice: number, closePrice: number) => {
    if (openPrice < closePrice) {
      return "text-green-500";
    } else if (openPrice > closePrice) {
      return "text-red-500";
    }
  };

  const priceActon = getPriceAction(open_price, close_price);
  const truncatedSummary = truncateSummary(summary, 300);
  const sentimentColorClass = getSentimentClass(sentiment);
  const priceActionClass = getPriceClass(open_price, close_price);

  return (
    <div className="flex-shrink-0 shadow-md rounded-lg overflow-hidden flex p-4">
      <div className="w-full p-4">
        <img
          src={image_url}
          alt={title}
          className="w-full h-48 object-cover mb-2"
        />
        <p className="mb-2">{publication_datetime}</p>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <div className="flex flex-row space-x-4">
          <p className="text-red-400 text-xl font-bold">{ticker}</p>
          <p className={`text-xl font-semibold ${sentimentColorClass}`}>
            {sentiment}
          </p>
        </div>
        <p>{truncatedSummary}</p>

        <h1 className="mt-4 text-lg">
          Price Action On:
          {market_date}
        </h1>

        <div className="flex flex-row space-x-4">
          <p>O: {open_price}</p>
          <p>C: {close_price}</p>
          <p className={`${priceActionClass}`}>
            {open_price < close_price
              ? "▲"
              : open_price > close_price
              ? "▼"
              : ""}
            {priceActon}%
          </p>
        </div>

        <a
          href={article_url}
          className="bg-red-500 hover:bg-transparent border border-red-500 font-semibold py-2 px-4 rounded mt-4 inline-block transition duration-300 ease-in-out cursor-pointer"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default Card;
