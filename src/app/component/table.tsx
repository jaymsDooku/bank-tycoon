import React from 'react';

interface TableProps<T> {
    data: T[];
    columns: { key: string; header: string, render?: (item: T) => React.ReactNode }[];
  }
  
  export default function Table<T>({ data, columns }: TableProps<T>) {
    return (
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>
                {column.render ? column.render(item) : (item as any)[column.key]}
              </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }