import React, {useEffect, useState} from 'react';
import Pagination from "../../composants/General/PaginationGlobal";
import CardRessource from "../../composants/Ressource/CardRessource";
function ListRessources() {
    const [ressources, setRessources] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/ressources') // Assurez-vous d'utiliser le bon chemin d'accès à votre API
            .then(response => response.json())
            .then(data => setRessources(data['hydra:member']))
            .catch(error => console.error('Erreur lors de la récupération des ressources:', error));
    }, []);

    return (
        <div>
            <h1>Ressources:</h1>
            <br/>
            {ressources.map(ressource => (
                <CardRessource
                    key={ressource['@id']}
                    imageUrl={ressource.miniature} // Utilisez la propriété miniature pour l'URL de l'image
                    title={ressource.titre}
                    description={ressource.contenu} // Utilisez la propriété contenu pour la description
                />
            ))}
            <Pagination currentPage={1} totalPages={10} /> {/* Remplacer 10 par le nombre total de pages */}
        </div>
    );
}

export default ListRessources;
