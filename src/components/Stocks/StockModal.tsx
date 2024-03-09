import React, { useState } from "react";
import Modal from "react-modal";
import { useTheme } from "next-themes";

import LineChart from "@/src/components/Stocks/LineChart";

interface StockModalProps {
  isOpen: boolean;
  ticker: string;
  handleClose: () => void;
}

const StockModal: React.FC<StockModalProps> = ({
  isOpen,
  ticker,
  handleClose,
}) => {
  const { theme } = useTheme();

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
          <div className="">
            <LineChart ticker={ticker} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StockModal;
