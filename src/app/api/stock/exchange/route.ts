import axios from "axios";
import { NextResponse } from "next/server";

import { StockInfo } from "@/src/types/Stock";

export async function GET() {
  try {
    const url = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.NEXT_PUBLIC_FINNHUB_KEY_1}`;
    const response = await axios.get<StockInfo[]>(url);
    const stocks = response.data
      .filter((stock) => stock.type === "Common Stock")
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
    return new NextResponse(JSON.stringify({ stocks }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error }), { status: 500 });
  }
}
