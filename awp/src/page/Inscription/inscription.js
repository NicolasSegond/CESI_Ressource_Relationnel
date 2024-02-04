import React, { useState } from "react";
import {Button, TextField} from "@mui/material";
import { Link } from 'react-router-dom';
import "./inscriptionDesign.css";
import axios from 'axios';  // Import axios





const Inscription = () => {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create an object with the form data
            const formData = {
                email : email,
                nom: nom,
                prenom: prenom,
                password: motDePasse,
                roles: ["string"],  // You may adjust this as needed
                code: 0,
                verif: true
            };

            // Make a POST request to the API
            const response = await axios.post("http://127.0.0.1:8000/api/utilisateurs", JSON.stringify(formData), {
                headers: {
                    'Content-Type': 'application/ld+json',
                },
            });
            // Log the response from the API
            console.log("API Response:", response.data);

            // Reset the form fields
            setNom("");
            setPrenom("");
            setEmail("");
            setMotDePasse("");
        } catch (error) {
            console.error("API Error:", error);
        }
    };

    return (

        <div className="container">

            <div className="left-div">
                <div className="filigranes-container">
                    <img src={"./filigranes.png"} className="filigranes" alt="Filigranes"/>
                </div>

                <div className="form-container">
                    <img className={"logo"} src={"./logo.png"} alt={"Logo Du site internet"}/>
                    <h1 className={"title"}>S'inscrire</h1>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <TextField id="outlined-basic" label="Nom" variant="outlined" className={"textfield"}
                                       value={nom} onChange={(e) => setNom(e.target.value)}/>
                        </label>
                        <label>
                            <TextField id="outlined-basic" label="Prénom" variant="outlined" className={"textfield"}
                                       value={prenom} onChange={(e) => setPrenom(e.target.value)}/>
                        </label>
                        <label>
                            <TextField id="outlined-basic" label="Email" variant="outlined" className={"textfield"}
                                       value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </label>
                        <label>
                            <TextField id="outlined-basic" label="Mot de Passe" variant="outlined" className={"textfield"}
                                       value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}/>
                        </label>
                        <label>
                            <TextField id="outlined-basic" label="Mot de Passe" variant="outlined" className={"textfield"}
                                       value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}/>
                        </label>
                        <Button type={"submit"} className={"send"} variant="contained">S'inscrire</Button>
                    </form>
                </div>
                <p className={"pasDeCompte"}>Vous avez déjà un compte? <Link to="/connexion">Connectez-vous!</Link></p>
            </div>
            <div className="right-div">
                <img src={"./imageADroite.jpg"}/>
            </div>
        </div>
    );
};

export default Inscription;
