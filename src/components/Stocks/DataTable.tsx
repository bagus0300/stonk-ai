import React from "react";

import { PriceData } from "@/src/types/Stock";

interface DataTableProps {
  currPriceData: PriceData;
}

interface TableColumnProps {
  label: string;
  value: number;
}

const TableColumn: React.FC<TableColumnProps> = ({ label, value }) => {
  return (
    <tr className="border-b border-gray-300">
      <td className="px-4 py-2 w-1/2">{label}</td>
      <td className="px-4 py-2 text-right">{`${value}`}</td>
    </tr>
  );
};

const DataTable: React.FC<DataTableProps> = ({ currPriceData }) => {
  return (
    <div className="p-4">
      <table className="table-fixed w-full border-collapse border border-gray-300">
        <tbody>
          <TableColumn label="Open" value={currPriceData.open} />
          <TableColumn label="High" value={currPriceData.high} />
          <TableColumn label="Low" value={currPriceData.low} />
          <TableColumn label="Close" value={currPriceData.close} />
          <TableColumn label="Volume" value={currPriceData.volume} />
          <TableColumn label="Adj Open" value={currPriceData.adjOpen} />
          <TableColumn label="Adj High" value={currPriceData.adjHigh} />
          <TableColumn label="Adj Low" value={currPriceData.adjLow} />
          <TableColumn label="Adj Close" value={currPriceData.adjClose} />
          <TableColumn label="Adj Volume" value={currPriceData.adjVolume} />
          <TableColumn label="Dividend" value={currPriceData.divCash} />
          <TableColumn label="Split" value={currPriceData.splitFactor} />
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
