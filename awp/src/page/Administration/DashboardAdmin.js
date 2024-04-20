import React, {useEffect, useState} from 'react';
import {customFetch} from '../../utils/customFetch.js';
import './Dashboard_admin.css';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import ClearIcon from '@mui/icons-material/Clear';
import DataTableComponent from '../../composants/Administration/dataTable.js';

const DashboardAdmin = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await customFetch({url: `http://127.0.0.1:8000/api/ressources?page=${page}&statut=1`});
                let fetchedData = response.data['hydra:member'];

                // Sort data by date
                fetchedData.sort((a, b) => {
                    const dateA = new Date(a.dateCreation);
                    const dateB = new Date(b.dateCreation);
                    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
                });

                setData(fetchedData);

                const lastPageUrl = response.data['hydra:view'] ? response.data['hydra:view']['hydra:last'] : null;
                const totalPages = lastPageUrl ? extractTotalPages(lastPageUrl) : 1;
                setTotalPages(totalPages); // Assuming 5 items per page
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, sortDirection]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSortChange = () => {
        setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    };

    const extractTotalPages = (url) => {
        const match = url.match(/page=(\d+)$/);
        if (match && match[1]) {
            return parseInt(match[1]);
        }
        return 1;
    };

    const columns = [
        {key: 'id', label: 'ID', sortable: true},
        {key: 'titre', label: 'Titre', sortable: false},
        {key: 'contenu', label: 'Contenu', sortable: false},
        {key: 'dateCreation', label: 'Date de création', sortable: true},
    ];

    const actions = [
        {label: 'Modifier', icon: <EditIcon/>, onClick: ''},
        {label: 'Mettre en attente', icon: <BlockIcon/>, onClick: ''}, // Assurez-vous de fournir la fonction onClick appropriée
        {label: 'Refuser', icon: <ClearIcon/>, onClick: ''} // Assurez-vous de fournir la fonction onClick appropriée
    ];

    return (
        <>
            <div className={"containerstat"}>
                <div className={"block-stat"}>

                </div>
                <div className={"block-stat"}>

                </div>
                <div className={"block-stat"}>

                </div>
                <div className={"block-stat"}>

                </div>
            </div>
            <DataTableComponent
                data={data} // Data should be an array of object
                columns={columns}
                totalRows={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                loading={loading}
                actions={actions}
            />
        </>
    );
};

export default DashboardAdmin;
