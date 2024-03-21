"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { CompanyProfile, QuoteInfo } from "@/src/types/Stock";
import { getPriceDifference } from "@/src/utils/FilterUtils";

interface TickerCardProps {
  ticker: string;
}

const TickerCard: React.FC<TickerCardProps> = ({ ticker }) => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(
    null
  );
  const [quoteInfo, setQuoteInfo] = useState<QuoteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchSuccess, setFetchSuccess] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/api/stock/company_profile/?ticker=${ticker}`)
      .then((response) => {
        setCompanyProfile(response.data.company_profile);
      })
      .catch((error) => {
        console.error("Error fetching company profile:", error);
        setCompanyProfile(null);
        setFetchSuccess(false);
      });
  }, [ticker]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/api/stock/quote/?ticker=${ticker}`)
      .then((response) => {
        setQuoteInfo(response.data.quoteInfo);
      })
      .catch((error) => {
        console.error("Error fetching company profile:", error);
        setQuoteInfo(null);
      });
  }, []);

  if (!fetchSuccess) {
    return null;
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-10 mb-10 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105">
      {companyProfile && (
        <div className="border-md border dark:border-white rounded-lg overflow-hidden p-4 flex items-center space-x-4">
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
          {quoteInfo && (
            <div className="flex flex-col items-center text-sm p-2 font-bold">
              <p>{quoteInfo.c.toFixed(2)}</p>
              <p
                className={`inline-block rounded text-white ${
                  quoteInfo.c > quoteInfo.o ? "bg-green-500" : "bg-red-500"
                } px-2 py-1`}
              >
                {getPriceDifference(quoteInfo.o, quoteInfo.c)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TickerCard;
