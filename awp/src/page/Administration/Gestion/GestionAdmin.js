import React from 'react';
import TabMenu from '../../../composants/Administration/TabMenu.js';
import GestionRessources from "./GestionRessources";
import GestionCategories from "./GestionCategories";

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
            content: <GestionCategories/>
        }
    ];

    return (
        <div>
            <TabMenu tabs={tabs}/>
        </div>
    );
}

export default GestionAdmin;
