// Types

export interface StockInfo {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  symbol: string;
  type: string;
}

export interface PriceData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  priceDifference: number;
  percentChange: number;
  volume: number;
  adjOpen: number;
  adjHigh: number;
  adjLow: number;
  adjClose: number;
  adjVolume: number;
  divCash: number;
  splitFactor: number;
}

export interface TradeData {
  price: number;
  time: number;
  volume: number;
}

export interface QuoteInfo {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  name: string;
  ticker: string;
  weburl: string;
  logo: string;
}

// Defaults

export const DEFAULT_PRICE_DATA: PriceData = {
  date: new Date(),
  open: 0,
  high: 0,
  low: 0,
  close: 0,
  priceDifference: 0,
  percentChange: 0,
  volume: 0,
  adjOpen: 0,
  adjHigh: 0,
  adjLow: 0,
  adjClose: 0,
  adjVolume: 0,
  divCash: 0,
  splitFactor: 0,
};

export const DEFAULT_TRADE_DATA: TradeData = {
  price: 0,
  time: 0,
  volume: 0,
};
