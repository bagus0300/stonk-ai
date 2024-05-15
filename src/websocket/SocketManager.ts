import { TradeData } from "@/src/types/Stock";

class WebSocketManager {
  private socket: WebSocket;
  private prices: Record<string, TradeData>;
  private setPrices: (prices: Record<string, TradeData>) => void;

  constructor(setPrices: (prices: Record<string, TradeData>) => void) {
    this.setPrices = setPrices;
    this.prices = {};
    this.socket = new WebSocket(
      `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_KEY}`
    );
    this.socket.addEventListener("message", this.messageHandler);
    this.socket.addEventListener("error", (error) =>
      console.error("WebSocket error:", error)
    );
  }

  public addSubListener(tickerList: string[]) {
    this.socket.addEventListener("open", () => this.subscribe(tickerList));
  }

  private subscribe(tickerList: string[]) {
    tickerList.forEach((ticker) => {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: "subscribe", symbol: ticker }));
      }
    });
  }

  public unsubscribe(tickerList: string[]) {
    tickerList.forEach((ticker) => {
      this.socket.send(JSON.stringify({ type: "unsubscribe", symbol: ticker }));
    });
    this.prices = {}; // Reset the local price state
  }

  private messageHandler = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "trade") {
        this.prices[message.s] = {
          price: message.p,
          time: message.t,
          volume: message.v,
        };
        this.setPrices({ ...this.prices });
      }
    } catch (error) {
      console.error("Error parsing message data: ", error);
    }
  };

  public disconnect() {
    this.socket.close();
  }
}

export default WebSocketManager;
