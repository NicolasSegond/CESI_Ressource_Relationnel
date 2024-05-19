import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import DataTable from '../Administration/Gestion/Ressource/dataTable';
import PaginationGlobal from '../General/PaginationGlobal';
import apiConfig from "../../utils/config";
import { Link } from "react-router-dom";
import { customFetch } from "../../utils/customFetch";
import { getIdUser, getToken } from "../../utils/authentification";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import CustomAlert from "../CustomAlert";

const ListTypeProgression = ({ title, id }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tableWidth, setTableWidth] = useState(0);
    const [severity, setSeverity] = useState('');
    const [message, setMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [currentPage, id]);

    const fetchData = async () => {
        setLoading(true);

        try {
            const userId = getIdUser(getToken());
            const { data, error } = await customFetch({
                url: `${apiConfig.apiUrl}/api/progressions?page=${currentPage}&TypeProgression=${id}&Utilisateur=${userId}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }, true);

            if (error) {
                console.error('Error fetching data:', error);
                setData([]);
            } else {
                setData(data['hydra:member']);

                if (data['hydra:view']) {
                    const lastPageUrl = data['hydra:view']['hydra:last'];
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

    const handleDelete = async (id) => {
        console.log(id);
        try {
            await customFetch({
                url: `${apiConfig.apiUrl}/api/progressions/${id}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }, true);
            setSeverity('success');
            setMessage('La progression a bien été supprimée');
            setAlertOpen(true);
            fetchData();
        } catch (error) {
            console.error('Error deleting progression:', error);
            setSeverity('error');
            setMessage('Erreur lors de la suppression de la progression');
            setAlertOpen(true);
        }
    };

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

    const renderLink = (row) => (
        <Link to={`/ressource/${row.Ressource.id}`}>{row.Ressource.titre}</Link>
    );

    const renderActions = (row) => (
        <Tooltip title="Supprimer la progression">
            <IconButton onClick={() => handleDelete(row.id)}>
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    );

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
                    renderActions={renderActions}
                />

            </div>

            {totalPages > 1 && (
                <PaginationGlobal
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            <CustomAlert open={alertOpen} severity={severity} message={message} handleClose={() => setAlertOpen(false)} />
        </div>
    );
};

export default ListTypeProgression;
