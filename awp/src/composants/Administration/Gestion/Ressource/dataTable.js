import React from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

const DataTable = ({data, loading, columns, renderActions}) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
    };

    return (
        <TableContainer component={Paper}>
            <Table aria-label="generic table">
                <TableHead>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableCell key={index}>{column.label}</TableCell>
                        ))}
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1}>Chargement en cours...</TableCell>
                        </TableRow>
                    ) : (
                        data.map(row => (
                            <TableRow key={row.id}>
                                {columns.map((column, index) => (
                                    <TableCell key={index}>
                                        {column.render ?
                                            (column.renderDate && typeof row[column.field] === 'string') ?
                                                formatDate(row[column.field]) :
                                                column.render(row) :
                                            (column.renderDate && typeof row[column.field] === 'string') ?
                                                formatDate(row[column.field]) :
                                                row[column.field]}
                                    </TableCell>

                                ))}
                                <TableCell>{renderActions ? renderActions(row) : ''}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;
