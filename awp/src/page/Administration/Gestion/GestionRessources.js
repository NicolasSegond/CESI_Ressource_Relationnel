import React, {useEffect, useState} from 'react';
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from '@mui/icons-material/Clear';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import styles from './GestionRessources.module.css';
import {customFetch} from "../../../utils/customFetch";
import PaginationGlobal from "../../../composants/General/PaginationGlobal";
import TriComponent from "../../../composants/Ressource/TriComponent";
import apiConfig from "../../../utils/config.js";
import CustomAlert from "../../../composants/CustomAlert";

const GestionRessources = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [options, setOptions] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTypeRelation, setSelectedTypeRelation] = useState(null);
    const [selectedTypeRessource, setSelectedTypeRessource] = useState(null);
    const [selectedStatut, setSelectedStatut] = useState(null);
    const [severity, setSeverity] = useState('');
    const [message, setMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    const statut = [
        {libelle: 'Valide', id: 1},
        {libelle: 'En attente', id: 2},
        {libelle: 'Refusé', id: 3}
    ];

    useEffect(() => {
        const fetchOptions = async () => {
            const response = await fetch(apiConfig.apiUrl + '/api/options');
            const responseData = await response.json();

            if (response.ok) {
                setOptions(responseData);
            } else {
                console.error('Erreur lors de la récupération des options:', responseData.error);
            }
        }

        fetchOptions();
    }, []);

    useEffect(() => {
        fetchData();
    }, [currentPage, selectedCategory, selectedTypeRelation, selectedTypeRessource, selectedStatut]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let url = apiConfig.apiUrl + `/api/ressources?page=${currentPage}`;

            if (selectedCategory) {
                url += `&categorie=${selectedCategory}`;
            }
            if (selectedTypeRelation) {
                url += `&typeRelations=${selectedTypeRelation}`;
            }
            if (selectedTypeRessource) {
                url += `&typeDeRessource=${selectedTypeRessource}`;
            }
            if (selectedStatut) {
                url += `&statut=${selectedStatut}`;
            }

            const {data, error} = await customFetch({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }, false);
            if (error) {
                console.error('Erreur lors de la récupération des ressources:', error);
                setData([]);
            } else {
                setData(data['hydra:member']);
                const lastPageUrl = data['hydra:view'] ? data['hydra:view']['hydra:last'] : null;
                const totalPages = lastPageUrl ? extractTotalPages(lastPageUrl) : 1;
                setTotalPages(totalPages);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des ressources:', error);
            setData([]);
        }
        setLoading(false);
    };

    const extractTotalPages = (url) => {
        const match = url.match(/page=(\d+)$/);
        if (match && match[1]) {
            return parseInt(match[1]);
        }
        return 1;
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleTypeRelationChange = (typeRelation) => {
        setSelectedTypeRelation(typeRelation);
    };

    const handleTypeRessourceChange = (typeRessource) => {
        setSelectedTypeRessource(typeRessource);
    };

    const handleStatutChange = (selectedStatut) => {
        setSelectedStatut(selectedStatut);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCloseAlert = () => {
        setSeverity('');
        setMessage('');
        setAlertOpen(false);
    }

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

    const getVisibilityClass = (visibility) => {
        switch (visibility) {
            case 'Public':
                return 'id_visibilite_public';
            case 'Partage':
                return 'id_visibilite_partage';
            case 'Prive':
                return 'id_visibilite_prive';
            default:
                return '';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Valide':
                return 'id_statut_valide';
            case 'Attente':
                return 'id_statut_attente';
            case 'Refuse':
                return 'id_statut_refuse';
            default:
                return '';
        }
    };
    const renderActions = (row) => {
        const handleEditClick = () => {
            console.log('Edit clicked for row:', row);
        };

        const handleAcceptClick = async () => {
            const url = apiConfig.apiUrl + '/api/ressources/' + row.id + '/valider';

            const {data, error} = await customFetch({
                url: url,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
                body: JSON.stringify({})
            }, true);

            if (!error) {
                setSeverity('success');
                setMessage('La ressource a bien été validée');
                setAlertOpen(true);
                fetchData();
            } else {
                setSeverity('error');
                setMessage('Erreur lors de la validation de la ressource : ' + (error.message || 'Erreur inconnue'));
                setAlertOpen(true);
            }
        };

        const handleRejectClick = async () => {
            const url = apiConfig.apiUrl + '/api/ressources/' + row.id + '/refuser';

            const {data, error} = await customFetch({
                url: url,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
                body: JSON.stringify({})
            }, true);

            if (!error) {
                setSeverity('success');
                setMessage('La ressource a bien été refusée');
                setAlertOpen(true);
                fetchData();
            } else {
                setSeverity('error');
                setMessage('Erreur lors du refus de la ressource : ' + (error.message || 'Erreur inconnue'));
                setAlertOpen(true);
            }
        };

        const handleDeleteClick = async () => {
            const url = apiConfig.apiUrl + '/api/ressources/' + row.id;

            console.log(url);

            const {data, error} = await customFetch({
                url: url,
                method: 'DELETE',
            }, true);

            if (!error) {
                setSeverity('success');
                setMessage('La ressource a bien été supprimée');
                setAlertOpen(true);
                fetchData();
            } else {
                setSeverity('error');
                setMessage('Erreur lors de la suppression de la ressource : ' + (error.message || 'Erreur inconnue'));
                setAlertOpen(true);
            }
        };

        return (
            <div>
                <Tooltip title="Modifier">
                    <IconButton aria-label="Modifier" onClick={handleEditClick}>
                        <EditIcon/>
                    </IconButton>
                </Tooltip>

                {row.statut.id === 2 && (
                    <Tooltip title="Accepter">
                        <IconButton aria-label="Mettre en attente" onClick={handleAcceptClick}>
                            <CheckIcon/>
                        </IconButton>
                    </Tooltip>
                )}

                {row.statut.id === 2 && (
                    <Tooltip title="Refuser">
                        <IconButton aria-label="Refuser" onClick={handleRejectClick}>
                            <ClearIcon/>
                        </IconButton>
                    </Tooltip>
                )}

                <Tooltip title="Supprimer">
                    <IconButton aria-label="Supprimer" onClick={handleDeleteClick}>
                        <RestoreFromTrashIcon/>
                    </IconButton>
                </Tooltip>
            </div>
        );
    };


    return (
        <>
            <div className={styles['container']}>
                <TriComponent
                    label="Statut"
                    categories={statut || []}
                    onChangeTri={handleStatutChange}
                    aucunActif={true}
                />
                <TriComponent
                    label="Catégories"
                    categories={options.categories || []}
                    onChangeTri={handleCategoryChange}
                    aucunActif={true}
                />
                <TriComponent
                    label="Type de relations"
                    categories={options.relationTypes || []}
                    onChangeTri={handleTypeRelationChange}
                    aucunActif={true}
                />
                <TriComponent
                    label="Type de ressources"
                    categories={options.resourceTypes || []}
                    onChangeTri={handleTypeRessourceChange}
                    aucunActif={true}
                />
            </div>
            <TableContainer component={Paper} className={styles['datatable']}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Titre</TableCell>
                            <TableCell>Date de création</TableCell>
                            <TableCell>Date de modification</TableCell>
                            <TableCell>Propriétaire</TableCell>
                            <TableCell>Catégories</TableCell>
                            <TableCell>Type de ressource</TableCell>
                            <TableCell>Visibilité</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Type de relations</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={10}>Chargement en cours...</TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.titre}
                                    </TableCell>
                                    <TableCell>{formatDate(row.dateCreation)}</TableCell>
                                    <TableCell>{formatDate(row.dateModification)}</TableCell>
                                    <TableCell>{row.proprietaire.nom} {row.proprietaire.prenom}</TableCell>
                                    <TableCell>{row.categorie.nom}</TableCell>
                                    <TableCell>{row.typeDeRessource.libelle}</TableCell>
                                    <TableCell>
                                        <div
                                            className={styles[getVisibilityClass(row.visibilite.libelle)]}>{row.visibilite.libelle}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div
                                            className={styles[getStatusClass(row.statut.nomStatut)]}>{row.statut.nomStatut}</div>
                                    </TableCell>
                                    <TableCell>
                                        {row.typeRelations.map((relation, index) => (
                                            <span
                                                key={index}>{relation.libelle}{index !== row.typeRelations.length - 1 && ', '}</span>
                                        ))}
                                    </TableCell>
                                    <TableCell>{renderActions(row)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <PaginationGlobal currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
            <CustomAlert open={alertOpen} handleClose={handleCloseAlert} severity={severity} message={message}/>
        </>
    );
};

export default GestionRessources;
