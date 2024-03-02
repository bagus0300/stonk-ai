"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import axios from "axios";
import { scaleTime } from "d3-scale";
import { timeFormat } from "d3-time-format";
import {
  ChartCanvas,
  Chart,
  CrossHairCursor,
  MouseCoordinateX,
} from "react-financial-charts";
import { XAxis, YAxis } from "@react-financial-charts/axes";
import { LineSeries } from "@react-financial-charts/series";

interface SmallChartProps {
  symbol: string;
}

interface ChartData {
  date: Date;
  close: number;
}

const SmallChart = ({ symbol }: SmallChartProps) => {
  const [data, setData] = useState<ChartData[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stock/tinngo_stock_prices`,
        {
          params: {
            ticker: symbol,
            start_date: "2023-01-01",
            end_date: "2024-03-01",
            format: "json",
            resampleFreq: "monthly",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        const formattedData = res.data.map((d: any) => ({
          date: new Date(d.date),
          close: +d.close,
        }));
        console.log(formattedData);
        setData(formattedData);
      });
  }, [symbol]);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }
  const textColor = theme === "light" ? "black" : "white";
  const xAccessor = (d: ChartData) => d.date;

  return (
    <ChartCanvas
      height={400}
      ratio={1}
      width={600}
      margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
      seriesName={symbol}
      data={data}
      xScale={scaleTime()}
      xAccessor={xAccessor}
      xExtents={[xAccessor(data[0]), xAccessor(data[data.length - 1])]}
    >
      <Chart id={1} yExtents={(d: ChartData) => [d.close]}>
        <XAxis
          axisAt="bottom"
          orient="bottom"
          tickLabelFill={textColor}
          tickStrokeStyle={textColor}
          strokeStyle={textColor}
          ticks={6}
        />
        <YAxis
          axisAt="left"
          orient="left"
          tickLabelFill={textColor}
          tickStrokeStyle={textColor}
          strokeStyle={textColor}
        />
        <LineSeries yAccessor={(d: ChartData) => d.close} />
        <MouseCoordinateX
          at="bottom"
          orient="bottom"
          displayFormat={timeFormat("%Y-%m-%d")}
        />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default SmallChart;
