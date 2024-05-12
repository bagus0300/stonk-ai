import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useTheme } from "next-themes";
import dayjs from "dayjs";
import axios from "axios";

import { PriceData } from "@/src/types/Stock";
import LineChart from "@/src/components/Stocks/LineChart";

interface StockModalProps {
  isOpen: boolean;
  ticker: string;
  handleClose: () => void;
}

interface Message {
  data: string;
}

const StockModal: React.FC<StockModalProps> = ({
  isOpen,
  ticker,
  handleClose,
}) => {
  const { theme } = useTheme();
  const [selectedRange, setSelectedRange] = useState("YTD");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [messages, setMessages] = useState<Message[]>([]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currPriceData, setCurrPriceData] = useState({
    date: new Date(),
    open: 0,
    close: 0,
    priceChange: 0,
    percentChange: 0,
    low: 0,
    high: 0,
    volume: 0,
  });

  useEffect(() => {
    const formatDate = (date: Date) => dayjs(date).format("YYYY-MM-DD");

    const fetchStockPrices = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/stock/tinngo_stock_prices`,
          {
            params: {
              ticker: ticker,
              start_date: formatDate(startDate),
              end_date: formatDate(endDate),
              format: "json",
              resampleFreq: "monthly",
            },
          }
        );

        const formattedData = response.data.map((d: any) => ({
          date: new Date(d?.date),
          open: +d?.open,
          close: +d?.close,
          low: +d?.low,
          high: +d?.high,
          volume: +d?.adjVolume,
        }));

        setPriceData(formattedData);
      } catch (error) {
        console.error("Failed to fetch stock prices:", error);
      }
    };

    fetchStockPrices();
  }, [ticker, startDate, endDate]);

  useEffect(() => {
    if (priceData.length > 0) {
      const mostRecentData = priceData[priceData.length - 1];

      const priceChange = mostRecentData.close - mostRecentData.open;
      const percentChange = (priceChange / mostRecentData.open) * 100;

      setCurrPriceData({
        date: new Date(mostRecentData.date),
        open: mostRecentData.open,
        close: mostRecentData.close,
        priceChange: priceChange,
        percentChange: percentChange,
        low: mostRecentData.low,
        high: mostRecentData.high,
        volume: mostRecentData.volume,
      });
    }
  }, [priceData]);

  useEffect(() => {
    const socket = new WebSocket(
      `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_KEY}`
    );

    const openHandler = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "subscribe", symbol: ticker }));
      }
    };

    const messageHandler = (event: MessageEvent) => {
      // console.log("Message from server: ", event.data);
      setMessages((prevMessages) => [...prevMessages, { data: event.data }]);
    };

    socket.addEventListener("open", openHandler);
    socket.addEventListener("message", messageHandler);

    return () => {
      // socket.removeEventListener("open", openHandler);
      // socket.removeEventListener("message", messageHandler);
      // if (socket.readyState === WebSocket.OPEN) {
      //   socket.send(JSON.stringify({ type: "unsubscribe", symbol: ticker }));
      // }
      // socket.close();
    };
  }, [ticker]);

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

  useEffect(() => {
    const calculateEndDate = () => {
      const today = new Date();
      const dayOfWeek = today.getDay();

      if (dayOfWeek === 0) {
        today.setDate(today.getDate() - 2);
      } else if (dayOfWeek === 6) {
        today.setDate(today.getDate() - 1);
      }

      return today;
    };
    setEndDate(calculateEndDate());
  }, []);

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
      <div className="relative p-4 w-full max-w-5xl max-h-full ">
        <div
          className="relative rounded-lg"
          style={{ backgroundColor: theme === "light" ? "white" : "black" }}
        >
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold ">{ticker}</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                  selectedRange === range
                    ? "bg-gray-600 text-white"
                    : "bg-transparent"
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
              <p className="text-xl font-semibold">{currPriceData.close}</p>
              <p
                className={`text-lg font-semibold ${
                  currPriceData.priceChange >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {currPriceData.priceChange >= 0
                  ? `+${currPriceData.priceChange.toFixed(2)}`
                  : `${currPriceData.priceChange.toFixed(2)} `}
                <span>
                  (
                  {currPriceData.percentChange >= 0
                    ? `+${currPriceData.percentChange.toFixed(2)}`
                    : `${currPriceData.percentChange.toFixed(2)}`}
                  %)
                </span>
              </p>
            </div>
            <p className="text-sm mt-1">
              {`At close on ${currPriceData.date}`}
            </p>
          </div>

          <LineChart ticker={ticker} priceData={priceData} />
        </div>
      </div>
    </Modal>
  );
};

export default StockModal;
