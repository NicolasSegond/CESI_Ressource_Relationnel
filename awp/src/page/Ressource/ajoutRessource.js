
import React from 'react';
import MonFormRessource from '../../composants/Ressource/MonFormRessource';
import './formRessource.css';

const handleChange = (e) => {

}

const handleSubmit = (e) => {

}

const options = [
    "Public",
    "Prive",
    "Partager"
]

const categorie = [
    "Communication",
    "Culture",
    "Loisirs",
    "Développement Personnelles",
]

const name = [
    "Famille",
    "Amis",
    "Travail",
    "Connaissance",
    "Inconnu",
    "Autre"
]

const typeRessource = [
    "Livre",
    "Film",
    "Musique",
    "Podcast",
    "Article",
    "Conférence",
    "Exposition",
    "Spectacle",
    "Atelier",
    "Formation",
    "Cours",
    "Jeux",
    "Autre"
]


const AjoutRessource = () => {
    const [relation, setRelation] = React.useState([]);
    const [type, setType] = React.useState([]);

    const handleRelationChange = (e) => {
        if (e.target.value.length <= 3) {
            setRelation(e.target.value);
        }
    }

    const handleTypeChange = (e) => {
        if (e.target.value.length <= 3) {
            setType(e.target.value);
        }
    }

    const onDeleteRelation = (value) => {
        setRelation(
            relation.filter((item) => item !== value)
        )
    }

    const onDeleteType = (value) => {
        setType(
            type.filter((item) => item !== value)
        )
    }

    const formData = [
        {
            select_type: "text",
            type: "text",
            name: "titre",
            label: "Titre de la ressource :",
            value: "",
            alignment: "gauche",
        },
        {
            select_type: "textarea",
            label: "Contenu de la ressource :",
            placeholder: "Saissisez le contenu de la ressource ici...",
            alignment: "gauche",
        },
        {
            select_type: "telechargement",
            label: "Miniature de la ressource :",
            alignment: "droite",
            className: "miniature-container",
            ismultiple: false
        },
        {
            select_type: "tags",
            label_select: "Visibilité de la ressource :",
            label: "Visibilité *",
            alignment: "droite",
            options: options,
        },
        {
            select_type: "select",
            label: "Catégories *",
            label_select: "Catégories de la ressource :",
            alignment: "droite",
            options: categorie,
        },
        {
            select_type: "multi-select",
            label_select: "Type de relations :",
            label: "Relations * ",
            alignment: "droite",
            name: name,
            nbElementMax: 3,
            value: relation,
            onChange: handleRelationChange,
            onDelete: onDeleteRelation
        },
        {
            select_type: "multi-select",
            label_select: "Type de la ressource :",
            label: "Type *",
            alignment: "droite",
            name: typeRessource,
            nbElementMax: 1,
            value: type,
            onChange: handleTypeChange,
            onDelete: onDeleteType
        },
        {
            select_type: "telechargement",
            label: "Pièces jointes :",
            alignment: "droite",
            className: "drop-container",
            ismultiple: true
        }
    ];

    return (
        <MonFormRessource
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            buttonText={"Ajouter la ressource"}
        />
    );
}

export default AjoutRessource;