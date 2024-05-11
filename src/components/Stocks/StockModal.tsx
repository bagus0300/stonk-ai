import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useTheme } from "next-themes";

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
          <LineChart ticker={ticker} startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </Modal>
  );
};

export default StockModal;
