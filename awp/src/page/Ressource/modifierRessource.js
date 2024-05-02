import React, {useState, useEffect, useRef} from 'react';
import {redirect, useLoaderData, useParams} from 'react-router-dom';
import MonFormRessource from "../../composants/Ressource/MonFormRessource";
import {customFetch} from "../../utils/customFetch";
import apiConfig from "../../utils/config";

function ModifierRessource() {
    const { id } = useParams();
    const [ressource, setRessource] = useState(null);
    const [relation, setRelation] = React.useState([]);
    const [typeRessource, setTypeRessource] = React.useState('');
    const miniatureRef = useRef(null); // Créez une référence pour la miniature
    const [categorie, setCategorie] = React.useState('');
    const data = useLoaderData().data;
    const handleChange = (content) => {

    };
    const handleSubmit = (content) => {

    };
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


    useEffect(() => {
        const fetchRessource = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/ressources/${id}`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }
                const data = await response.json();
                setRessource(data);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchRessource();
    }, [id]);

    // Vérifiez si les données de la ressource ont été chargées, puis affichez le formulaire
    return (
        <div>
            <h1>Page de modification de la ressource</h1>
            {ressource ? (
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
                        {
                            select_type: "telechargement",
                            label: "Miniature de la ressource :",
                            alignment: "droite",
                            name: "miniature",
                            className: "miniature-container",
                            ismultiple: false,
                            ref: miniatureRef,
                            required: true
                        },
                        // Ajoutez d'autres champs de formulaire en fonction des données de la ressource
                    ]}
                    initialValues={ressource} // Passez les données de la ressource comme valeurs initiales pour le formulaire
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    buttonText="Modifier la ressource" // Définissez le libellé du bouton de soumission
                />
            ) : (
                <p>Chargement en cours...</p>
            )}
        </div>
    );
}

export default ModifierRessource;

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

    if (error && error.message && error.message.includes('DECONNEXION NECCESSAIRE')) {
        return redirect('/connexion');
    }

    return {
        data: data,
    };
}