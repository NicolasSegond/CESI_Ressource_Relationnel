import React, { useState } from "react";
import {Button, TextField} from "@mui/material";
import "./inscriptionDesign.css";
const Inscription = () => {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ajoutez ici la logique pour traiter les informations d'inscription
        // Par exemple, vous pouvez envoyer ces données à un backend pour l'enregistrement.

        console.log("Nom:", nom);
        console.log("Email:", email);
        console.log("Mot de passe:", motDePasse);

        // Réinitialisez les champs après la soumission du formulaire
        setNom("");
        setEmail("");
        setMotDePasse("");
    };

    return (
        <div>

            <img src={"./logo.png"} alt={"Logo Du site internet"}/>
            <h1 className={"title"}>Inscription</h1>
            <form onSubmit={handleSubmit}>

                <label>
                    Nom:
                    <TextField id="outlined-basic" label="Outlined" variant="outlined"/>
                </label>
                <br/>
                <label>
                    Email:
                    <TextField id="outlined-basic" label="Outlined" variant="outlined"/>
                </label>
                <br/>
                <label>
                    Mot de passe:
                    <TextField id="outlined-basic" label="Outlined" variant="outlined"/>
                </label>
                <br/>
                <Button className={"send"} variant="contained">Envoyer</Button>
            </form>
        </div>
    );
};

export default Inscription;
