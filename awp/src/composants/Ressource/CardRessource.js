import React, {useMemo, useRef, useState} from 'react';
import './CardRessource.css';
import Vu from "../../assets/vue.png";
import Com from "../../assets/commentaire.png";
import Menu from "../../assets/menu.png";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import {customFetch} from "../../utils/customFetch";
import apiConfig from "../../utils/config";

function couleurAleatoire() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function formatDelai(date) {
    const maintenant = new Date();
    const dateDonnee = new Date(date);
    const differenceEnMilliseconds = maintenant - dateDonnee;
    const differenceEnSecondes = Math.floor(differenceEnMilliseconds / 1000);
    const differenceEnMinutes = Math.floor(differenceEnSecondes / 60);
    const differenceEnHeures = Math.floor(differenceEnMinutes / 60);
    const differenceEnJours = Math.floor(differenceEnHeures / 24);
    const differenceEnSemaines = Math.floor(differenceEnJours / 7);

    if (differenceEnSemaines > 0) {
        return `Il y a ${differenceEnSemaines} semaine${differenceEnSemaines > 1 ? 's' : ''}`;
    } else if (differenceEnJours > 0) {
        return `Il y a ${differenceEnJours} jour${differenceEnJours > 1 ? 's' : ''}`;
    } else if (differenceEnHeures > 0) {
        return `Il y a ${differenceEnHeures} heure${differenceEnHeures > 1 ? 's' : ''}`;
    } else if (differenceEnMinutes > 0) {
        return `Il y a ${differenceEnMinutes} minute${differenceEnMinutes > 1 ? 's' : ''}`;
    } else {
        return `Il y a quelques instants`;
    }
}

function Card({ idRessource, imageUrl, title, description, proprietaire, vue, nom, prenom, date_creation, visibilite, typeRessource, typeRelations, categorie, nbCommentaire, voirRessource, idUser, userRoles }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalPartagerOpen, setIsModalPartagerOpen] = useState(false);
    const [modalContent, setModalContent] = useState(""); // Contenu du modal spécifique à chaque ressource
    const [color] = useState(useMemo(() => couleurAleatoire(), [])); // Calcul de la couleur une seule fois
    const [uniqueModalContent, setUniqueModalContent] = useState(""); // Contenu modal unique pour chaque ressource
    const personnesPartageState = useState([]); // Utiliser un nom de variable différent pour l'état
    const personnesPartage = personnesPartageState[0]; // Récupérer le tableau
    const setPersonnesPartage = personnesPartageState[1]; // Récupérer la fonction pour mettre à jour le tableau
    const personneInputRef = useRef(""); // Créer un ref pour l'entrée de texte

    const typeRelationLabels = typeRelations.map(typeRelation => (
        <span key={typeRelation['@id']} className="typeRelation">{typeRelation.libelle}</span>
    ));

    const delai = formatDelai(date_creation);

    const toggleModal = (content) => {
        setIsModalOpen(!isModalOpen);
        setUniqueModalContent(content); // Stocker le contenu modal unique pour cette ressource
    };

    const personnesPartageMemo = useMemo(() => {
        const personnes = [];
        voirRessource.forEach(personne => {
            personnes.push(`${personne.email}`);
        });
        return personnes;
    }, [voirRessource]);

    const handleClose = () => {
        setIsModalPartagerOpen(false);
    }

    const handleOpenModalPartager = () => {
        setIsModalPartagerOpen(true);
    }

    const ajouterPersonne = async () => {
        let url = apiConfig.apiUrl + '/api/voir_ressources/' + idRessource + '/voir';

        // Convertir la valeur de l'élément de texte en tableau
        const voirRessourceArray = [personneInputRef.current.value];

        const { data, error } = await customFetch({
            url: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                voirRessource: voirRessourceArray,
            })
        }, true);

        if (error) {
            console.error('Erreur lors de la récupération des ressources:', error);
        } else {
            handleClose();
            window.location.reload();
        }
    }

    const supprimerPersonne = async (personne) => {
        let url = apiConfig.apiUrl + '/api/voir_ressources/' + idRessource + '/voir';

        const {data, error} = await customFetch({
            url: url,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                utilisateur_id: personne,
            })
        }, true);

        if (error) {
            console.error('Erreur lors de la récupération des ressources:', error);
        } else {
            handleClose();
            window.location.reload();
        }
    }
    const [isFavorited, setIsFavorited] = useState(false); // État pour gérer si la ressource est en favoris ou non

    const mettreEnFavoris = async () => {
        try {
            const { data, error } = await customFetch({
                url: `${apiConfig.apiUrl}/api/progressions`, // Utiliser l'ID dans l'URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                },
                body: JSON.stringify({
                    TypeProgression: '/api/type_progressions/1', // Assurez-vous d'utiliser le bon ID de type de progression
                    Utilisateur: `/api/utilisateurs/${idUser}`, // Remplacez idUser par l'ID de l'utilisateur actuel
                    Ressource: `/api/ressources/${idRessource}`, // Remplacez idRessource par l'ID de la ressource actuelle
                })
            }, true);

            if (error) {
                console.error('Erreur lors de la mise en favoris de la ressource:', error);
            } else {
                // Mettre à jour l'état pour refléter que la ressource est maintenant en favoris
                setIsFavorited(true);
                // Afficher un message de succès ou effectuer d'autres actions si nécessaire
            }
        } catch (error) {
            console.error('Erreur lors de la mise en favoris de la ressource:', error);
        }
    };

    const retirerDesFavoris = async () => {
        try {
            // Effectuez l'appel pour retirer la ressource des favoris ici
            // Mettre à jour l'état pour refléter que la ressource n'est plus en favoris
            setIsFavorited(false);
        } catch (error) {
            console.error('Erreur lors du retrait de la ressource des favoris:', error);
        }
    };

    const DialogPartager = () => {
        return (
            <Dialog
                open={isModalPartagerOpen}
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Partager avec"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <TextField
                            label="Ajouter une personne"
                            variant="outlined"
                            inputRef={personneInputRef} // Attacher le ref à l'entrée de texte
                            sx={{ marginTop: 1}}
                        />
                        {/* Liste des personnes avec les boutons pour ajouter/supprimer */}
                        {personnesPartageMemo.map((personne, index) => (
                            <div key={index}>
                                <span>{personne}</span>
                                <Button onClick={() => supprimerPersonne(personne)}>Supprimer</Button>
                            </div>
                        ))}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {/* Bouton pour ajouter une personne */}
                    <Button onClick={ajouterPersonne}>Ajouter</Button>
                    {/* Bouton pour fermer le modal */}
                    <Button onClick={handleClose}>Fermer</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <div className="card">
            <img src={imageUrl} alt={title} className="card-image" />
            <div className="card-content">
                <div className={"card-header"}>
                    <h2 className="card-title">{title}</h2>
                    <div className="modal-container"> {/* Conteneur pour l'icône de menu et la modal */}
                        {idUser && (
                            <img src={Menu} alt={"voir plus logo"} onClick={() => toggleModal(description)} />
                        )}
                        {isModalOpen && (
                            <div className="modal" onClick={() => setIsModalOpen(false)}>
                                {/* Utilisez isFavorited pour afficher le bon libellé du bouton */}
                                <a onClick={isFavorited ? retirerDesFavoris : mettreEnFavoris}>
                                    {isFavorited ? "Retirer des favoris" : "Mettre en favoris la ressource"}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="info-container">
                    <div className="categories-container">
                        <div className="cat">{typeRessource}</div>
                        <div className="type-relations">{typeRelationLabels}</div>
                        <div className="categorie">{categorie}</div>
                    </div>
                    <div className="description">
                        <div className="info">
                            <div className={"pdp-utilisateur"} style={{ backgroundColor: color }}> {nom[0].toUpperCase()} {prenom[0].toUpperCase()}</div>
                            <div className={"info-utilisateur"}>
                                <p>{nom} {prenom}</p>
                                <p>{delai}</p>
                            </div>
                        </div>
                        <div className="logo-container">
                            <div className="card-logo">
                                <img src={Vu} alt={"Vues"} />
                                <p>{vue} Vues</p>
                            </div>
                            <div className="card-logo">
                                <img src={Com} alt={"Commentaires"} />
                                <p>{nbCommentaire} Commentaires</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DialogPartager/>
        </div>
    );
}

export default Card;
