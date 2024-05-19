import React from "react";
import Connexion from "./page/connexion";
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Inscription from "./page/Inscription/inscription";
import Root from "./page/Root/Root";
import Deconnexion, {loader as deconnexionLoader} from "./page/Deconnexion/deconnexion";
import AjoutRessource, {loader as AjoutLoader} from "./page/Ressource/ajoutRessource";
import VerifCodeInscription from "./page/verifCodeInscription";
import Forgottenpassword from "./page/forgottenpassword";
import ListRessources, {loader as GetDefaultList} from "./page/Ressource/listRessources";
import PageRessource from "./page/Ressource/pageRessource";
import Admin from "./page/Administration/RootAdmin";
import AdminDashboard, {loader as AdminDashboardLoader} from "./page/Administration/DashboardAdmin";
import GestionAdmin from "./page/Administration/Gestion/GestionAdmin";
import ListFavorie from "./composants/Dashboard/ListTypeProgression";
import Dashboard from "./page/DashBoardUser/Dashboard";
import ModifierRessource from "./page/Ressource/modifierRessource"; // Importez le composant pour la modification de la ressource

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Root/>,
            children: [
                {
                    path: '/ressource/ajout',
                    element: <AjoutRessource/>,
                    loader: AjoutLoader
                },
                {
                    path: '/verifCode/:id/:code/:tokenVerif',
                    element: <VerifCodeInscription/>,
                },
                {
                    path: '/',
                    element: <ListRessources/>,
                    loader: GetDefaultList
                },
                {
                    path: '/DashBoard',
                    element: <Dashboard/>,
                    loader: AjoutLoader
                },
                {
                    path: '/modifressource/:id', // Chemin pour modifier une ressource
                    element: <ModifierRessource/>,
                }, // Définition de la route pour modifier une ressource
                {
                    path: 'ressources/:slug',
                    element: <PageRessource/>
                },
                {
                    path: '/admin',
                    element: <Admin/>,
                    children: [
                        {
                            path: '/admin/dashboard',
                            element: <AdminDashboard/>,
                            loader: AdminDashboardLoader
                        },
                        {
                            path: '/admin/gestion',
                            element: <GestionAdmin/>
                        }
                    ]
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
        },
        {
            path: '/passwordReset',
            element: <Forgottenpassword/>,
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
