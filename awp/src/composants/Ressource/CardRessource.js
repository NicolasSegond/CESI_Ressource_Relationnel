import React, {useEffect, useMemo, useRef, useState} from 'react';
import './CardRessource.css';
import Vu from "../../assets/vue.png";
import Com from "../../assets/commentaire.png";
import Menu from "../../assets/menu.png";
import {Link} from "react-router-dom";
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

function Card({
                  id,
                  imageUrl,
                  title,
                  description,
                  proprietaire,
                  vue,
                  nom,
                  prenom,
                  date_creation,
                  visibilite,
                  typeRessource,
                  typeRelations,
                  categorie,
                  nbCommentaire,
                  voirRessource,
                  idUser,
                  userRoles,
                  progressions,
                  showAlertMessage
              }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalPartagerOpen, setIsModalPartagerOpen] = useState(false);
    const [modalContent, setModalContent] = useState(""); // Contenu du modal spécifique à chaque ressource
    const [color] = useState(useMemo(() => couleurAleatoire(), [])); // Calcul de la couleur une seule fois
    const [uniqueModalContent, setUniqueModalContent] = useState(""); // Contenu modal unique pour chaque ressource
    const personnesPartageState = useState([]); // Utiliser un nom de variable différent pour l'état
    const personnesPartage = personnesPartageState[0]; // Récupérer le tableau
    const setPersonnesPartage = personnesPartageState[1]; // Récupérer la fonction pour mettre à jour le tableau
    const personneInputRef = useRef(""); // Créer un ref pour l'entrée de texte
    const [isFavorited, setIsFavorited] = useState(false);
    const [isMiseDeCote, setIsMiseDeCote] = useState(false);

    useEffect(() => {
        // Vérifiez si la progression de mise en favori est déjà effectuée
        const favorited = progressions.some(progression => progression.TypeProgression === "/api/type_progressions/1" && progression.Utilisateur.id === idUser);
        setIsFavorited(favorited);

        // Vérifiez si la progression de mise en mise de côté est déjà effectuée
        const miseDeCote = progressions.some(progression => progression.TypeProgression === "/api/type_progressions/2" && progression.Utilisateur.id === idUser);
        setIsMiseDeCote(miseDeCote);
    }, [progressions, idUser]);


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
        let url = apiConfig.apiUrl + '/api/voir_ressources/' + id + '/voir';

        // Convertir la valeur de l'élément de texte en tableau
        const voirRessourceArray = [personneInputRef.current.value];

        const {data, error} = await customFetch({
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
        let url = apiConfig.apiUrl + '/api/voir_ressources/' + id + '/voir';

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

    const mettreEnProgression = async (idTypeProgression) => {
        try {
            let successMessage = '';

            switch (idTypeProgression) {
                case 1:
                    successMessage = 'La ressource a été mise en favoris avec succès';
                    break;
                case 2:
                    successMessage = 'La ressource a été mise de côté avec succès';
                    break;
                default:
                    successMessage = 'La ressource a été mise en progression avec succès';
                    break;
            }

            const {data, error} = await customFetch({
                url: `${apiConfig.apiUrl}/api/progressions`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                },
                body: JSON.stringify({
                    TypeProgression: `/api/type_progressions/${idTypeProgression}`,
                    Utilisateur: `/api/utilisateurs/${idUser}`,
                    Ressource: `/api/ressources/${id}`,
                })
            }, true);

            // Vérifier s'il y a une erreur
            if (error) {
                console.error('Erreur lors de la mise en progression de la ressource:', error);
                showAlertMessage(`Erreur lors de la mise en ${idTypeProgression === 1 ? 'favoris' : 'de côté'} de la ressource`);
            } else {
                // Mettre à jour l'état local en fonction du type de progression
                if (idTypeProgression === 1) {
                    setIsFavorited(true);
                } else if (idTypeProgression === 2) {
                    setIsMiseDeCote(true);
                }

                // Afficher le message de succès
                showAlertMessage(successMessage);
            }
        } catch (error) {
            console.error('Erreur lors de la mise en progression de la ressource:', error);
            showAlertMessage(`Erreur lors de la mise en ${idTypeProgression === 1 ? 'favoris' : 'de côté'} de la ressource`);
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
                            sx={{marginTop: 1}}
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
        <>
            <Link to={`/ressources/${id}`}
                  style={{textDecoration: 'none', color: 'inherit'}}> {/* Utilise React Router pour naviguer */}
                <div className="card">
                    <img src={imageUrl} alt={title} className="card-image"/>
                    <div className="card-content">
                        <div className={"card-header"}>
                            <h2 className="card-title">{title}</h2>
                            <div className="modal-container"> {/* Conteneur pour l'icône de menu et la modal */}
                                {idUser && (
                                    <img src={Menu} alt={"voir plus logo"} onClick={(e) => {
                                        e.preventDefault();
                                        toggleModal(description, e);
                                    }}/>
                                )}
                                {isModalOpen && (
                                    <div className="modal" onClick={(e) => {
                                        e.preventDefault()
                                        setIsModalOpen(false);
                                    }}>
                                        {!isFavorited && (
                                            <a onClick={() => mettreEnProgression(1)}>Mettre en favoris la ressource</a>
                                        )}
                                        {!isMiseDeCote && (
                                            <a onClick={() => mettreEnProgression(2)}>Mettre de côté la ressource</a>
                                        )}
                                        {proprietaire.id === idUser && (
                                            <Link to={`/modifressource/${id}`}><a> Modifier</a></Link>
                                        )}
                                        {proprietaire.id === idUser && (
                                            <a onClick={() => handleOpenModalPartager()}>Partager la ressource</a>
                                        )}
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
                                    <div className={"pdp-utilisateur"}
                                         style={{backgroundColor: color}}> {nom[0].toUpperCase()} {prenom[0].toUpperCase()}</div>
                                    <div className={"info-utilisateur"}>
                                        <p>{nom} {prenom}</p>
                                        <p>{delai}</p>
                                    </div>
                                </div>
                                <div className="logo-container">
                                    <div className="card-logo">
                                        <img src={Vu} alt={"Vues"}/>
                                        <p>{vue} Vues</p>
                                    </div>
                                    <div className="card-logo">
                                        <img src={Com} alt={"Commentaires"}/>
                                        <p>{nbCommentaire} Commentaires</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <DialogPartager/>
        </>
    );
}

export default Card;
