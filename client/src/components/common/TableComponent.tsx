import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface ColumnConfig {
  id: string;
  label: string;
}

type CommonTableProps = {
  columns: ColumnConfig[];
  data: any[];
}

const TableComponent  = (props: CommonTableProps) => {
  const { columns, data } = props;
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography>No records found</Typography>
              </TableCell>
            </TableRow>
          ) : (data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.id}>{row[column.id]}</TableCell>
              ))}
            </TableRow>
          )))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
