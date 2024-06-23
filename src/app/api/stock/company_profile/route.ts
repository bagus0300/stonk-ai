import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { CompanyProfile } from "@/src/types/Stock";
import { getApiKeyList } from "@/src/utils/apiUtils";

const apiKeys = getApiKeyList(3, 12);
let currentApiKeyIdx = 0;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const ticker = searchParams.get("ticker");
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKeys[currentApiKeyIdx]}`;
    const response = await axios.get<CompanyProfile>(url);
    const company_profile = response.data;
    return new NextResponse(JSON.stringify({ company_profile }), { status: 200 });
  } catch (error) {
    currentApiKeyIdx = (currentApiKeyIdx + 1) % apiKeys.length; // Cycles through the api keys
    return new NextResponse(JSON.stringify({ error }), { status: 500 });
  }
}
