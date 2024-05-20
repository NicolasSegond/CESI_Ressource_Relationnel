import React, { useState, useEffect } from 'react';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import DataTable from '../Administration/Gestion/Ressource/dataTable';
import PaginationGlobal from '../General/PaginationGlobal';
import apiConfig from "../../utils/config";
import { Link } from "react-router-dom";
import { customFetch } from "../../utils/customFetch";
import { getIdUser, getToken } from "../../utils/authentification";

const ListStatutRessource = ({ title, ownerId, statusId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tableWidth, setTableWidth] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(statusId); // État pour stocker l'ID du statut sélectionné
    const [statusList, setStatusList] = useState([]); // État pour stocker la liste des statuts

    useEffect(() => {
        // Fonction pour récupérer la liste des statuts depuis l'API
        const fetchStatusList = async () => {
            try {
                const { data: statusData } = await customFetch({
                    url: `${apiConfig.apiUrl}/api/statuts`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }, true);
                setStatusList(statusData['hydra:member']);
            } catch (error) {
                console.error('Error fetching status list:', error);
            }
        };

        fetchStatusList();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const { data: responseData, error } = await customFetch({
                    url: `${apiConfig.apiUrl}/api/ressources?page=${currentPage}&proprietaire=${ownerId}&statut=${selectedStatus}`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/ld+json',
                    },
                }, true);

                if (error) {
                    console.error('Error fetching data:', error);
                    setData([]);
                } else {
                    setData(responseData['hydra:member']);

                    if (responseData['hydra:view']) {
                        const lastPageUrl = responseData['hydra:view']['hydra:last'];
                        const totalPages = lastPageUrl ? parseInt(lastPageUrl.split('=').pop()) : 1;
                        setTotalPages(totalPages);
                    } else {
                        setTotalPages(1);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]);
            }

            setLoading(false);
        };

        fetchData();
    }, [currentPage, ownerId, selectedStatus]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const renderLink = (row) => {
        return (
            <Link to={`/ressources/${row.id}`}>{row.titre}</Link>
        );
    };

    const renderStatusSelect = () => (
        <FormControl fullWidth style={{ maxWidth: '100px', marginleft: '200px' }}>
            <InputLabel id="status-select-label">Statut</InputLabel>
            <Select
                labelId="status-select-label"
                id="status-select"
                value={selectedStatus}
                onChange={handleStatusChange}
            >
                {statusList.map(status => (
                    <MenuItem key={status.id} value={status.id}>{status.nomStatut}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );



    const columns = [
        { label: 'Titre', render: renderLink },
        { render: row => formatDate(row.dateCreation), label: 'Date de Création' },
        { render: row => formatDate(row.dateModification), label: 'Date de Modification' },
        { label: 'Nombre de vue', render: row => row.nombreVue },
        { label: 'Statut', render: row => row.statut.nomStatut },
    ];

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>{title}</h2>

            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                {renderStatusSelect()}
            </div>

            <div style={{ position: 'relative' }}>
                {loading && (
                    <CircularProgress
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1,
                        }}
                    />
                )}

                <DataTable
                    data={data}
                    loading={loading}
                    columns={columns}
                    onTableWidthChange={setTableWidth}
                />
            </div>

            {totalPages > 1 && (
                <PaginationGlobal
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default ListStatutRessource;
