import React, { useState, useEffect, useRef } from 'react';
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
    const [alerts, setAlerts] = React.useState([]);

    const [editorContent, setEditorContent] = React.useState(null);

    const [categorie, setCategorie] = useState('');
    const [relationTypes, setRelationTypes] = useState([]);

    const [resourceTypes, setResourceTypes] = useState('');

    const titre = useRef();
    const piece_jointes = useRef();
    const miniature = useRef();


    const [options, setOptions] = useState(null);
    const visibilite = [
        { id: 1, name: "Public" },
        { id: 2, name: "Prive" }
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiConfig.apiUrl}/api/ressources/${id}`);
                if (!response.ok) {
                    setError("La ressource ne vous appartient pas. Ou n'existe pas!");
                    throw new Error('Erreur lors de la récupération des données');
                }
                const data = await response.json();
                console.log(data);
                setRessource(data);

                setCategorie(data.categorie.id);

                setResourceTypes(data.typeDeRessource.id);
                setEditorContent(data.contenu)
                const mapRelationsPromise = new Promise((resolve, reject) => {
                    try {
                        const relationIds = data.typeRelations.map(relation => relation.id);
                        resolve(relationIds);
                    } catch (error) {
                        reject(error);
                    }
                });

                // Attendez que la promesse soit résolue avant de définir les relations
                const relationIds = await mapRelationsPromise;
                setRelationTypes(relationIds);




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
            setTagsID(ressource.visibilite.id);
        }
    }, [ressource]);

    const handleChange = (content) => {
        setEditorContent(content);
    };
    const addAlert = (severity, message) => {
        setAlerts(prevAlerts => [...prevAlerts, { severity, message }]);
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
            setRelationTypes(e.target.value);
            // console.log(e.target.value);// Assurez-vous que setRelationTypes met à jour un tableau
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
    const handleUpdateResource = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const typeRelationValue = e.target.relations.value;

        let uploadedFileName = null;

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


        try {
            const requestBody = {
                titre: titre.current.value,
                contenu: editorContent,
                dateModification: new Date(),
                statut: "/api/statuts/2",
                visibilite: tagsID != null ? '/api/visibilites/' + tagsID : null,
                typeDeRessource: resourceTypes !== '' ? '/api/type_de_ressources/' + resourceTypes : null,
                typeRelations: formattedTypeRelations,
                categorie: categorie !== '' ? '/api/categories/' + categorie : null,
            };

            // Vérifier si une nouvelle miniature a été ajoutée
            if (miniature.current.files.length > 0) {
                requestBody.miniature = miniature.current.files[0].name;
                formData.append('miniature[]', miniature.current.files[0]); // Ajouter la miniature au FormData
            }

            // Vérifier si de nouvelles pièces jointes ont été ajoutées
            const files = piece_jointes.current.files;
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const fileName = files[i].name;
                    const fileParts = fileName.split('.');
                    const fileExtension = fileParts[fileParts.length - 1];
                    console.log(fileName);
                    if (fileExtension !== 'pdf' && fileExtension !== 'doc' && fileExtension !== 'docx' && fileExtension !== 'ppt' && fileExtension !== 'pptx' && fileExtension !== 'xls' && fileExtension !== 'xlsx' && fileExtension !== 'png' && fileExtension !== 'jpg' && fileExtension !== 'jpeg') {
                        addAlert('error', 'Le format des pièces jointes doit être pdf, doc, docx, ppt, pptx, xls, xlsx, png, jpg ou jpeg');
                        return;
                    }

                    formData.append('fichiers[]', files[i]);
                }
            }

            const response = await customFetch({
                url: `${apiConfig.apiUrl}/api/ressources/${id}`,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
                body: JSON.stringify(requestBody),
            }, true);

            if (response.statusCode === 200) {
                addAlert('success', 'Ressource mise à jour avec succès');
                formData.append('idRessource', id);

                let uploadResponse = await fetch(apiConfig.apiUrl + '/api/uploadsEdit', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    addAlert('error', 'Erreur lors de l\'ajout des pièces jointes');
                } else {
                    addAlert('success', 'Pièces jointes ajoutées avec succès');
                }

                navigate('/');
            } else {
                const errorMessage = `Erreur lors de la mise à jour de la ressource: ${response.statusText}`;
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Erreur:', error);
            addAlert('error', error.message);
        }
    };

    return (
        <div>
            {ressource && relationTypes ? (
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
                                alignment: "gauche",
                                ref: titre
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
                                name: "miniature",
                                className: "miniature-container",
                                ismultiple: false,
                                ref: miniature,
                                required: false
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
                            {
                                select_type: "telechargement",
                                label: "Pièces jointes :",
                                alignment: "droite",
                                name: "pieces_jointes",
                                className: "drop-container",
                                ismultiple: true,
                                ref: piece_jointes,
                                required: false
                            }
                            // Ajoutez d'autres champs de formulaire en fonction des données de la ressource
                        ]}
                        initialValues={ressource}
                        onChange={handleChange}
                        onSubmit={handleUpdateResource}
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
