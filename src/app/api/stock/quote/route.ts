import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { QuoteInfo } from "@/src/types/Stock";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const ticker = searchParams.get("ticker");
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.NEXT_PUBLIC_FINNHUB_KEY_3}`;
    const response = await axios.get<QuoteInfo>(url);
    const quoteInfo = response.data;
    return new NextResponse(JSON.stringify({ quoteInfo }), { status: 200 });
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return new NextResponse(JSON.stringify({ error }), { status: 500 });
  }
}
