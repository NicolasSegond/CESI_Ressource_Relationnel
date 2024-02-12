import React from "react";
import Connexion from "./page/connexion";
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Inscription from "./page/Inscription/inscription";
import Root from "./page/Root/Root";

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Root/>,
            children: [],
        },
        {
            path: '/inscription',
            element: <Inscription/>,
        },
        {
            path: '/inscription',
            element: <Inscription/>,
        },
        {
            path: '/connexion',
            element: <Connexion/>,
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
