import React from "react";
import LineChart from "@/src/components/Stocks/LineChart";
import TickerCard from "@/src/components/Stocks/TickerCard";

const StocksPage = () => {
  return (
    <>
      <TickerCard 
        ticker="TSLA"
      />
      <LineChart ticker="AAPL" />
    </>
  );
};

export default StocksPage;
