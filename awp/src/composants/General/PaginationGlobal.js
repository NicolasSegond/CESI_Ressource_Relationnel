import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationGlobal({ currentPage, totalPages, onPageChange }) {
    const handlePageChange = (event, page) => {
        onPageChange(page); // Appel de la fonction onPageChange avec le numéro de la nouvelle page
    };

    return (
        <Stack spacing={2}>
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
        </Stack>
    );
}
