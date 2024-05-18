import React, {useEffect, useState} from 'react';
import GenericTable from '../../../composants/Administration/Gestion/Ressource/dataTable.js'; // Import du composant générique
import apiConfig from "../../../utils/config.js";
import {customFetch} from "../../../utils/customFetch";
import PaginationGlobal from "../../../composants/General/PaginationGlobal";
import CustomAlert from "../../../composants/CustomAlert";
import {Button, IconButton, Modal, Paper, TextField, Tooltip} from "@mui/material";
import styles from './Gestion.module.css';
import {Delete as DeleteIcon, Edit as EditIcon} from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import TriComponent from "../../../composants/Ressource/TriComponent";
import StopCircleIcon from '@mui/icons-material/StopCircle';

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
    const [openModal, setOpenModal] = useState(false);
    const [row, setRow] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    // Options pour le statut des ressources
    const statut = [
        {libelle: 'Valide', id: 1},
        {libelle: 'En attente', id: 2},
        {libelle: 'Refusé', id: 3}
    ];

    useEffect(() => {
        // Fonction pour récupérer les options (catégories, types de ressources, etc.) depuis l'API
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
        fetchData(); // Met à jour les données lorsque currentPage, selectedCategory, etc. changent
    }, [currentPage, selectedCategory, selectedTypeRelation, selectedTypeRessource, selectedStatut]);

    // Fonction pour récupérer les données depuis l'API en fonction des filtres sélectionnés
    const fetchData = async () => {
        setLoading(true); // Affiche un message de chargement

        try {
            // Construit l'URL en fonction des filtres sélectionnés
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

            // Effectue la requête GET à l'API
            const {data, error} = await customFetch({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }, false);

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

    // Gère le changement de catégorie sélectionnée
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Gère le changement de type de relation sélectionné
    const handleTypeRelationChange = (typeRelation) => {
        setSelectedTypeRelation(typeRelation);
    };

    // Gère le changement de type de ressource sélectionné
    const handleTypeRessourceChange = (typeRessource) => {
        setSelectedTypeRessource(typeRessource);
    };

    // Gère le changement de statut sélectionné
    const handleStatutChange = (selectedStatut) => {
        setSelectedStatut(selectedStatut);
    };

    // Ouvre le modal de rejet et passe la ligne sélectionnée
    const handleOpenModal = (row) => {
        setOpenModal(true);
        setRow(row);
    };

    // Ferme le modal de rejet
    const handleCloseModal = () => {
        setOpenModal(false);
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

    // Gère le rejet de la ressource
    const handleRejectClick = async (row, message) => {
        const url = apiConfig.apiUrl + '/api/ressources/' + row.id + '/refuser';

        const {data, error} = await customFetch({
            url: url,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/merge-patch+json',
            },
            body: JSON.stringify({message: message})
        }, true);

        if (!error) {
            setSeverity('success');
            setMessage('La ressource a bien été refusée');
            setAlertOpen(true);
            fetchData(); // Rafraîchit les données après le rejet
            handleCloseModal(); // Ferme le modal après le rejet
        } else {
            setSeverity('error');
            setMessage('Erreur lors du refus de la ressource : ' + (error.message || 'Erreur inconnue'));
            setAlertOpen(true);
            handleCloseModal(); // Ferme le modal en cas d'erreur
        }
    };

    // Fonction de rendu pour le statut
    const renderStatut = (row) => {
        return (
            <div className={getStatusClass(row.statut.nomStatut)}>{row.statut.nomStatut}</div>
        );
    };

    const renderVisibilite = (row) => {
        return (
            <div className={getVisibilityClass(row.visibilite.libelle)}>{row.visibilite.libelle}</div>
        );
    };

    // Fonction pour éditer une ressource
    const handleEdit = (row) => {
        console.log('Edit clicked for row:', row);
    };

    // Fonction pour supprimer une ressource
    const handleDelete = async (row) => {
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

    const handleAccept = async (row) => {
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

    const handleSuspendre = async (row) => {
        const url = apiConfig.apiUrl + '/api/ressources/' + row.id + '/refuser';

        const {data, error} = await customFetch({
            url: url,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/merge-patch+json',
            },
            body: JSON.stringify({message: 'Ressource suspendue par un administrateur car elle ne respectait pas le réglement de la plateforme, aucun retour en arrière n\'est possible.'})
        }, true);

        if (!error) {
            setSeverity('success');
            setMessage('La ressource a bien été suspendue');
            setAlertOpen(true);
            fetchData(); // Rafraîchit les données après le rejet
            handleCloseModal(); // Ferme le modal après le rejet
        } else {
            setSeverity('error');
            setMessage('Erreur lors de la modification de la ressource : ' + (error.message || 'Erreur inconnue'));
            setAlertOpen(true);
            handleCloseModal(); // Ferme le modal en cas d'erreur
        }
    };

    const getVisibilityClass = (visibility) => {
        switch (visibility) {
            case 'Public':
                return styles['id_visibilite_public'];
            case 'Partage':
                return styles['id_visibilite_partage'];
            case 'Prive':
                return styles['id_visibilite_prive'];
            default:
                return '';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Valide':
                return styles['id_statut_valide'];
            case 'Attente':
                return styles['id_statut_attente'];
            case 'Refuse':
                return styles['id_statut_refuse'];
            default:
                return '';
        }
    };

    const actions = [
        {
            label: "Modifier",
            icon: <EditIcon/>,
            tooltip: "Modifier la ressource",
            onClick: handleEdit
        },
        {
            label: "Accepter",
            icon: <CheckIcon/>,
            tooltip: "Accepter la ressource",
            onClick: handleAccept
        },
        {
            label: "Rejeter",
            icon: <ClearIcon/>,
            tooltip: "Rejeter la ressource",
            onClick: handleOpenModal
        },
        {
            label: "Supprimer",
            icon: <DeleteIcon/>,
            tooltip: "Supprimer la ressource",
            onClick: handleDelete
        },
        {
            label: "Suspendre",
            icon: <StopCircleIcon/>,
            tooltip: "Suspendre la ressource",
            onClick: handleSuspendre
        }
    ];

    const renderActions = (row) => {
        if (row && row.statut && row.statut.id === 2) {
            return actions.map((action, index) => (
                <Tooltip title={action.tooltip} key={index}>
                    <IconButton aria-label={action.label} onClick={() => action.onClick(row)}>
                        {action.icon}
                    </IconButton>
                </Tooltip>
            ));
        } else {
            return actions
                .filter(action => action.label === 'Modifier' || action.label === 'Supprimer' || action.label === 'Suspendre')
                .map((action, index) => (
                    <Tooltip title={action.tooltip} key={index}>
                        <IconButton aria-label={action.label} onClick={() => action.onClick(row)}>
                            {action.icon}
                        </IconButton>
                    </Tooltip>
                ));
        }
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
            <GenericTable
                data={data}
                loading={loading}
                columns={[
                    {label: 'Titre', field: 'titre'},
                    {label: 'Date de création', field: 'dateCreation', renderDate: true},
                    {label: 'Date de modification', field: 'dateModification', renderDate: true},
                    {label: 'Propriétaire', render: row => `${row.proprietaire.nom} ${row.proprietaire.prenom}`},
                    {label: 'Catégories', render: row => row.categorie.nom},
                    {label: 'Type de ressource', render: row => row.typeDeRessource.libelle},
                    {label: 'Visibilité', render: renderVisibilite},
                    {label: 'Statut', render: renderStatut},
                ]}
                renderActions={renderActions}
            />
            <PaginationGlobal currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
            <CustomAlert open={alertOpen} handleClose={handleCloseAlert} severity={severity} message={message}/>
            <Modal open={openModal} onClose={() => handleOpenModal()}>
                {/* Contenu du modal pour le rejet */}
                <div className={styles["modal-container"]}>
                    <Paper className={styles["modal-content"]}>
                        <h2>Confirmer le rejet</h2>
                        {/* Champ de texte pour saisir la raison du rejet */}
                        <TextField
                            fullWidth
                            label="Raison du rejet"
                            variant="outlined"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            multiline
                            className={styles["reject-reason"]}
                        />
                        {/* Boutons pour annuler ou confirmer le rejet */}
                        <div>
                            <Button onClick={() => handleCloseModal()}>Annuler</Button>
                            <Button variant="contained" color="primary"
                                    onClick={() => handleRejectClick(row, rejectReason)}>Confirmer</Button>
                        </div>
                    </Paper>
                </div>
            </Modal>
        </>
    );
};

export default GestionRessources;