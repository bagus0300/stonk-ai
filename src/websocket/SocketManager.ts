import { LiveTradeData } from "@/src/types/Stock";

class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: WebSocket;
  private prices: Record<string, LiveTradeData>;

  public constructor() {
    this.prices = {};
    this.socket = new WebSocket(
      `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_KEY_4}`
    );
    this.socket.addEventListener("message", this.messageHandler);
    this.socket.addEventListener("error", (error) =>
      console.error("WebSocket error:", error)
    );
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new WebSocketManager();
    return this.instance;
  }

  public addSubListener(tickerList: string[]) {
    this.socket.addEventListener("open", () => this.subscribe(tickerList));
    console.log("Connected");
  }

  private subscribe(tickerList: string[]) {
    tickerList.forEach((ticker) => {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: "subscribe", symbol: ticker }));
        console.log("Subscribed to ticker:", ticker);
      }
    });
  }

  public unsubscribe(ticker: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "unsubscribe", symbol: ticker }));
      this.prices = {}; // Reset the local price state
    }
  }

  private parseTradeMessage = (trades: LiveTradeData[]) => {
    let totalVolume = 0;
    let largestTimestamp = 0;
    let totalPrice = 0;
    let count = 0;
    trades.forEach((trade) => {
      totalVolume += trade.v;

      if (trade.t > largestTimestamp) {
        largestTimestamp = trade.t;
      }

      totalPrice += trade.p;
      count += 1;
    });
    let averagePrice = totalPrice / count;
    averagePrice = parseFloat(averagePrice.toFixed(2));
    return {
      t: largestTimestamp,
      p: averagePrice,
      v: totalVolume,
    };
  };

  private messageHandler = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "trade") {
        const trades = message.data;
        const parsedMessage = this.parseTradeMessage(trades);
        this.prices[trades[0].s] = {
          // Add latest price to the buffer every second
          t: parsedMessage.t,
          p: parsedMessage.p,
          v: parsedMessage.v,
        };
      }
    } catch (error) {
      console.error("Error parsing message data: ", error);
    }
  };

  public getLatestTrade(ticker: string) {
    return this.prices[ticker];
  }
}

export default WebSocketManager;
