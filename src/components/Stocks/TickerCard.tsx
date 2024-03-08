"use client";
import React, { useState, useEffect } from "react";
import { finnhubClient } from "../../utils/FinnhubClient";

interface TickerCardProps {
  ticker: string;
}

interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  name: string;
  ticker: string;
  weburl: string;
  logo: string;
}

const TickerCard: React.FC<TickerCardProps> = ({ ticker }) => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    finnhubClient.companyProfile2( { symbol: ticker }, (error: any, data: any, response: any) => {
        if (!error && data) {
          setCompanyProfile(data);
        } else {
          console.error("Failed to fetch company profile: ", error);
        }
      }
    );
  }, [ticker]);

  return (
    <div className="max-w-screen-lg mx-auto mt-3 mb-20">
      {companyProfile ? (
        <div 
          className="border-md border dark:border-white rounded-lg overflow-hidden p-4 flex items-center space-x-4">
          <img 
            src={companyProfile.logo} 
            alt={`${companyProfile.name} logo`} 
            className="w-12 h-12" 
          />
          <div>
            <p className="text-sm">
              {companyProfile.ticker} -{" "}
              <a
                href={companyProfile.weburl}
                target="_blank"
                rel="noopener noreferrer"
                className=""
              >
                {companyProfile.name}
              </a>{" "}
              - {companyProfile.exchange}
            </p>
          </div>
        </div>
      ) : (
        <p className="">Loading...</p>
      )}
    </div>
  );
};

export default TickerCard;
