"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import axios from "axios";
import { scaleTime } from "d3-scale";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { XAxis, YAxis } from "@react-financial-charts/axes";
import {
  ChartCanvas,
  Chart,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  AreaSeries,
  HoverTooltip,
} from "react-financial-charts";

import TooltipContent from "@/src/components/Stocks/Tooltip"

interface LineChartProps {
  ticker: string;
}

interface ChartData {
  date: Date;
  close: number;
}

const LineChart: React.FC<LineChartProps> = ({ ticker }) => {
  const [data, setData] = useState<ChartData[]>([]);
  const { theme } = useTheme();

  const axisColor = theme === "light" ? "black" : "white";
  const xAccessor = (d: ChartData) => d.date;

  let priceLineColor = "blue"
  let priceFillColor = "rgb(173, 216, 230, 0.3)"
  if (data.length > 1 && data[data.length - 1].close > data[data.length - 2].close) {
    if (theme == "light") {
      priceLineColor = "rgba(30, 255, 100)"
      priceFillColor = "rgb(144, 238, 144, 0.3)"; 
    } else {
      priceLineColor = "rgba(100, 255, 100)";
      priceFillColor = "rgb(144, 238, 144, 0.2)"; 
    }
  } else {
    priceLineColor = "red"
    priceFillColor = "rgb(255, 182, 193, 0.3)";
  }

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stock/tinngo_stock_prices`,
        {
          params: {
            ticker: ticker,
            start_date: "2023-01-01",
            end_date: "2024-02-27",
            format: "json",
            resampleFreq: "monthly",
          },
        }
      )
      .then((res) => {
        const formattedData = res.data.map((d: any) => ({
          date: new Date(d.date),
          close: +d.close,
        }));
        setData(formattedData);
      });
  }, [ticker]);

 
  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-2 w-full max-w-4xl mx-auto">
      <ChartCanvas
        height={400}
        ratio={1}
        width={600}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        seriesName={ticker}
        data={data}
        xScale={scaleTime()}
        xAccessor={xAccessor}
        xExtents={[xAccessor(data[0]), xAccessor(data[data.length - 1])]}
        disableZoom={true}
        disablePan={true}
      >
        <Chart id={1} yExtents={(d: ChartData) => [d.close]}>
          <XAxis
            axisAt="bottom"
            orient="bottom"
            tickLabelFill={axisColor}
            tickStrokeStyle={axisColor}
            strokeStyle={axisColor}
            ticks={6}
            gridLinesStrokeDasharray="Solid"
            gridLinesStrokeStyle="#e0e0e0"
            tickFormat={timeFormat("%b")}
          />
          <YAxis
            axisAt="left"
            orient="left"
            tickLabelFill={axisColor}
            tickStrokeStyle={axisColor}
            strokeStyle={axisColor}
            gridLinesStrokeDasharray="Solid"
            gridLinesStrokeStyle="#e0e0e0"
          />
          <AreaSeries
            yAccessor={(d: ChartData) => d.close}
            baseAt={(scale) => scale(0)}
            strokeStyle={priceLineColor}
            fillStyle={priceFillColor}
          />
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%Y-%m-%d")}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />
          <HoverTooltip 
            yAccessor={(d) => d.close}
            tooltip={TooltipContent}
            chartId={1}
            fontSize={15}
          />
        </Chart>
        <CrossHairCursor 
          strokeStyle={axisColor}
        />
      </ChartCanvas>
    </div>
  );
};

export default LineChart;
