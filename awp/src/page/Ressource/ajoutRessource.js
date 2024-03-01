
import React from 'react';
import MonFormRessource from '../../composants/Ressource/MonFormRessource';
import './formRessource.css';

const handleChange = (e) => {

}

const handleSubmit = (e) => {

}

const name = [
    "Professionnel",
    "Familiale",
    "Sociale",
    "Personnelle",
]


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
        className: "",
        ismultiple: false
    },
    {
        select_type: "select",
        label_select: "Visibilité de la ressource :",
        label: "Visibilité *",
        alignment: "droite",
        options: [
            { value: "public", label: "Public" },
            { value: "prive", label: "Privé" },
            { value: "Partager", label: "Partager" }
        ],
        require: 'Required'
    },
    {
        select_type: "multi-select",
        label: "Catégories de la ressource :",
        alignment: "droite",
        name: name
    },
    {
        select_type: "telechargement",
        label: "Pièces jointes :",
        alignment: "droite",
        className: "drop-container",
        ismultiple: true
    }
];


const AjoutRessource = () => {
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