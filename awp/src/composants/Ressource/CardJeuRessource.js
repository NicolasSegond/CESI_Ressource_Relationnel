import React, {useState} from 'react';
import './CardRessource.css';
import Vu from "../../assets/vue.png";
import Com from "../../assets/commentaire.png";
import Menu from "../../assets/menu.png";
import {Link} from "react-router-dom";

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
                              resourceId
                          }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(""); // Contenu du modal spécifique à chaque ressource

    const typeRelationLabels = typeRelations.map(typeRelation => (
        <span key={typeRelation['@id']} className="typeRelation">{typeRelation.libelle}</span>
    ));

    const delai = formatDelai(date_creation);

    const toggleModal = (content) => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <Link to={`/ressources/jeu/${id}`} style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="card">
                <img src={imageUrl} alt={title} className="card-image"/>
                <div className="card-content">
                    <div className={"card-header"}>
                        <h2 className="card-title">{title}</h2>
                        <div className="modal-container"> {/* Conteneur pour l'icône de menu et la modal */}
                            <img src={Menu} alt={"voir plus logo"} onClick={(e) => {
                                e.preventDefault();
                                toggleModal(e);
                            }}/>
                            {isModalOpen && (
                                <div className="modal" onClick={(e) => {
                                    e.preventDefault()
                                    setIsModalOpen(false);
                                }}>
                                    <a> Mettre en favoris la ressource </a>
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
    );
}

export default CardJeuRessource;
