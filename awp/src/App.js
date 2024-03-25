import React from "react";
import Connexion from "./page/connexion";
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Inscription from "./page/Inscription/inscription";
import Root from "./page/Root/Root";
import Deconnexion, {loader as deconnexionLoader} from "./page/Deconnexion/deconnexion";
import AjoutRessource, {loader as AjoutLoader} from "./page/Ressource/ajoutRessource";
import VerifCodeInscription from "./page/verifCodeInscription";

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Root/>,
            children: [
                {
                    path: '/ressource/ajout',
                    element: <AjoutRessource />,
                    loader: AjoutLoader
                },
                {
                    path: '/verifCode/:id/:code',
                    element: <VerifCodeInscription/>,
                }
            ],
        },
        {
            path: '/inscription',
            element: <Inscription/>,
        },
        {
            path: '/connexion',
            element: <Connexion/>,
        },
        {
            path: '/deconnexion',
            element: <Deconnexion/>,
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
