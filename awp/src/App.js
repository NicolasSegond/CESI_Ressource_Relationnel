import React, {useEffect, useState} from "react";
import Connexion from "./page/connexion";
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Inscription from "./page/Inscription/inscription";
import Root from "./page/Root/Root";
import Deconnexion, {loader as deconnexionLoader} from "./page/Deconnexion/deconnexion";
import AjoutRessource, {loader as AjoutLoader} from "./page/Ressource/ajoutRessource";
import VerifCodeInscription from "./page/verifCodeInscription";
import Admin, {loader as AdminLoader} from "./page/Administration/RootAdmin";
import {getIdUser, getRolesUser, getTokenDisconnected} from "./utils/authentification";

function App() {
    const [userRoles, setUserRoles] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const token = getTokenDisconnected();

    useEffect(() => {
        const fetchData = async () => {
            if (token && !dataFetched) {
                const userID = getIdUser(token);
                const rolesUser = await getRolesUser(userID);
                setUserRoles(rolesUser);
                setDataFetched(true);
            }
        };

        fetchData();
    }, [token, dataFetched]);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Root roles={userRoles} />,
            children: [
                {
                    path: '/ressource/ajout',
                    element: <AjoutRessource />,
                    loader: AjoutLoader
                },
                {
                    path: '/verifCode/:id/:code',
                    element: <VerifCodeInscription />,
                },
                {
                    path: '/admin',
                    element: <Admin roles={userRoles} />,
                    children: [
                        {
                            path: '/admin/ajout',
                            element: <AjoutRessource />,
                            loader: AjoutLoader
                        }
                    ]
                }
            ],
        },
        {
            path: '/inscription',
            element: <Inscription />,
        },
        {
            path: '/connexion',
            element: <Connexion />,
        },
        {
            path: '/deconnexion',
            element: <Deconnexion />,
            loader: deconnexionLoader,
        }
    ]);
    return (
        <div>
            <RouterProvider router={router}>
            </RouterProvider>
        </div>
    );
}


export default App;
