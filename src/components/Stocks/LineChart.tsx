"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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

import { getPriceDiff } from "@/src/utils/priceUtils";
import { PriceData } from "@/src/types/Stock";

interface LineChartProps {
  ticker: string;
  priceData: PriceData[];
}

const LineChart: React.FC<LineChartProps> = ({ ticker, priceData }) => {
  const { theme } = useTheme();
  const [chartWidth, setChartWidth] = useState(600);

  useEffect(() => {
    const handleResize = () => {
      // Min width of 400 and max width of 600
      const newWidth = Math.max(400, Math.min(window.innerWidth - 300, 600));
      setChartWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getChartColors = () => {
    let axisColor = theme === "light" ? "black" : "white";
    let priceLineColor = "rgba(255, 100, 100)"; // Default red
    let priceFillColor = "rgba(255, 100, 100, 0.2)";

    if (priceData.length > 0) {
      const priceDiff = getPriceDiff(
        priceData[priceData.length - 1].open,
        priceData[priceData.length - 1].close
      );

      if (priceDiff > 0) {
        if (theme === "light") {
          priceLineColor = "rgba(30, 255, 100)";
          priceFillColor = "rgb(144, 238, 144, 0.3)";
        } else {
          priceLineColor = "rgba(100, 255, 100)";
          priceFillColor = "rgb(144, 238, 144, 0.2)";
        }
      }
    }

    return { axisColor, priceLineColor, priceFillColor };
  };

  const { axisColor, priceLineColor, priceFillColor } = getChartColors();
  const xAccessor = (d: PriceData) => d?.date;

  return priceData.length === 0 ? (
    <div className="flex justify-center items-center h-full">
      <Loader />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center px-4 py-2 w-full max-w-4xl mx-auto">
      <ChartCanvas
        height={400}
        ratio={1}
        width={chartWidth}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        seriesName={ticker}
        data={priceData}
        xScale={scaleTime()}
        xAccessor={xAccessor}
        xExtents={[xAccessor(priceData[0]), xAccessor(priceData[priceData.length - 1])]}
        disableZoom={true}
        disablePan={false}
      >
        <Chart id={1} yExtents={(d: PriceData) => [d.close]}>
          <XAxis
            axisAt="bottom"
            orient="bottom"
            tickLabelFill={axisColor}
            tickStrokeStyle={axisColor}
            strokeStyle={axisColor}
            gridLinesStrokeDasharray="Solid"
            gridLinesStrokeStyle="#e0e0e0"
            ticks={6}
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
            yAccessor={(d: PriceData) => d.close}
            baseAt={(scale) => scale(0)}
            strokeStyle={priceLineColor}
            fillStyle={priceFillColor}
          />
          <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat("%Y-%m-%d")} />
          <MouseCoordinateY at="right" orient="right" displayFormat={format(".2f")} />
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
