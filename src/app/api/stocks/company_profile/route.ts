import type { NextRequest } from "next/server";
import axios from "axios";

import { CompanyProfile } from "@/src/types/Stock";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const ticker = searchParams.get("ticker")
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${process.env.NEXT_PUBLIC_FINNHUB_KEY}`;
    const response = await axios.get<CompanyProfile>(url);
    const company_profile = response.data;
    return Response.json({ company_profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return Response.json({ error }, { status: 500 });
  }
}
