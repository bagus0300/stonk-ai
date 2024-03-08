"use client"
import React, { useEffect } from "react";
import { finnhubClient } from "../../utils/FinnhubClient"

interface TickerCardProps {
  ticker: string
}

const TickerCard: React.FC<TickerCardProps> = ({ ticker }) => {

  useEffect(() => {
    finnhubClient.companyProfile2({ symbol: ticker }, (error: any, data: any, response: any) => {
        console.log(data);
      }
    );
  }, []);

  return (
    <div>TickerCard</div>
  )
}

export default TickerCard