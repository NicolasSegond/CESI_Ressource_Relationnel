import React from 'react';
import TabMenu from '../../../composants/Administration/TabMenu.js';
import GestionRessources from "./GestionRessources";
import GestionCategories from "./GestionCategories";
import GestionUtilisateurs from "./GestionUtilisateurs";

const GestionAdmin = () => {
    const tabs = [
        {
            label: 'Utilisateurs',
            content: <GestionUtilisateurs/>
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
