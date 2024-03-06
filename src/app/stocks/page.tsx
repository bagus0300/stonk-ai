import React from 'react'
import LineChart from '@/src/components/Stocks/LineChart'

// const finnhub = require('finnhub');

// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = ""
// const finnhubClient = new finnhub.DefaultApi()

// finnhubClient.companyProfile2({'symbol': 'AAPL'}, (error: any, data: any, response: any) => {
//   console.log(data)
// });

const page = () => {
  return (
    <LineChart symbol="AAPL"/>
  )
}

export default page