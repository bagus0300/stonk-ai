import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useTheme } from "next-themes";
import axios from "axios";

import {
  PriceData,
  LiveTradeData,
  DEFAULT_PRICE_DATA,
  DEFAULT_LIVE_TRADE_DATA,
} from "@/src/types/Stock";
import { getPriceDiffStr, getPercentChangeStr } from "@/src/utils/priceUtils";
import { dateToISOString } from "@/src/utils/dateUtils";
import WebSocketManager from "@/src/websocket/SocketManager";
import LineChart from "@/src/components/Stocks/LineChart";
import DataTable from "@/src/components/Stocks/DataTable";

interface StockModalProps {
  company: string;
  ticker: string;
  isOpen: boolean;
  handleClose: () => void;
}

const StockModal: React.FC<StockModalProps> = ({ company, ticker, isOpen, handleClose }) => {
  const { theme } = useTheme();
  const [selectedRange, setSelectedRange] = useState("YTD");
  const [startDate, setStartDate] = useState(new Date());
  const [stockDataMap, setStockDataMap] = useState(new Map<string, PriceData[]>());
  const [latestTrade, setlatestTrade] = useState<LiveTradeData>(DEFAULT_LIVE_TRADE_DATA);
  const [currPriceData, setCurrPriceData] = useState<PriceData>(DEFAULT_PRICE_DATA);

  const getCurrTickerData = () => {
    return stockDataMap.get(ticker) || [];
  };

  const getPriceDataRange = () => {
    const tickerData = getCurrTickerData();
    const priceDateRange = tickerData.filter((priceData) => {
      const date = new Date(priceData.date);
      return date >= startDate && date <= new Date();
    });
    return priceDateRange;
  };

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/stock/tinngo_stock_prices`,
          {
            params: {
              ticker: ticker,
              start_date: dateToISOString(startDate),
              end_date: dateToISOString(new Date()),
              format: "json",
              resampleFreq: "monthly",
            },
          }
        );
        const priceData = response.data.map((d: PriceData) => ({
          date: new Date(d?.date),
          open: +d?.open,
          close: +d?.close,
          low: +d?.low,
          high: +d?.high,
          volume: +d?.volume,
          adjOpen: +d?.adjOpen,
          adjHigh: +d?.adjHigh,
          adjLow: +d?.adjLow,
          adjClose: +d?.adjClose,
          adjVolume: +d?.adjVolume,
          divCash: +d?.divCash,
          splitFactor: +d?.splitFactor,
        }));
        setStockDataMap((prevMap) => new Map(prevMap.set(ticker, priceData)));
      } catch (error) {
        console.error("Failed to fetch stock prices:", error);
      }
    };

    if (isOpen) {
      const tickerStockData = getCurrTickerData();
      // Fetch price data on intial load
      if (tickerStockData.length === 0) {
        fetchStockPrices();
      }
      // Fetch uncached price data
      else {
        const earliestData = new Date(tickerStockData[0].date);
        if (startDate < earliestData) {
          fetchStockPrices();
        }
      }
    }
  }, [ticker, startDate]);

  useEffect(() => {
    const tickerData = getCurrTickerData();
    if (tickerData.length > 0) {
      // Record the most recent closing price
      const mostRecentData = tickerData[tickerData.length - 1];
      setCurrPriceData(mostRecentData);
    }
  }, [stockDataMap, ticker]);

  useEffect(() => {
    const fetchLatestTrade = (wsManager: WebSocketManager) => {
      const latestTrade = wsManager.getLatestTrade(ticker);
      setlatestTrade(latestTrade);
    };
    if (isOpen) {
      const wsManager = WebSocketManager.getInstance();
      wsManager.addSubListener([ticker]);
      setInterval(() => fetchLatestTrade(wsManager!), 5000);
    }
    // else {
    //   wsManager.unsubscribe(ticker);
    // }
  }, [isOpen, ticker]);

  useEffect(() => {
    const calculateStartDate = (range: string) => {
      const today = new Date();
      let start = new Date();

      switch (range) {
        case "1W":
          start.setDate(today.getDate() - 7);
          break;
        case "1M":
          start.setMonth(today.getMonth() - 1);
          break;
        case "3M":
          start.setMonth(today.getMonth() - 3);
          break;
        case "6M":
          start.setMonth(today.getMonth() - 6);
          break;
        case "YTD":
          start = new Date(today.getFullYear(), 0, 1);
          break;
        case "1Y":
          start.setFullYear(today.getFullYear() - 1);
          break;
        case "2Y":
          start.setFullYear(today.getFullYear() - 2);
          break;
        case "5Y":
          start.setFullYear(today.getFullYear() - 5);
          break;
        default:
          start.setDate(today.getDate() - 7);
      }
      setStartDate(start);
    };

    calculateStartDate(selectedRange);
  }, [selectedRange]);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Task Modal"
      className="modal fixed inset-0 flex items-center justify-center z-50"
      ariaHideApp={false}
    >
      <div className="relative w-full max-w-5xl max-h-[calc(100vh-5rem)] overflow-y-auto ">
        <div
          className="relative pb-10 border-gray-400 border-2 rounded-xl"
          style={{ backgroundColor: theme === "light" ? "white" : "black" }}
        >
          <div className="flex items-center justify-between p-4 md:p-5 border-b dark:border-gray-600">
            <h3 className="text-xl font-semibold ">
              {company} ({ticker})
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white hover:text-gray-900 font-bold rounded-lg text-xl ml-5 w-10 h-10 ms-auto inline-flex justify-center items-center"
              onClick={handleClose}
            >
              X<span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="flex justify-around p-4">
            {["1W", "1M", "3M", "6M", "YTD", "1Y", "2Y", "5Y"].map((range) => (
              <button
                key={range}
                className={`relative overflow-hidden py-2 px-4 rounded-lg ${
                  selectedRange === range ? "bg-gray-600 text-white" : "bg-transparent"
                } group`}
                onClick={() => handleRangeChange(range)}
              >
                {range}
                {selectedRange != range && (
                  <span
                    className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                    style={{
                      backgroundColor: theme === "light" ? "black" : "white",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex flex-col items-start ml-[12vw] p-4">
            <div className="flex space-x-3">
              <p className="text-xl font-semibold">{`${currPriceData.close}`}</p>
              <p
                className={`text-lg font-semibold ${
                  currPriceData.priceDifference >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {getPriceDiffStr(currPriceData.open, currPriceData.close)}
                <span>
                  {` `}({getPercentChangeStr(currPriceData.open, currPriceData.close)})
                </span>
              </p>
            </div>
            <p className="text-sm mt-1">{`At close on ${currPriceData.date}`}</p>
          </div>
          <LineChart ticker={ticker} priceData={getPriceDataRange()} />
          <div className="flex justify-center ">
            <div className="w-4/5 sm:w-1/2">
              <DataTable currPriceData={currPriceData} latestTradeData={latestTrade} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StockModal;
