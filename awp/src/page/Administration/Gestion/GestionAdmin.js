import React from 'react';
import TabMenu from '../../../composants/Administration/TabMenu.js';
import GestionRessources from "./GestionRessources";

const GestionAdmin = () => {
    const tabs = [
        {
            label: 'Utilisateurs',
            content: 'Contenu du tableau 1'
        },
        {
            label: 'Ressources',
            content: <GestionRessources/>
        },
        {
            label: 'Catégories',
            content: 'Contenu du tableau 2'
        }
    ];

    return (
        <div>
            <TabMenu tabs={tabs}/>
        </div>
    );
}

export default GestionAdmin;
