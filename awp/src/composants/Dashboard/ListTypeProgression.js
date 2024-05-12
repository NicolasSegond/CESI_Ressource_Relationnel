import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import DataTable from '../Administration/Gestion/Ressource/dataTable';
import PaginationGlobal from '../General/PaginationGlobal';
import apiConfig from "../../utils/config";
import { Link } from "react-router-dom";
import { customFetch } from "../../utils/customFetch";
import { getIdUser, getToken } from "../../utils/authentification";

const ListTypeProgression = ({ title, id }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tableWidth, setTableWidth] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const userId = getIdUser(getToken()); // Obtenir l'ID de l'utilisateur connecté
                const { data: responseData, error } = await customFetch({
                    url: `${apiConfig.apiUrl}/api/progressions?page=${currentPage}&TypeProgression=${id}&Utilisateur=${userId}`, // Utiliser l'ID dans l'URL
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
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
    }, [currentPage, id]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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
            <Link to={`/ressource/${row.Ressource.id}`}>{row.Ressource.titre}</Link>
        );
    };

    const columns = [
        { label: 'Titre', render: renderLink },
        { render: row => formatDate(row.Ressource.dateCreation), label: 'Date de Création' },
        { render: row => formatDate(row.Ressource.dateModification), label: 'Date de Modification' },
        { label: 'Nombre de vue', render: row => row.Ressource.nombreVue },
    ];

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>{title}</h2>

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

export default ListTypeProgression;
