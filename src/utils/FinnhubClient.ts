const finnhub = require("finnhub");
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = process.env.NEXT_PUBLIC_FINNHUB_KEY;
export const finnhubClient = new finnhub.DefaultApi();