// Inscription.js
import React, { useRef, useState } from "react";
import MyForm from "../../composants/MyForm";
import { Link } from 'react-router-dom';
import "./inscriptionDesign.css";
import { Alert } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
const Inscription = () => {
    const nomRef = useRef();
    const prenomRef = useRef();
    const emailRef = useRef();
    const motDePasseRef = useRef();
    const motDePasseControlRef = useRef();
    const [formData, setFormData] = useState([
        { type: "text", name: "nom", label: "Nom", ref: nomRef },
        { type: "text", name: "prenom", label: "Prénom", ref: prenomRef },
        { type: "email", name: "email", label: "Email", ref: emailRef },
        { type: "password", name: "motDePasse", label: "Mot de Passe", ref: motDePasseRef },
        { type: "password", name: "motDePasseControl", label: "Confirmer Mot de Passe", ref: motDePasseControlRef }
    ]);

    const [alertType, setAlertType] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Contrôles de saisie côté front-end
        const nom = nomRef.current.value;
        const prenom = prenomRef.current.value;
        const email = emailRef.current.value;
        const motDePasse = motDePasseRef.current.value;
        const motDePasseControl = motDePasseControlRef.current.value;

        const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{13,}$/;
        if (motDePasse !== motDePasseControl) {
            // Les mots de passe ne correspondent pas
            setAlertType(3)
            return;
        }
        if (!regexPass.test(motDePasse)) {
            setAlertType(4)
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setAlertType(5)
            return;
        }
        if (nom === "" || prenom === "") {
            setAlertType(6)
            return;
        }
        setAlertType(null)
        // Effectuer la soumission du formulaire
        try {
            // Create an object with the form data
            const formDataObject = {
                email: email,
                nom: nom,
                prenom: prenom,
                password: motDePasse,
                passwordControl: motDePasseControl,
                roles: ["string"],  // You may adjust this as needed
                code: 0,
                tokenVerif: "",
                verif: 0
            };

            const body = JSON.stringify(formDataObject);

            fetch('http://127.0.0.1:8000/api/utilisateurs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json', // Mise à jour du type de contenu ici
                },
                body: body,
            })
                .then(response => {
                    if (!response.ok) {
                        setAlertType(0)
                        throw new Error('Inscription Invalide.');
                    }
                    return response.json();
                })
                .then(data => {
                    setAlertType(1)

                })
                .catch((error) => {
                    console.error('Error:', error);
                    setAlertType(2)

                });


            nomRef.current.value = "";
            prenomRef.current.value = "";
            emailRef.current.value = "";
            motDePasseRef.current.value = "";
            motDePasseControlRef.current.value = "";

            // Reset the form fields
            setFormData([
                { type: "text", name: "nom", label: "Nom", ref: nomRef },
                { type: "text", name: "prenom", label: "Prénom", ref: prenomRef },
                { type: "email", name: "email", label: "Email", ref: emailRef },
                { type: "password", name: "motDePasse", label: "Mot de Passe", ref: motDePasseRef },
                { type: "password", name: "motDePasseControl", label: "Confirmer Mot de Passe", ref: motDePasseControlRef }
            ]);
        } catch (error) {
            alert("API ERROR : contactez un administrateur!");
            console.error("API Error:", error);
        }
    };

    return (
        <div className={"container"}>
            <div className={"filigranes-container"}>
                <img src={"./filigranes.png"} className={"filigranes"} alt={"Filigranes"} />
            </div>
            <div className={"left-div"}>
                <div className={"form-container"}>
                    <img className={"logo"} src={"./logo.png"} alt={"Logo Du site internet"} />
                    <div className={"title"}>S'inscrire</div>
                    <MyForm
                        formData={formData}
                        onSubmit={handleSubmit}
                        buttonText="S'inscrire"
                        buttonDisabled={false}
                    />
                </div>
                <p className={"pasDeCompte"}>Vous avez déjà un compte? <Link to="/connexion">Connectez-vous!</Link></p>
                {alertType === 0 && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="warning">
                        Inscription invalide. Réessayez!
                    </Alert>
                )}
                {alertType === 1 && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Inscription réussite! Confirmer votre mail. Puis connectez-vous!
                    </Alert>
                )}
                {alertType === 2 && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
                        Une erreur est survenue! Réessayez. Sinon contacter le support!
                    </Alert>
                )}
                {alertType === 3 && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="warning">
                        Les mots de passe ne correspondent pas.
                    </Alert>
                )}
                {alertType === 4 && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="warning">
                        Le mot de passe doit contenir au moins 13 caractères, dont une majuscule, <br />une minuscule, un chiffre et un caractère spécial.
                    </Alert>
                )}
                {alertType === 5 && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="warning">
                        Veuillez entrer une adresse e-mail valide.
                    </Alert>
                )}
                {alertType === 6 && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="warning">
                        Veuillez remplir tous les champs!
                    </Alert>
                )}
            </div>
            <div className={"right-div"}>
                <img src={"./imageADroite.jpg"} alt={"image représentation"} />
            </div>
        </div>
    );
};

export default Inscription;
