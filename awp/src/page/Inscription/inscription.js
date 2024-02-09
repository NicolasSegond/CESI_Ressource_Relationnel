import React, {useState} from "react";
import {Button, TextField} from "@mui/material";
import {Form, Link} from 'react-router-dom';
import "./inscriptionDesign.css";
import axios from 'axios';  // Import axios


const Inscription = () => {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [motDePasseControl, setMotDePasseControl] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Contrôles de saisie côté front-end
        if (motDePasse !== motDePasseControl) {
            // Les mots de passe ne correspondent pas
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Veuillez entrer une adresse e-mail valide.");
            return;
        }
        if (nom.length === 0 || prenom.length === 0) {
            alert("Veuillez remplir tout les champs!")
            return;
        }

        // Effectuer la soumission du formulaire
        try {
            // Create an object with the form data
            const formData = {
                email: email,
                nom: nom,
                prenom: prenom,
                password: motDePasse,
                passwordControl: motDePasseControl,
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
            setMotDePasseControl("");
        } catch (error) {
            alert("API ERROR : contactez un administrateur!");
            console.error("API Error:", error);
        }
    };

    return (

        <div className={"container"}>
            <div className={"filigranes-container"}>
                <img src={"./filigranes.png"} className={"filigranes"} alt={"Filigranes"}/>
            </div>
            <div className={"left-div"}>
                <div className={"form-container"}>
                    <img className={"logo"} src={"./logo.png"} alt={"Logo Du site internet"}/>
                    <div className={"title"}>S'inscrire</div>
                    <Form className={"form"} onSubmit={handleSubmit}>
                        <TextField id="outlined-basic" label="Nom" variant="outlined" className={"textfield"}
                                   value={nom} margin={"dense"} onChange={(e) => setNom(e.target.value)}/>
                        <TextField id="outlined-basic" label="Prénom" variant="outlined" className={"textfield"}
                                   value={prenom} margin={"dense"} onChange={(e) => setPrenom(e.target.value)}/>
                        <TextField id="outlined-basic" label="Email" variant="outlined" className={"textfield"}
                                   value={email} margin={"dense"} onChange={(e) => setEmail(e.target.value)}/>
                        <TextField id="outlined-basic" label="Mot de Passe" variant="outlined" className={"textfield"}
                                   value={motDePasse} margin={"dense"} onChange={(e) => setMotDePasse(e.target.value)}/>
                        <TextField id="outlined-basic" label="Mot de Passe" variant="outlined" className={"textfield"}
                                   value={motDePasseControl} margin={"dense"} onChange={(e) => setMotDePasseControl(e.target.value)}/>
                        <Button type={"submit"} className={"send"} variant="contained">S'inscrire</Button>
                    </Form>
                </div>
                <p className={"pasDeCompte"}>Vous avez déjà un compte? <Link to="/connexion">Connectez-vous!</Link></p>
            </div>
            <div className={"right-div"}>
                <img src={"./imageADroite.jpg"}/>
            </div>
        </div>
    );
};

export default Inscription;
