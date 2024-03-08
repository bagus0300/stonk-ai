"use client";
import React, { useEffect } from "react";
import LineChart from "@/src/components/Stocks/LineChart";
import TickerCard from "@/src/components/Stocks/TickerCard";
// import { finnhubClient } from "@/src/utils/FinnhubClient";

const StocksPage = () => {
  useEffect(() => {
    const finnhub = require("finnhub");
    const api_key = finnhub.ApiClient.instance.authentications["api_key"];
    api_key.apiKey = process.env.NEXT_PUBLIC_FINNHUB_KEY;
    const finnhubClient = new finnhub.DefaultApi();
    finnhubClient.stockSymbols("US", (error: any, data: any, response: any) => {
      console.log(data);
    });
  }, []);
  return (
    <>
      <TickerCard ticker="TSLA" />
      <LineChart ticker="AAPL" />
    </>
  );
};

export default StocksPage;
