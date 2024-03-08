"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios'

import LineChart from "@/src/components/Stocks/LineChart";
import TickerCard from "@/src/components/Stocks/TickerCard";

interface StockInfo {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  symbol: string;
  type: string;
}

const StocksPage = () => {
  const [ stockInfo, setStockInfo ] = useState<StockInfo[] | null>(null);
  const [ filteredStockInfo, setFilteredStockInfo ] = useState<StockInfo[] | null>(null);
  const [ page, setPage ] = useState(0)

  useEffect(() => {
    const url = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.NEXT_PUBLIC_FINNHUB_KEY}`;
    axios.get(url)
      .then(response => {
        const commonStocks = response.data.filter((stock: StockInfo) => stock.type === 'Common Stock');
        setStockInfo(commonStocks);
      })
      .catch(error => {
        console.error('Error fetching company profile:', error);
        setStockInfo(null);
      });
  }, []);

  useEffect(() => {
    console.log(stockInfo);
  }, [stockInfo]);
  

  return (
    <>
      {stockInfo ? stockInfo
        .slice(0, 10)
        .map((stock) => (
        <TickerCard key={stock.symbol} ticker={stock.symbol} />
      )) : <p>Loading stocks...</p>}
      {/* <LineChart ticker="AAPL" /> */}
    </>
  );
};

export default StocksPage;
