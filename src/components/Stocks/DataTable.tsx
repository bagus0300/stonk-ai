import React from "react";

interface DataTableProps {
  open: number;
  close: number;
  low: number;
  high: number;
  volume: number;
}

interface TableColumnProps {
  label: string;
  value: number;
}

const TableColumn: React.FC<TableColumnProps> = ({ label, value }) => {
  return (
    <tr className="border-b border-gray-300">
      <td className="px-4 py-2 w-1/2">{label}</td>
      <td className="px-4 py-2 text-right">{value}</td>
    </tr>
  );
};

const DataTable: React.FC<DataTableProps> = ({
  open,
  close,
  low,
  high,
  volume,
}) => {
  return (
    <div className="p-4">
      <table className="table-fixed w-full border-collapse border border-gray-300">
        <tbody>
          <TableColumn label="Open" value={open} />
          <TableColumn label="Close" value={close} />
          <TableColumn label="Low" value={low} />
          <TableColumn label="High" value={high} />
          <TableColumn label="Volume" value={volume} />
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
