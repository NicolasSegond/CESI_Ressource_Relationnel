import React, { useState, useEffect } from 'react';
import MonFormRessource from "../../composants/Ressource/MonFormRessource";
import { redirect, useNavigate, useParams } from 'react-router-dom';
import apiConfig from "../../utils/config";
import { customFetch } from "../../utils/customFetch";
import { getIdUser, getTokenDisconnected } from "../../utils/authentification";

function ModifierRessource() {
    const { id } = useParams();
    const [ressource, setRessource] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [tags, setTags] = useState(null);
    const [tagsID, setTagsID] = useState(null);

    const [categorie, setCategorie] = useState('');
    const [relationTypes, setRelationTypes] = useState([]);

    const [resourceTypes, setResourceTypes] = useState('');

    const [options, setOptions] = useState(null);
    const visibilite = [
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
                console.log(data);
                setRessource(data);

                setCategorie(data.categorie.id);

                setResourceTypes(data.typeDeRessource.id);






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
        const fetchOptions = async () => {
            try {
                const { data, error } = await customFetch({
                    url: apiConfig.apiUrl + '/api/options',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }, true);

                if (error && error.message && error.message.includes('DECONNEXION NECCESSAIRE')) {
                    return redirect('/connexion');
                }

                setOptions(data);
               // setCategorie(ressource.categorie.id);
              //  console.log(ressource.categorie);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Gérer l'erreur
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        if (ressource) {
            setTags(ressource.visibilite.libelle);
        }
    }, [ressource]);

    const handleChange = (content) => {

    };

    const handleSubmit = (content) => {

    };

    const handleRedirect = () => {
        navigate('/');
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

    };

    const handleRelationChange = (e) => {
        if (e.target.value.length <= 3) {
            setRelationTypes(e.target.value); // Assurez-vous que setRelationTypes met à jour un tableau
        }
    }


    const onDeleteRelation = (value) => {
        setRelationTypes(
            relationTypes.filter((item) => item !== value)
        )
    }

    const handleRessourceTypes = (value) => {
        setResourceTypes(value);
    };

    const handleTagClick = (value) => {
        setTagsID(value.id);
        setTags(value.name);
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
                                options: visibilite,
                                value: tags,
                                onChange: handleTagClick
                            },
                            {
                                select_type: "select",
                                label: "Catégories *",
                                name: "categorie",
                                label_select: "Catégories de la ressource :",
                                alignment: "droite",
                                options: options ? options.categories : [],
                                value: categorie,
                                onChange: handleCategorieChange,
                            },
                            {
                                select_type: "multi-select",
                                label_select: "Type de relations :",
                                label: "Relations * ",
                                alignment: "droite",
                                options: options ? options.relationTypes : [],
                                name: "relations",
                                nbElementMax: 3,
                                value: relationTypes,
                                onChange: handleRelationChange,
                                onDelete: onDeleteRelation,
                            },
                            {
                                select_type: "select",
                                label: "typeRessource *",
                                name: "typeRessource",
                                label_select: "Type de Ressource :",
                                alignment: "droite",
                                options: options ? options.resourceTypes : [],
                                value: resourceTypes,
                                onChange: handleRessourceTypes,
                            },
                            // Ajoutez d'autres champs de formulaire en fonction des données de la ressource
                        ]}
                        initialValues={ressource}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        buttonText="Modifier la ressource"
                    />
                </div>
            ) : (
                <p>Chargement en cours...</p>
            )}
        </div>
    );
}

export default ModifierRessource;
