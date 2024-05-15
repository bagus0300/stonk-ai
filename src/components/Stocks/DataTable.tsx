import React, { ReactNode } from "react";

import { PriceData, TradeData } from "@/src/types/Stock";

interface TableBodyProps {
  children: ReactNode;
}

interface TableColumnProps {
  label: string;
  value: number;
}

interface DataTableProps {
  currPriceData: PriceData;
  latestTradeData: TradeData;
}

const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return (
    <table className="table-fixed w-full border-collapse border border-gray-300">
      {children}
    </table>
  );
};

const TableColumn: React.FC<TableColumnProps> = ({ label, value }) => {
  return (
    <tr className="border-b border-gray-300">
      <td className="px-4 py-2 w-1/2">{label}</td>
      <td className="px-4 py-2 text-right">{`${value}`}</td>
    </tr>
  );
};

const DataTable: React.FC<DataTableProps> = ({
  currPriceData,
  latestTradeData,
}) => {
  return (
    <div className="p-4">
      <h2 className="font-bold mb-2">Latest Trade</h2>
      <p className="mb-2 text-sm">At time {latestTradeData?.time}</p>
      <TableBody>
        <tbody>
          <TableColumn label="Current Price" value={latestTradeData?.price} />
          <TableColumn label="Volume" value={latestTradeData?.volume} />
        </tbody>
      </TableBody>

      <h2 className="font-bold mt-5 mb-2">End of Day Data</h2>
      <TableBody>
        <tbody>
          <TableColumn label="Open" value={currPriceData.open} />
          <TableColumn label="High" value={currPriceData.high} />
          <TableColumn label="Low" value={currPriceData.low} />
          <TableColumn label="Close" value={currPriceData.close} />
          <TableColumn label="Volume" value={currPriceData.volume} />
          <TableColumn label="Dividend" value={currPriceData.divCash} />
          <TableColumn label="Split" value={currPriceData.splitFactor} />
        </tbody>
      </TableBody>

      <h2 className="font-bold mt-5 mb-2">Adjusted Prices</h2>
      <TableBody>
        <tbody>
          <TableColumn label="Adj Open" value={currPriceData.adjOpen} />
          <TableColumn label="Adj High" value={currPriceData.adjHigh} />
          <TableColumn label="Adj Low" value={currPriceData.adjLow} />
          <TableColumn label="Adj Close" value={currPriceData.adjClose} />
          <TableColumn label="Adj Volume" value={currPriceData.adjVolume} />
        </tbody>
      </TableBody>
    </div>
  );
};

export default DataTable;
