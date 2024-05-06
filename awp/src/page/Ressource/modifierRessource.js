import React, { useState, useEffect, useRef } from 'react';
import MonFormRessource from "../../composants/Ressource/MonFormRessource";
import {redirect, useLoaderData, useNavigate, useParams} from 'react-router-dom'; // Importez useNavigate au lieu de useHistory
import apiConfig from "../../utils/config";
import { customFetch } from "../../utils/customFetch";
import {getIdUser, getTokenDisconnected} from "../../utils/authentification";


function ModifierRessource() {
    const { id } = useParams();
    const [ressource, setRessource] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Utilisez useNavigate au lieu de useHistory
    const [tags, setTags] = React.useState(null);
    const [tagsID, setTagsID] = React.useState(null);
    const [categorie, setCategorie] = React.useState('');
    const [relation, setRelation] = React.useState([]);
    const [typeRessource, setTypeRessource] = React.useState('');
    const data = useLoaderData().data;
    const options = [
        {id: 1, name: "Public"},
        {id: 2, name: "Prive"}
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/ressources/${id}`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }
                const data = await response.json();
                setRessource(data);

                const userId = getIdUser(getTokenDisconnected());
                if (data.proprietaire.id !== userId) {
                    setError("La ressource ne vous appartient pas.");
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (ressource && ressource.categories.id) {
            setCategorie(ressource.categories.id);
        }
    }, [ressource]);

    const handleChange = (content) => {

    };
    const handleSubmit = (content) => {

    };
    const handleRedirect = () => {
        navigate('/'); // Utilisez navigate au lieu de history.push
    };

    if (error) {
        return (
            <div>
                <h1>Erreur</h1>
                <p>{error}</p>
                <button onClick={handleRedirect}>Retour à l'accueil</button>
            </div>
        );
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

    let onDeleteRelation;
    const handleRelationChange = () => {

    };

    return (
        <div>
            {ressource ? (
                <div>
                    <h1>Page de modification de la ressource</h1>
                    <MonFormRessource
                        formData={[
                            {
                                select_type: "text",
                                type: "text",
                                name: "titre",
                                label: "Titre de la ressource :",
                                value: ressource.titre,
                                alignment: "gauche"
                            },
                            {
                                select_type: "textarea",
                                label: "Contenu de la ressource :",
                                placeholder: "Saisissez le contenu de la ressource ici...",
                                alignment: "gauche",
                                value: ressource.contenu,
                                onChange: (value) => setRessource({ ...ressource, contenu: value })
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
                                value: categorie,
                                onChange: handleCategorieChange,
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
                                onDelete: onDeleteRelation,
                            },
                            {
                                select_type: "select",
                                label_select: "Type de la ressource :",
                                label: "Type *",
                                alignment: "droite",
                                options: data.resourceTypes,
                                name: "typeRessource",
                                value: typeRessource,
                                onChange: handleTypeChange,
                            },


                            // Ajoutez d'autres champs de formulaire en fonction des données de la ressource
                        ]}
                        initialValues={ressource} // Passez les données de la ressource comme valeurs initiales pour le formulaire
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        buttonText="Modifier la ressource" // Définissez le libellé du bouton de soumission
                    />
                </div>
            ) : (
                <p>Chargement en cours...</p>
            )}
        </div>
    );
}

export default ModifierRessource;

export async function loader({}) {
    try {
        let {data, error} = await customFetch({
            url: apiConfig.apiUrl + '/api/options',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }, true);

        if (error && error.message && error.message.includes('DECONNEXION NECCESSAIRE')) {
            return redirect('/connexion');
        }

        return {
            data: data,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: error.message };
    }
}
