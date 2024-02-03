import React from "react";
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Inscription from "./page/Inscription/inscription";

function App() {
  const router = createBrowserRouter([
    {
      path: '/inscription',
      element: <Inscription/>,
    },
  ]);
  return (
      <div>
        <RouterProvider router={router}>
        </RouterProvider>
      </div>
  );
}


export default App;
