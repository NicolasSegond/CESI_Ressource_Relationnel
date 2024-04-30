import React, {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import MonFormRessource from "../../composants/Ressource/MonFormRessource";

function ModifierRessource() {
    const { id } = useParams();
    const [ressource, setRessource] = useState(null);
    const miniatureRef = useRef(null); // Créez une référence pour la miniature

    const handleChange = (content) => {

    };
    const handleSubmit = (content) => {

    };

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
