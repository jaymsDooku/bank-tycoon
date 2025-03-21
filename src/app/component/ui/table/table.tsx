import React from 'react';
import './table.css';

interface TableProps<T> {
    data: T[];
    columns: { key: string; header: string, render?: (item: T) => React.ReactNode }[];
    onRowClick?: (item: T) => void;
}
  
export default function Table<T>({ data, columns, onRowClick }: TableProps<T>) {
  return (
    <table className="tbl">
      <thead className="tbl-header">
        <tr className="tbl-row">
          {columns.map((column) => (
            <th className="tbl-head-data" key={String(column.key)}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="tbl-content">
        {data.map((item, index) => (
          <tr key={index} className="tbl-row" onClick = {() => onRowClick && onRowClick(item)}>
            {columns.map((column) => (
              <td className="tbl-data" key={column.key}>
              {column.render ? column.render(item) : (item as any)[column.key]}
            </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}