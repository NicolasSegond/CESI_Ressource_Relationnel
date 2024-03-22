
import React from 'react';
import MonFormRessource from '../../composants/Ressource/MonFormRessource';
import './formRessource.css';
import apiConfig from "../../utils/config";
import {customFetch} from "../../utils/customFetch";
import {redirect, useLoaderData} from "react-router-dom";
import {getIdUser, getToken} from "../../utils/authentification";

const options = [
    {id: 1, name: "Public"},
    {id: 2, name: "Prive"}
]

const AjoutRessource = () => {
    const [relation, setRelation] = React.useState([]);
    const [categorie, setCategorie] = React.useState('');
    const [typeRessource, setTypeRessource] = React.useState('');
    const [tags, setTags] = React.useState(null);
    const [tagsID, setTagsID] = React.useState(null);
    const [editorContent, setEditorContent] = React.useState(null);
    const token = getToken();
    const idUser = getIdUser(token);

    const data = useLoaderData().data;

    const handleRelationChange = (e) => {
        if (e.target.value.length <= 3) {
            setRelation(e.target.value);
        }
    }

    const onDeleteRelation = (value) => {
        setRelation(
            relation.filter((item) => item !== value)
        )
    }

    const handleCategorieChange = (value) => {
        setCategorie(value);
    }

    const handleTypeChange = (value) => {
        setTypeRessource(value);
    }

    const handleTagClick = (value) => {
        setTagsID(value.id);
        setTags(value.name);
    };

    const handleChange = (content) => {
        setEditorContent(content);
    };


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
            value: editorContent,
            onChange: setEditorContent
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
            value: tags,
            onChange: handleTagClick
        },
        {
            select_type: "select",
            label: "Catégories *",
            name: "categorie",
            label_select: "Catégories de la ressource :",
            alignment: "droite",
            options: data.categories,
            value : categorie,
            onChange: handleCategorieChange
        },
        {
            select_type: "multi-select",
            label_select: "Type de relations :",
            label: "Relations * ",
            alignment: "droite",
            options: data.relationTypes,
            name: "relations",
            nbElementMax: 3,
            value: relation,
            onChange: handleRelationChange,
            onDelete: onDeleteRelation
        },
        {
            select_type: "select",
            label_select: "Type de la ressource :",
            label: "Type *",
            alignment: "droite",
            options: data.resourceTypes,
            name: "typeRessource",
            value: typeRessource,
            onChange: handleTypeChange
        },
        {
            select_type: "telechargement",
            label: "Pièces jointes :",
            alignment: "droite",
            name: "pieces_jointes",
            className: "drop-container",
            ismultiple: true
        }
    ];

    const handleSubmit = async (e) => {
        const titre = e.target.titre.value || null;
        const typeRessource = e.target.typeRessource.value || null;
        e.preventDefault();
        const typeRelationValue = e.target.relations.value;

        // Convertir la valeur en tableau en séparant par ","
        const typeRelationArray = typeRelationValue.split(',');

        // Créer un nouveau tableau pour stocker les valeurs formatées
        const formattedTypeRelations = [];

        // Parcourir chaque élément du tableau
        for (const type of typeRelationArray) {
            // Créer l'URL de la ressource à partir de l'ID
            const url = `api/type_relations/${type}`;
            // Ajouter l'URL au tableau des relations formatées
            formattedTypeRelations.push(url);
        }

        console.log("Titre : " + titre)
        console.log(tags);
        console.log(editorContent);
        console.log(formattedTypeRelations);
        console.log("TypeRessource : " + e.target.typeRessource.value);
        console.log("Categorie : " + e.target.categorie.value);

        const body = {
            titre: titre,
            contenu: editorContent,
            dateCreation: new Date(),
            dateModification: new Date(),
            nombreVue: 0,
            proprietaire: `/api/utilisateurs/` + idUser,
            statut: '/api/statuts/2',
            visibilite: '/api/visibilites/' + tagsID,
            typeDeRessource: '/api/type_de_ressources/' + typeRessource,
            typeRelations: formattedTypeRelations,
            categorie: '/api/categories/' + categorie
        };

        let {data, error} = await customFetch({
                url: apiConfig.apiUrl + '/api/ressources',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body
            },
            true
        );

        if(error){
            alert(error.message);
        } else{
            console.log(data);
            alert("Ressource ajoutée avec succès");
        }



    }

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

export async function loader({}) {
    let {data, error} = await customFetch({
            url: apiConfig.apiUrl + '/api/options',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        },
        true
    );

    if(error && error.message && error.message.includes('DECONNEXION NECCESSAIRE')){
        return redirect('/connexion');
    }

    return {
        data: data,
    };
}