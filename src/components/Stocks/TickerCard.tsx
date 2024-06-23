"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";

import { CompanyProfile } from "@/src/types/Stock";
import { getPriceDiffStr } from "@/src/utils/priceUtils";
import { fetchQuoteInfo } from "@/src/queries/stockQueries";

interface TickerCardProps {
  ticker: string;
}

const TickerCard: React.FC<TickerCardProps> = ({ ticker }) => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [fetchSuccess, setFetchSuccess] = useState(true);

  const { data: tickerQuote } = useQuery(`${ticker}_quote`, () => fetchQuoteInfo(ticker));

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get(`/api/stock/company_profile/?ticker=${ticker}`);
        setCompanyProfile(response.data.company_profile);
      } catch (error) {
        console.error("Error fetching company profile:", error);
        setCompanyProfile(null);
        setFetchSuccess(false);
      }
    };

    if (ticker) {
      fetchCompanyProfile();
    }
  }, [ticker]);

  if (!fetchSuccess) {
    return null;
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-10 mb-10 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105">
      {companyProfile && (
        <div className="shadow-md border-md border dark:border-white rounded-lg overflow-hidden p-4 flex items-center space-x-4">
          <img
            src={companyProfile.logo}
            alt={`${companyProfile.name} logo`}
            className="w-12 h-12"
          />
          <div className="flex-grow">
            <p className="text-sm">
              {companyProfile.ticker} - {companyProfile.name} - {companyProfile.exchange}
            </p>
          </div>
          {tickerQuote && (
            <div className="flex flex-col items-center text-sm p-2 font-bold">
              <p>{tickerQuote.c.toFixed(2)}</p>
              <p
                className={`inline-block px-2 py-1 rounded text-white ${
                  tickerQuote.o > tickerQuote.c ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {getPriceDiffStr(tickerQuote.o, tickerQuote.c)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TickerCard;
