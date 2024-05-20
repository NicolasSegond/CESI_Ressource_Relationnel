import React, { useState, useEffect } from 'react';
import './CardRessource.css';
import Vu from "../../assets/vue.png";
import Com from "../../assets/commentaire.png";
import Menu from "../../assets/menu.png";
import { Link } from "react-router-dom";
import { customFetch } from "../../utils/customFetch";
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

function CardJeuRessource({
                              id,
                              imageUrl,
                              title,
                              vue,
                              date_creation,
                              typeRessource,
                              typeRelations,
                              categorie,
                              nbCommentaire,
                              proprietaireId,
                              connectUserId,
                              resourceId,
                              progressions = [],
                              showAlertMessage
                          }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isMiseDeCote, setIsMiseDeCote] = useState(false);

    useEffect(() => {
        // Ensure progressions is defined and is an array
        const favorited = Array.isArray(progressions) && progressions.some(progression => progression.TypeProgression === "/api/type_progressions/1" && progression.Utilisateur.id === connectUserId);
        setIsFavorited(favorited);

        const miseDeCote = Array.isArray(progressions) && progressions.some(progression => progression.TypeProgression === "/api/type_progressions/2" && progression.Utilisateur.id === connectUserId);
        setIsMiseDeCote(miseDeCote);
    }, [progressions, connectUserId]);

    const typeRelationLabels = typeRelations.map(typeRelation => (
        <span key={typeRelation['@id']} className="typeRelation">{typeRelation.libelle}</span>
    ));

    const delai = formatDelai(date_creation);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const mettreEnProgression = async (idTypeProgression) => {
        try {
            const successMessage = idTypeProgression === 1 ? 'La ressource a été mise en favoris avec succès' : 'La ressource a été mise de côté avec succès';

            const { data, error } = await customFetch({
                url: `${apiConfig.apiUrl}/api/progressions`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                },
                body: JSON.stringify({
                    TypeProgression: `/api/type_progressions/${idTypeProgression}`,
                    Utilisateur: `/api/utilisateurs/${connectUserId}`,
                    Ressource: `/api/ressources/${resourceId}`,
                })
            }, true);

            if (error) {
                console.error('Erreur lors de la mise en progression de la ressource:', error);
                showAlertMessage(`Erreur lors de la mise en ${idTypeProgression === 1 ? 'favoris' : 'de côté'} de la ressource`);
            } else {
                if (idTypeProgression === 1) {
                    setIsFavorited(true);
                } else if (idTypeProgression === 2) {
                    setIsMiseDeCote(true);
                }
                showAlertMessage(successMessage);
            }
        } catch (error) {
            console.error('Erreur lors de la mise en progression de la ressource:', error);
            showAlertMessage(`Erreur lors de la mise en ${idTypeProgression === 1 ? 'favoris' : 'de côté'} de la ressource`);
        }
    };

    return (
        <Link to={`/ressources/jeu/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card">
                <img src={imageUrl} alt={title} className="card-image" />
                <div className="card-content">
                    <div className="card-header">
                        <h2 className="card-title">{title}</h2>
                        <div className="modal-container">
                            <img src={Menu} alt="voir plus logo" onClick={(e) => {
                                e.preventDefault();
                                toggleModal();
                            }} />
                            {isModalOpen && (
                                <div className="modal" onClick={(e) => {
                                    e.preventDefault();
                                    setIsModalOpen(false);
                                }}>
                                    {!isFavorited && (
                                        <a onClick={() => mettreEnProgression(1)}>Mettre en favoris la ressource</a>
                                    )}
                                    {!isMiseDeCote && (
                                        <a onClick={() => mettreEnProgression(2)}>Mettre de côté la ressource</a>
                                    )}
                                    {proprietaireId === connectUserId && (
                                        <Link to={`/modifressource/${resourceId}`}><a> Modifier</a></Link>
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
                            <div className="logo-container">
                                <div className="card-logo">
                                    <img src={Vu} alt="Vues" />
                                    <p>{vue} Vues</p>
                                </div>
                                <div className="card-logo">
                                    <img src={Com} alt="Commentaires" />
                                    <p>{nbCommentaire} Commentaires</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default CardJeuRessource;

