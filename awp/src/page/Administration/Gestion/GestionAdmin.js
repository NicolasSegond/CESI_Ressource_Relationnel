import React, { useEffect, useState } from 'react';
import TabMenu from '../../../composants/Administration/TabMenu.js';
import GestionRessources from "./GestionRessources";
import GestionCategories from "./GestionCategories";
import GestionUtilisateurs from "./GestionUtilisateurs";
import { getRolesUser, getIdUser, getTokenDisconnected } from "../../../utils/authentification";

const GestionAdmin = () => {
    const [userRoles, setUserRoles] = useState([]);
    const token = getTokenDisconnected();

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                const userID = getIdUser(token);
                const rolesUser = await getRolesUser(userID);
                console.log('Roles:', rolesUser); // Ajoutez cette ligne pour vérifier les rôles
                setUserRoles(rolesUser);
            }
        };

        fetchData();
    }, []); // Utilisez un tableau vide pour n'exécuter qu'une seule fois

    const allTabs = [
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

    // Filtrer les onglets en fonction des rôles de l'utilisateur
    const filteredTabs = userRoles.includes('ROLE_MODO')
        ? allTabs.filter(tab => tab.label === 'Ressources')
        : allTabs;

    return (
        <div>
            <TabMenu tabs={filteredTabs}/>
        </div>
    );
}

export default GestionAdmin;
