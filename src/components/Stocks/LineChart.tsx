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

import TooltipContent from "@/src/components/Stocks/Tooltip";
import Loader from "@/src/components/units/Loader";

interface LineChartProps {
  ticker: string;
  startDate: Date;
  endDate: Date;
}

interface ChartData {
  date: Date;
  close: number;
}

const LineChart: React.FC<LineChartProps> = ({ ticker, startDate, endDate }) => {
  const [data, setData] = useState<ChartData[]>([]);
  const { theme } = useTheme();

  const axisColor = theme === "light" ? "black" : "white";
  const xAccessor = (d: ChartData) => d.date;

  let priceLineColor = "blue";
  let priceFillColor = "rgb(173, 216, 230, 0.3)";
  if (
    data.length > 1 &&
    data[data.length - 1].close > data[data.length - 2].close
  ) {
    if (theme == "light") {
      priceLineColor = "rgba(30, 255, 100)";
      priceFillColor = "rgb(144, 238, 144, 0.3)";
    } else {
      priceLineColor = "rgba(100, 255, 100)";
      priceFillColor = "rgb(144, 238, 144, 0.2)";
    }
  } else {
    priceLineColor = "red";
    priceFillColor = "rgb(255, 182, 193, 0.3)";
  }

  useEffect(() => {
    const formatDate = (date: Date) => {
      let d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    };

    console.log(formatDate(startDate))
    console.log(formatDate(endDate))

    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stock/tinngo_stock_prices`,
        {
          params: {
            ticker: ticker,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            format: "json",
            resampleFreq: "monthly",
          },
        }
      )
      .then((res) => {
        const formattedData = res.data.map((d: any) => ({
          date: new Date(d.date),
          open: +d.open,
          close: +d.close,
          low: +d.low,
          high: +d.high,
          volume: +d.adjVolume,
        }));
        setData(formattedData);
      });
  }, [ticker, startDate, endDate]);

  return data.length === 0 ? (
    <div className="flex justify-center items-center h-full">
      <Loader />
    </div>
  ) : (
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
        <CrossHairCursor strokeStyle={axisColor} />
      </ChartCanvas>
    </div>
  );
};

export default LineChart;
