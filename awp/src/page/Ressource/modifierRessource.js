import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ModifierRessource() {
    const { id } = useParams();
    const [ressource, setRessource] = useState(null);

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

    return (
        <div>
            <h1>Page de modification de la ressource</h1>
            {ressource ? (
                <div>
                    <p>Titre: {ressource.titre}</p>
                    <p>Description: {ressource.contenu}</p>
                    {/* Affichez d'autres détails de la ressource selon vos besoins */}
                </div>
            ) : (
                <p>Chargement en cours...</p>
            )}
        </div>
    );
}

export default ModifierRessource;
