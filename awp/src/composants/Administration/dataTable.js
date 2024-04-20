import React from 'react';
import {
    IconButton,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip
} from '@mui/material';

const TableHeader = ({columns, sortDirection, handleSortChange, actions}) => (
    <TableHead>
        <TableRow>
            {columns.map((column) => (
                <TableCell key={column.key}>
                    {column.sortable ? (
                        <Tooltip title={`Trier par ${column.label}`} placement="top">
                            <TableSortLabel active={column.sortable} direction={sortDirection}
                                            onClick={() => handleSortChange(column.key)}>
                                {column.label}
                            </TableSortLabel>
                        </Tooltip>
                    ) : (
                        column.label
                    )}
                </TableCell>
            ))}
            {actions.length > 0 && <TableCell>Actions</TableCell>}
        </TableRow>
    </TableHead>
);

const TableRowData = ({columns, row, actions}) => (
    <TableRow>
        {columns.map((column) => (
            <TableCell key={column.key}>{row[column.key]}</TableCell>
        ))}
        {actions.length > 0 && ( // Vérifie s'il y a des actions
            <TableCell>
                {actions.map((action, index) => (
                    <Tooltip key={index} title={action.label}>
                        <IconButton aria-label={action.label} onClick={() => action.onClick(row)}>
                            {action.icon}
                        </IconButton>
                    </Tooltip>
                ))}
            </TableCell>
        )}
    </TableRow>
);


const LoadingRow = ({colSpan}) => (
    <TableRow>
        <TableCell colSpan={colSpan}>Loading...</TableCell>
    </TableRow>
);

const DataPagination = ({totalPages, currentPage, onPageChange}) => (
    <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => onPageChange(value)}
        shape="rounded"
        sx={{display: 'flex', justifyContent: 'center', marginTop: 2}}
    />
);

const DataTable = ({
                       data,
                       columns,
                       totalRows,
                       currentPage,
                       onPageChange,
                       sortDirection,
                       onSortChange,
                       loading,
                       actions
                   }) => {
    return (
        <>
            <TableContainer component={Paper} className={"datatable"}>
                <Table>
                    <TableHeader columns={columns} sortDirection={sortDirection} handleSortChange={onSortChange}
                                 actions={actions}/>
                    <TableBody>
                        {loading ? (
                            <LoadingRow colSpan={columns.length + 1}/>
                        ) : (
                            data.map((row) => <TableRowData key={row.id} columns={columns} row={row}
                                                            actions={actions}/>)
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <DataPagination totalPages={totalRows} currentPage={currentPage} onPageChange={onPageChange}/>
        </>
    );
};

export default DataTable;
