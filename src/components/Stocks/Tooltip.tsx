import { timeFormat } from "d3-time-format";
import { format } from "d3-format";

interface ChartItem {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

const TooltipContent = {
  content: ({
    currentItem,
    xAccessor,
  }: {
    currentItem: ChartItem;
    xAccessor: (data: ChartItem) => Date;
  }) => {
    if (!currentItem) {
      return {
        x: "",
        y: [],
      };
    }

    const dateFormat = timeFormat("%Y-%m-%d");
    const numberFormat = format(".2f");

    return {
      x: dateFormat(xAccessor(currentItem)),
      y: [
        {
          label: "Open",
          value: currentItem.open ? numberFormat(currentItem.open) : "N/A",
        },
        {
          label: "High",
          value: currentItem.high ? numberFormat(currentItem.high) : "N/A",
        },
        {
          label: "Low",
          value: currentItem.low ? numberFormat(currentItem.low) : "N/A",
        },
        {
          label: "Close",
          value: currentItem.close ? numberFormat(currentItem.close) : "N/A",
        },
      ].map((line) => ({
        ...line,
        stroke: "undefined",
      })),
    };
  },
};

export default TooltipContent;