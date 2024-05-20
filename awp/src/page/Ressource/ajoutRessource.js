import React, { useRef } from 'react';
import {useNavigate, useLoaderData, redirect} from 'react-router-dom';
import MonFormRessource from '../../composants/Ressource/MonFormRessource';
import './formRessource.css';
import apiConfig from "../../utils/config";
import { customFetch } from "../../utils/customFetch";
import { getIdUser, getToken } from "../../utils/authentification";
import CustomAlert from "../../composants/CustomAlert";

const options = [
    { id: 1, name: "Public" },
    { id: 2, name: "Prive" }
];

const AjoutRessource = () => {
    const [alerts, setAlerts] = React.useState([]);
    const [relation, setRelation] = React.useState([]);
    const [categorie, setCategorie] = React.useState('');
    const [typeRessource, setTypeRessource] = React.useState('');
    const [tags, setTags] = React.useState(null);
    const [tagsID, setTagsID] = React.useState(null);
    const [editorContent, setEditorContent] = React.useState(null);
    const token = getToken();
    const idUser = getIdUser(token);
    const navigate = useNavigate();

    const titre = useRef();
    const miniature = useRef();
    const piece_jointes = useRef();

    const data = useLoaderData().data;

    const addAlert = (severity, message) => {
        setAlerts(prevAlerts => [...prevAlerts, { severity, message }]);
    };

    const handleCloseAlert = (index) => {
        setAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
    };

    const handleRelationChange = (e) => {
        if (e.target.value.length <= 3) {
            setRelation(e.target.value);
        }
    };

    const onDeleteRelation = (value) => {
        setRelation(relation.filter((item) => item !== value));
    };

    const handleCategorieChange = (value) => {
        setCategorie(value);
    };

    const handleTypeChange = (value) => {
        setTypeRessource(value);
    };

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
            required: true
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
    ];

    const handleSubmit = async (e) => {
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

        const fileName = miniature.current.files.length ? miniature.current.files[0].name : '';
        const fileParts = fileName.split('.');
        const fileExtension = fileParts[fileParts.length - 1];

        if (miniature.current.files.length === 0) {
            addAlert('error', 'Veuillez ajouter une miniature');
            return;
        }

        if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'png') {
            addAlert('error', 'Le format de la miniature doit être jpg, jpeg ou png');
            return;
        }

        const body = {
            titre: titre.current.value,
            miniature: miniature.current.files && miniature.current.files[0] ? miniature.current.files[0].name : null,
            contenu: editorContent,
            dateCreation: new Date(),
            dateModification: new Date(),
            nombreVue: 0,
            proprietaire: `/api/utilisateurs/` + idUser,
            statut: '/api/statuts/2',
            visibilite: tagsID != null ? '/api/visibilites/' + tagsID : null,
            typeDeRessource: typeRessource !== '' ? '/api/type_de_ressources/' + typeRessource : null,
            typeRelations: formattedTypeRelations,
            categorie: categorie !== '' ? '/api/categories/' + categorie : null,
            valide: false
        };

        const formData = new FormData();

        const files = piece_jointes.current.files;

        for (let i = 0; i < files.length; i++) {
            const fileName = files[i].name;
            const fileParts = fileName.split('.');
            const fileExtension = fileParts[fileParts.length - 1];

            if (fileExtension !== 'pdf' && fileExtension !== 'doc' && fileExtension !== 'docx' && fileExtension !== 'ppt' && fileExtension !== 'pptx' && fileExtension !== 'xls' && fileExtension !== 'xlsx' && fileExtension !== 'png' && fileExtension !== 'jpg' && fileExtension !== 'jpeg') {
                addAlert('error', 'Le format des pièces jointes doit être pdf, doc, docx, ppt, pptx, xls, xlsx, png, jpg ou jpeg');
                return;
            }

            formData.append('fichiers[]', files[i]);
        }

        const miniatureFiles = miniature.current.files[0];
        formData.append('miniature[]', miniatureFiles);

        let { data, error } = await customFetch({
                url: apiConfig.apiUrl + '/api/ressources',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            },
            true
        );

        const dataResp = data;

        if (error) {
            addAlert('error', error.message);
        } else {
            addAlert('success', 'Ressource ajoutée avec succès');

            formData.append('idRessource', dataResp['id']);

            let response = await fetch(apiConfig.apiUrl + '/api/uploads', {
                method: 'POST',
                body: formData, // Assurez-vous de transmettre le FormData ici
            });

            if (!response.ok) {
                addAlert('error', 'Erreur lors de l\'ajout des pièces jointes');
            } else {
                addAlert('success', 'Pièces jointes ajoutées avec succès');
            }

            // Redirection vers la page d'accueil après succès
            navigate('/');
        }
    };

    return (
        <>
            <MonFormRessource
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                buttonText={"Ajouter la ressource"}
            />
            {alerts.map((alert, index) => (
                <CustomAlert
                    key={index}
                    open={true}
                    message={alert.message}
                    handleClose={() => handleCloseAlert(index)}
                    severity={alert.severity}
                />
            ))}
        </>
    );
};

export default AjoutRessource;

export async function loader({}) {
    let { data, error } = await customFetch({
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
