import { useState, useEffect } from "react";
import axios from "axios";

import { QuoteInfo } from "@/src/types/Stock";
import { getPriceColorStr, getPriceStrArrow } from "@/src/utils/priceUtils";

const StockHeader = () => {
  const [tickerList, setTickerList] = useState<string[]>([]);
  const [quoteInfo, setQuoteInfo] = useState<Record<string, QuoteInfo>>({});

  useEffect(() => {
    const fetchTickerList = async () => {
      try {
        const response = await axios.get("/api/stock/ticker");
        setTickerList(response.data.tickers);
      } catch (error) {
        console.error("Error fetching tickers:", error);
      }
    };
    fetchTickerList();
  }, []);

  useEffect(() => {
    const fetchQuoteInfo = async () => {
      const fetchedQuoteInfo: Record<string, QuoteInfo> = {};
      try {
        await Promise.all(
          tickerList.map(async (ticker) => {
            try {
              const response = await axios.get(`/api/stock/quote/?ticker=${ticker}`);
              fetchedQuoteInfo[ticker] = response.data.quoteInfo;
            } catch (error) {
              console.error(`Error fetching quote info for ${ticker}:`, error);
            }
          })
        );
        setQuoteInfo(fetchedQuoteInfo);
      } catch (error) {
        console.error("Error fetching quote info:", error);
      }
    };

    if (tickerList.length > 0) {
      fetchQuoteInfo();
    }
  }, [tickerList]);

  return (
    <div className="flex overflow-x-scroll space-x-2 p-2">
      {tickerList.map((ticker: string) => (
        <div key={ticker} className="flex-shrink-0 w-64 p-4">
          <div className="flex justify-between items-center">
            <div className="font-bold">{ticker}</div>
            <div className="text-right">
              {quoteInfo && quoteInfo[ticker] ? `${quoteInfo[ticker].c}` : "Loading..."}
            </div>
          </div>
          {quoteInfo && quoteInfo[ticker] && (
            <div className={`text-${getPriceColorStr(quoteInfo[ticker].o, quoteInfo[ticker].c)}`}>
              {getPriceStrArrow(quoteInfo[ticker].o, quoteInfo[ticker].c)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StockHeader;
