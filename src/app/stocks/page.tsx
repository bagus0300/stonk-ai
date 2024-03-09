"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

import TickerCard from "@/src/components/Stocks/TickerCard";
import Loader from "@/src/components/units/Loader";
import NextButton from "@/src/components/units/NextButton";
import StockModal from "@/src/components/Stocks/StockModal";
import { StockInfo } from "@/src/types/Stock";

const StocksPage = () => {
  const [stockInfo, setStockInfo] = useState<StockInfo[] | null>(null);
  const [filteredStockInfo, setFilteredStockInfo] = useState<StockInfo[] | null>(null);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [currTicker, setCurrTicker] = useState("")
  const PAGE_SIZE = 10;

  useEffect(() => {
    axios
      .get("/api/stocks/exchange")
      .then((response) => {
        setStockInfo(response.data.stocks);
        setFilteredStockInfo(response.data.stocks);
      })
      .catch((error) => {
        console.error("Error fetching stocks from exchange:", error);
        setStockInfo(null);
      });
  }, []);

  const loadNextPageStocks = () => {
    setTimeout(() => {
      setPage((prevPage) => prevPage + 1);
    }, 2000);
  };

  const handleOpenModal = (ticker: string) => {
    setIsOpen(true);
    setCurrTicker(ticker)
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  }

  return (
    <>
      <div className="max-w-screen-lg mx-auto mt-3 mb-20">
        <div className="mx-10">
          <div className="font-bold text-4xl sm:text-5xl mb-2">Stocks</div>
          <div className="mt-3 text-xl">View the latest prices</div>
          <div className="border-b border-gray-400 mb-8 mt-6" />
          <div className="flex flex-row items-center space-x-3"></div>
          {filteredStockInfo && Array.isArray(filteredStockInfo) ? (
            <>
              {filteredStockInfo && Array.isArray(filteredStockInfo) ? (
                <>
                  {filteredStockInfo.slice(0, page * PAGE_SIZE).map((stock) => (
                    <div key={stock.symbol} onClick={() => handleOpenModal(stock.symbol)}>
                      <TickerCard ticker={stock.symbol} />
                    </div>
                  ))}
                </>
              ) : null}

              <div className="flex justify-center">
                <NextButton onClick={loadNextPageStocks} />
              </div>
            </>
          ) : (
            <div className="fixed top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <Loader />
            </div>
          )}
          
        </div>
      </div>
      <StockModal 
        isOpen={isOpen} 
        ticker={currTicker}
        handleClose={handleCloseModal}
      />
    </>
  );
};

export default StocksPage;
