import React from "react";
import { useQuery } from "react-query";

import { getPriceColorStr, getPriceStrArrow } from "@/src/utils/priceUtils";
import { fetchQuoteInfo } from "@/src/queries/stockQueries";

interface HeaderCardProps {
  ticker: string;
}

const HeaderCard: React.FC<HeaderCardProps> = ({ ticker }) => {
  const { data: tickerQuote } = useQuery(`${ticker}_quote`, () => fetchQuoteInfo(ticker));

  return (
    <div key={ticker} className="flex-shrink-0 w-64 p-4">
      <div className="flex justify-between items-center">
        <div className="font-bold">{ticker}</div>
        <div className="text-right">{tickerQuote ? `${tickerQuote.c}` : "Loading..."}</div>
      </div>
      {tickerQuote && (
        <div className={`text-${getPriceColorStr(tickerQuote.o, tickerQuote.c)}`}>
          {getPriceStrArrow(tickerQuote.o, tickerQuote.c)}
        </div>
      )}
    </div>
  );
};

export default HeaderCard;
