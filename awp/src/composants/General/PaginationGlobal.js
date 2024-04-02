import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationGlobal({ currentPage, totalPages }) {
    return (
        <Stack spacing={2}>
            <Pagination count={totalPages} page={currentPage} />
        </Stack>
    );
}