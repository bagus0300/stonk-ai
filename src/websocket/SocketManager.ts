import { LiveTradeData } from "@/src/types/Stock";

class WebSocketManager {
  private socket: WebSocket;
  private prices: Record<string, LiveTradeData>;
  private tempPrices: Record<string, LiveTradeData>;
  private setPrices: (prices: Record<string, LiveTradeData>) => void;

  constructor(setPrices: (prices: Record<string, LiveTradeData>) => void) {
    this.setPrices = setPrices;
    this.prices = {};
    this.tempPrices = {};
    this.socket = new WebSocket(
      `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_KEY}`
    );
    this.socket.addEventListener("message", this.messageHandler);
    this.socket.addEventListener("error", (error) =>
      console.error("WebSocket error:", error)
    );
    setInterval(this.savePrices.bind(this), 5000);
  }

  public addSubListener(tickerList: string[]) {
    this.socket.addEventListener("open", () => this.subscribe(tickerList));
    console.log("connected");
  }

  private subscribe(tickerList: string[]) {
    tickerList.forEach((ticker) => {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: "subscribe", symbol: ticker }));
      }
    });
    console.log("subscribed");
  }

  public unsubscribe(tickerList: string[]) {
    tickerList.forEach((ticker) => {
      this.socket.send(JSON.stringify({ type: "unsubscribe", symbol: ticker }));
    });
    this.prices = {}; // Reset the local price state
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
    averagePrice = parseFloat(averagePrice.toFixed(2))
    return {
      t: largestTimestamp,
      p: averagePrice,
      v: totalVolume,
    };
  };

  private messageHandler = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      const trades = message.data;
      const parsedMessage = this.parseTradeMessage(trades)

      // console.log(parsedMessage);
      if (message.type === "trade") {
        this.tempPrices[message.s] = { // Add latest price to the buffer every second
          t: parsedMessage.t,
          p: parsedMessage.p,
          v: parsedMessage.v,
        };
      }
    } catch (error) {
      console.error("Error parsing message data: ", error);
    }
  };

  private savePrices = () => {
    this.prices = {...this.tempPrices};
    console.log
    this.setPrices(this.prices)
  };

  public disconnect() {
    this.socket.close();
  }
}

export default WebSocketManager;
