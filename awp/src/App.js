import React from "react";
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Inscription from "./page/inscription";
import Root from "./page/Root/Root";

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Root/>,
            children: [

            ],
        },
        {
            path: '/inscription',
            element: <Inscription/>,
        },
    ]);
    return (
        <div id={"container-root"}>
            <RouterProvider router={router}>
            </RouterProvider>
        </div>
    );
}


export default App;
