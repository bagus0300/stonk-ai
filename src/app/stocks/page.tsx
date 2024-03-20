"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import TickerCard from "@/src/components/Stocks/TickerCard";
import Loader from "@/src/components/units/Loader";
import NextButton from "@/src/components/units/NextButton";
import StockModal from "@/src/components/Stocks/StockModal";
import { StockInfo } from "@/src/types/Stock";
import MultiSelectDropdown from "@/src/components/Dropdown/Multiselect";
import { SearchContext, SearchContextProps } from "@/src/contexts/SearchContext";

const StocksPage = () => {
  const [stockInfo, setStockInfo] = useState<StockInfo[] | null>(null);
  const [filteredStockInfo, setFilteredStockInfo] = useState<StockInfo[] | null>(null);
  const [tickerOptions, setTickerOptions] = useState<string[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [currTicker, setCurrTicker] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { searchQuery } = useContext(SearchContext) as SearchContextProps;
  const PAGE_SIZE = 10;

  useEffect(() => {
    axios
      .get("/api/stock/exchange")
      .then((response) => {
        setStockInfo(response.data.stocks);
        setFilteredStockInfo(response.data.stocks);
      })
      .catch((error) => {
        console.error("Error fetching stocks from exchange:", error);
        setStockInfo(null);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/stock/ticker")
      .then((response) => {
        setTickerOptions(response.data.tickers);
      })
      .catch((error) => {
        console.error("Error fetching tickers: ", error);
      });
  }, []);

  useEffect(() => {
    if (!stockInfo) return;
    setIsLoading(true);
    const searchTerms = searchQuery.split(' ');
    const filtered = stockInfo.filter(stock =>
      searchTerms.some(term => 
        stock.displaySymbol.toLowerCase().includes(term) ||
        stock.description.toLowerCase().split(' ').some(descWord => descWord.includes(term))
      )
    );
    setFilteredStockInfo(filtered);
    setIsLoading(false);

  }, [searchQuery])

  const getFilteredTickers = async () => {
    if (!stockInfo) return;

    const filtered = stockInfo.filter(stock =>
      selectedTickers.includes(stock.symbol)
    );
  
    setFilteredStockInfo(filtered);
  };

  const loadNextPageStocks = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    }, 2000);
  };

  const handleOpenModal = (ticker: string) => {
    setIsOpen(true);
    setCurrTicker(ticker);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  }

  return (
    <>
      <div className="max-w-screen-lg mx-auto mt-3 mb-20">
        <div className="mx-10">
          <div className="font-bold text-4xl sm:text-5xl mb-2">Stocks</div>
          <div className="mt-3 text-xl">View the latest prices for 15,000+ stocks</div>
          <div className="border-b border-gray-400 mb-8 mt-6" />
          <div className="flex flex-row items-center space-x-3">
            <MultiSelectDropdown
              selectName={"Stocks"}
              originalOptions={tickerOptions}
              selectedOptions={selectedTickers}
              setSelectedOptions={setSelectedTickers}
              handleSubmit={getFilteredTickers}
            />
          </div>
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
            </>
          ) : (
            <div className="fixed top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <Loader />
            </div>
          )}
        </div>
        <div className="flex justify-center mt-10">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="flex justify-center">
              <NextButton onClick={loadNextPageStocks} />
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
