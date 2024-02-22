import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const VerifCodeInscription = () => {
    const { id, code } = useParams(); // Récupération des paramètres de l'URL

    const [data, setData] = useState(null); // État pour stocker les données de l'API

    useEffect(() => {
        // Fonction pour effectuer l'appel API
        const fetchData = async () => {
            try {
                // Effectuer l'appel API avec les identifiants récupérés
                const response = await fetch(`http://localhost:8000/api/verif/${id}/${code}`);
                const responseData = await response.json();
                setData(responseData); // Mettre à jour l'état avec les données de l'API
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchData(); // Appeler la fonction fetchData lors du premier rendu du composant
    }, [id, code]); // Déclencher l'effet lorsque id ou code changent

    return (
        <div>
            <h1>Bienvenue sur notre application</h1>
            <p>ID : {id}</p>
            <p>Code : {code}</p>
            {data && (
                <div>
                    <h2>Réponse de l'API :</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default VerifCodeInscription;