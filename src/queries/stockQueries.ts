import axios from "axios";

export const fetchTickerList = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stock/tickers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tickers:", error);
  }
};

export const fetchQuoteInfo = async (ticker: string) => {
  try {
    const response = await axios.get(`/api/stock/quote/?ticker=${ticker}`);
    return response.data.quoteInfo;
  } catch (error) {
    console.error(`Error fetching quote info for ${ticker}:`, error);
    throw error;
  }
};
