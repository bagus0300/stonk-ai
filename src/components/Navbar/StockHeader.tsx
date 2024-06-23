import React from "react";
import { useQuery } from "react-query";

import HeaderCard from "@/src/components/Navbar/HeaderCard";
import { fetchTickerList } from "@/src/queries/stockQueries";

const StockHeader = () => {
  const { data: tickerList } = useQuery("tickerList", fetchTickerList, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <div className="flex overflow-x-scroll space-x-2 p-2">
      {tickerList &&
        tickerList.map((ticker: string, index: number) => (
          <HeaderCard key={index} ticker={ticker} />
        ))}
    </div>
  );
};

export default StockHeader;
