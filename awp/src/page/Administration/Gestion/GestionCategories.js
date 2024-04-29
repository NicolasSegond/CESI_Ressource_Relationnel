import React, {useEffect, useState} from 'react';
import apiConfig from "../../../utils/config";
import {customFetch} from "../../../utils/customFetch";
import GenericTable from "../../../composants/Administration/Gestion/Ressource/dataTable";
import styles from './Gestion.module.css';
import {Delete as DeleteIcon} from "@mui/icons-material";
import {IconButton, Tooltip} from "@mui/material";
import CustomModal from "../../../composants/Modal";
import EditIcon from "@mui/icons-material/Edit";
import CustomAlert from "../../../composants/CustomAlert";

const GestionCategories = () => {
    const [data, setData] = useState([]); // Données récupérées depuis l'API
    const [loading, setLoading] = useState(true); // Affiche un message de chargement
    const [openModal, setOpenModal] = useState(false); // Affiche le modal
    const [nomCategorie, setNomCategorie] = useState(""); // Nom de la catégorie
    const [openModalModif, setOpenModalModif] = useState(false); // Affiche le modal pour modifier
    const [row, setRow] = useState({}); // Ligne sélectionnée
    const [severity, setSeverity] = useState('');
    const [message, setMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = () => {
        setNomCategorie("");
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleOpenModalModif = () => {
        setOpenModalModif(true);
    }

    const handleCloseModalModif = () => {
        setOpenModalModif(false);
    }


    // Fonction pour récupérer les données depuis l'API en fonction des filtres sélectionnés
    const fetchData = async () => {
        setLoading(true); // Affiche un message de chargement

        try {
            // Construit l'URL en fonction des filtres sélectionnés
            let url = apiConfig.apiUrl + `/api/categories`;

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
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des ressources:', error);
            setData([]); // Réinitialise les données en cas d'erreur
        }

        setLoading(false); // Masque le message de chargement
    };

    const handleDelete = async (row) => {
        try {
            // Construit l'URL en fonction des filtres sélectionnés
            let url = apiConfig.apiUrl + `/api/categories/` + row.id;

            // Effectue la requête DELETE à l'API
            const {data, error} = await customFetch({
                url: url,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            }, true);

            if (error) {
                setSeverity('error');
                setMessage('Erreur lors de la suppression de la ressource');
                setAlertOpen(true);
                console.error('Erreur lors de la suppression de la ressource:', error);
            } else {
                setSeverity('success');
                setMessage('La catégorie a bien été supprimée');
                setAlertOpen(true);
                fetchData();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la ressource:', error);
        }
    }

    const actions = [
        {
            label: "Supprimer",
            icon: <DeleteIcon/>,
            tooltip: "Supprimer la catégorie",
            onClick: handleDelete
        },
        {
            label: "Modifier",
            icon: <EditIcon/>,
            tooltip: "Modifier la catégorie",
            onClick: (row) => {
                setNomCategorie(row.nom);
                setRow(row);
                handleOpenModalModif();
            }
        }
    ];

    const renderActions = (row) => {
        return actions.map((action, index) => (
            <Tooltip title={action.tooltip} key={index}>
                <IconButton aria-label={action.label} onClick={() => action.onClick(row)}>
                    {action.icon}
                </IconButton>
            </Tooltip>
        ));
    };

    const handleAjout = async (nomCategorie) => {
        try {
            // Construit l'URL en fonction des filtres sélectionnés
            let url = apiConfig.apiUrl + `/api/categories`;

            // Effectue la requête POST à l'API
            const {data, error} = await customFetch({
                url: url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: nomCategorie
                })
            }, true);


            if (error) {
                setSeverity('error');
                setMessage('Erreur lors de l\'ajout de la catégorie');
                setAlertOpen(true);
                console.error('Erreur lors de l\'ajout de la catégorie:', error);
                handleCloseModal();
            } else {
                setSeverity('success');
                setMessage('La catégorie a bien été ajoutée');
                setAlertOpen(true);
                fetchData();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la catégorie:', error);
        }
    }

    const handleModifier = async (row, nomCategorie) => {
        try {
            // Construit l'URL en fonction des filtres sélectionnés
            let url = apiConfig.apiUrl + `/api/categories/` + row.id;

            // Effectue la requête POST à l'API
            const {data, error} = await customFetch({
                url: url,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
                body: JSON.stringify({
                    nom: nomCategorie
                })
            }, true);

            if (error) {
                setSeverity('error');
                setMessage('Erreur lors de la modification de la catégorie');
                setAlertOpen(true);
                console.error('Erreur lors de la modification de la catégorie:', error);
            } else {
                setSeverity('success');
                setMessage('La catégorie a bien été modifiée');
                setAlertOpen(true);
                fetchData();
                handleCloseModalModif();
            }
        } catch (error) {
            console.error('Erreur lors de la modification de la catégorie:', error);
        }
    }

    const handleCloseAlert = () => {
        setSeverity('');
        setMessage('');
        setAlertOpen(false);
    }

    return (
        <>
            <a className={styles["btn-ajouter"]} onClick={handleOpenModal}> Ajouter </a>
            <GenericTable
                data={data}
                loading={loading}
                columns={[
                    {label: 'ID', field: 'id'},
                    {label: 'Nom', field: 'nom'},
                ]}
                renderActions={renderActions}
            />
            <CustomAlert open={alertOpen} handleClose={handleCloseAlert} severity={severity} message={message}/>
            <CustomModal open={openModal} handleClose={handleCloseModal} handleConfirm={handleAjout} label={"Catégorie"}
                         title={"Ajouter une catégorie"} inputValue={nomCategorie} setInputValue={setNomCategorie}/>
            <CustomModal open={openModalModif} handleClose={handleCloseModalModif}
                         handleConfirm={() => handleModifier(row, nomCategorie)}
                         label={"Nom de la catégorie"} title={"Modifier la catégorie"} inputValue={nomCategorie}
                         setInputValue={setNomCategorie}/>
        </>
    );
}

export default GestionCategories;