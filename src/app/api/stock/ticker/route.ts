import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/stock/tickers`
    const response = await axios.get(url);
    const tickers = response.data;
    return new NextResponse(JSON.stringify({ tickers }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error }), { status: 500 });
  }
}
