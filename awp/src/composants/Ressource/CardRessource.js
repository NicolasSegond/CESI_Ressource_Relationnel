import React from 'react';
import './CardRessource.css';
import Vu from "../../assets/vue.png";
import Com from "../../assets/commentaire.png";

function Card({ imageUrl, title, description, vue, auteur, visibilite, typeRessource, typeRelations, categorie, nbCommentaire }) {

    const typeRelationLabels = typeRelations.map(typeRelation => (
        <span key={typeRelation['@id']} className="typeRelation">{typeRelation.libelle}</span>
    ));

    return (
        <div className="card">
            <img src={imageUrl} alt={title} className="card-image" />
            <div className="card-content">
                <h2 className="card-title">{title}</h2>
                <div className="info-container">
                    <div className="categories-container">
                        <div className="cat">{typeRessource}</div>
                        <div className="type-relations">{typeRelationLabels}</div>
                        <div className="categorie">{categorie}</div>
                    </div>
                    <div className="info">
                        <p>{visibilite}</p>
                        <p><strong>{auteur}</strong></p>
                    </div>
                    <div className="logo-container">
                        <p>{vue}</p>
                        <img className="card-logo" src={Vu} alt={"Vues"}/>
                        <p>{nbCommentaire}</p>
                        <img className="card-logo" src={Com} alt={"Commentaires"}/>
                        <p className="card-logo">Commentaries</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
