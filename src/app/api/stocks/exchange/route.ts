import axios from "axios";

import { StockInfo } from "@/src/types/Stock";

export async function GET() {
  try {
    const url = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.FINNHUB_KEY}`;
    const response = await axios.get<StockInfo[]>(url);
    const stocks = response.data
      .filter((stock) => stock.type === "Common Stock")
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
    return Response.json({ stocks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stock info:", error);
    return Response.json({ error }, { status: 500 });
  }
}
