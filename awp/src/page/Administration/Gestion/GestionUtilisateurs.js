import React, {useEffect, useState} from 'react';
import apiConfig from "../../../utils/config";
import {customFetch} from "../../../utils/customFetch";
import GenericTable from "../../../composants/Administration/Gestion/Ressource/dataTable";
import PaginationGlobal from "../../../composants/General/PaginationGlobal";
import ClearIcon from "@mui/icons-material/Clear";
import {IconButton, Tooltip} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SecurityIcon from '@mui/icons-material/Security';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import CustomAlert from "../../../composants/CustomAlert";
import styles from "./Gestion.module.css";

const GestionUtilisateurs = () => {
    const [data, setData] = useState([]); // Données récupérées depuis l'API
    const [loading, setLoading] = useState(true); // Affiche un message de chargement
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [severity, setSeverity] = useState('');
    const [message, setMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const fetchData = async () => {
        setLoading(true); // Affiche un message de chargement

        try {
            // Construit l'URL en fonction des filtres sélectionnés
            let url = apiConfig.apiUrl + `/api/utilisateurs?page=${currentPage}`;

            // Effectue la requête GET à l'API
            const {data, error} = await customFetch({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }, true);

            if (error) {
                console.error('Erreur lors de la récupération des ressources:', error);
                setData([]); // Réinitialise les données en cas d'erreur
            } else {
                // Met à jour les données et le nombre total de pages
                setData(data['hydra:member']);
                const lastPageUrl = data['hydra:view'] ? data['hydra:view']['hydra:last'] : null;
                const totalPages = lastPageUrl ? extractTotalPages(lastPageUrl) : 1;
                setTotalPages(totalPages);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des ressources:', error);
            setData([]); // Réinitialise les données en cas d'erreur
        }

        setLoading(false); // Masque le message de chargement
    };

    // Fonction utilitaire pour extraire le nombre total de pages depuis l'URL de la dernière page
    const extractTotalPages = (url) => {
        const match = url.match(/page=(\d+)$/);
        if (match && match[1]) {
            return parseInt(match[1]);
        }
        return 1;
    };

    // Gère le changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Ferme l'alerte
    const handleCloseAlert = () => {
        setSeverity('');
        setMessage('');
        setAlertOpen(false);
    }

    const handleBan = async (row) => {
        try {
            const {data, error} = await customFetch({
                url: apiConfig.apiUrl + `/api/utilisateurs/` + row.id,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
                body: JSON.stringify({verif: 2})
            }, true);

            if (error) {
                setMessage('Erreur lors du ban de l\'utilisateur');
                setSeverity('error');
                setAlertOpen(true);
                console.error('Erreur lors du ban de l\'utilisateur:', error);
            } else {
                setSeverity('success');
                setMessage('Utilisateur bannis avec succès');
                setAlertOpen(true);
                fetchData();
            }
        } catch (error) {
            console.error('Erreur lors du ban de l\'utilisateur:', error);
        }
    }

    const handleUnban = async (row) => {
        try {
            const {data, error} = await customFetch({
                url: apiConfig.apiUrl + `/api/utilisateurs/` + row.id,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
                body: JSON.stringify({verif: 1})
            }, true);

            if (error) {
                setMessage('Erreur lors du déban de l\'utilisateur');
                setSeverity('error');
                setAlertOpen(true);
                console.error('Erreur lors du déban de l\'utilisateur:', error);
            } else {
                setSeverity('success');
                setMessage('Utilisateur débannis avec succès');
                setAlertOpen(true);
                fetchData();
            }
        } catch (error) {
            console.error('Erreur lors du déban de l\'utilisateur:', error);
        }
    }

    const handleAdmin = async (row) => {
        try {
            const {data, error} = await customFetch({
                url: apiConfig.apiUrl + `/api/utilisateurs/` + row.id,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
                body: JSON.stringify({roles: ["ROLE_ADMIN, ROLE_MODO"]})
            }, true);

            if (error) {
                setMessage('Erreur lors de la promotion en administrateur');
                setSeverity('error');
                setAlertOpen(true);
                console.error('Erreur lors de la promotion en administrateur:', error);
            } else {
                setSeverity('success');
                setMessage('Utilisateur promu en administrateur avec succès');
                setAlertOpen(true);
                fetchData();
            }
        } catch (error) {
            console.error('Erreur lors de la promotion en administrateur:', error);
        }
    }

    const handleModo = async (row) => {
        try {
            const {data, error} = await customFetch({
                url: apiConfig.apiUrl + `/api/utilisateurs/` + row.id,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
                body: JSON.stringify({roles: ["ROLE_MODO"]})
            }, true);

            if (error) {
                setMessage('Erreur lors de la promotion en modérateur');
                setSeverity('error');
                setAlertOpen(true);
                console.error('Erreur lors de la promotion en modérateur:', error);
            } else {
                setSeverity('success');
                setMessage('Utilisateur promu en modérateur avec succès');
                setAlertOpen(true);
                fetchData();
            }
        } catch (error) {
            console.error('Erreur lors de la promotion en modérateur:', error);
        }
    }

    const handleUnrank = async (row) => {
        try {
            const {data, error} = await customFetch({
                url: apiConfig.apiUrl + `/api/utilisateurs/` + row.id,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
                body: JSON.stringify({roles: ["ROLE_USER"]})
            }, true);

            if (error) {
                setMessage('Erreur lors de la dégradation de l\'utilisateur');
                setSeverity('error');
                setAlertOpen(true);
                console.error('Erreur lors de la dégradation de l\'utilisateur:', error);
            } else {
                setSeverity('success');
                setMessage('Utilisateur dégradé avec succès');
                setAlertOpen(true);
                fetchData();
            }
        } catch (error) {
            console.error('Erreur lors de la dégradation de l\'utilisateur:', error);
        }
    }

    const actions = [

        {
            label: "Bannir",
            icon: <ClearIcon/>,
            tooltip: "Bannir l'utilisateurs",
            onClick: handleBan
        },
        {
            label: "Débannir",
            icon: <CheckIcon/>,
            tooltip: "Débannir l'utilisateur",
            onClick: handleUnban
        },
        {
            label: "Promouvoir Administrateur",
            icon: <AccountBoxIcon/>,
            tooltip: "Promouvoir l'utilisateur en administrateur",
            onClick: handleAdmin
        },
        {
            label: "Promovoir Modérateur",
            icon: <SecurityIcon/>,
            tooltip: "Promouvoir l'utilisateur en modérateur",
            onClick: handleModo
        },
        {
            label: "Dégrader",
            icon: <GroupRemoveIcon/>,
            tooltip: "Dégrader l'utilisateur",
            onClick: handleUnrank
        }
    ];

    const renderActions = (row) => {
        if (row && row.verif === 2) {
            return actions
                .filter(action => action.label === 'Débannir' || action.label === 'Promouvoir Administrateur' || action.label === 'Promovoir Modérateur' || action.label === 'Dégrader')
                .map((action, index) => (
                    <Tooltip title={action.tooltip} key={index}>
                        <IconButton aria-label={action.label} onClick={() => action.onClick(row)}>
                            {action.icon}
                        </IconButton>
                    </Tooltip>
                ));
        } else {
            return actions
                .filter(action => action.label === 'Bannir' || action.label === 'Promouvoir Administrateur' || action.label === 'Promovoir Modérateur' || action.label === 'Dégrader')
                .map((action, index) => (
                    <Tooltip title={action.tooltip} key={index}>
                        <IconButton aria-label={action.label} onClick={() => action.onClick(row)}>
                            {action.icon}
                        </IconButton>
                    </Tooltip>
                ));
        }
    };

    const getVerif = (verif) => {
        switch (verif) {
            case 0:
                return "Non vérifié";
            case 1:
                return "Vérifié";
            case 2:
                return "Banni";
            default:
                return "État inconnu";
        }
    }

    const getClassVerif = (verif) => {
        switch (verif) {
            case 0:
                return styles['id_verif_non'];
            case 1:
                return styles['id_verif_ok'];
            case 2:
                return styles['id_verif_ban'];
        }
    }

    const renderVerif = (row) => {
        return (
            <div className={getClassVerif(row.verif)}>{getVerif(row.verif)}</div>
        );
    }


    return (
        <>
            <GenericTable
                data={data}
                loading={loading}
                columns={[
                    {label: 'ID', field: 'id'},
                    {label: 'Email', field: 'email'},
                    {label: 'Nom Prénom', render: row => `${row.nom} ${row.prenom}`},
                    {label: 'Rôles', field: 'roles'},
                    {label: 'Vérifier ?', render: renderVerif},
                ]}
                renderActions={renderActions}
            />
            <PaginationGlobal currentPage={currentPage} totalPages={totalPages}
                              onPageChange={handlePageChange}/>
            <CustomAlert open={alertOpen} handleClose={handleCloseAlert} severity={severity} message={message}/>
        </>
    );
}

export default GestionUtilisateurs;