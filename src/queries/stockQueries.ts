import axios from "axios";

export const fetchTickerList = async () => {
  try {
    const response = await axios.get("/api/stock/ticker");
    return response.data.tickers;
  } catch (error) {
    console.error("Error fetching tickers:", error);
  }
};
