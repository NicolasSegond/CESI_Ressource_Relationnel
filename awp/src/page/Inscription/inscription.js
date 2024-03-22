// Inscription.js
import React, { useState } from "react";
import MyForm from "../../composants/MyForm";
import {Link} from 'react-router-dom';
import "./inscriptionDesign.css";

const Inscription = () => {
    const [formData, setFormData] = useState([
        { type: "text", name: "nom", value: "", label: "Nom" },
        { type: "text", name: "prenom", value: "", label: "Prénom" },
        { type: "email", name: "email", value: "", label: "Email" },
        { type: "password", name: "motDePasse", value: "", label: "Mot de Passe" },
        { type: "password", name: "motDePasseControl", value: "", label: "Confirmer Mot de Passe" }
    ]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = formData.map((field) => {
            if (field.name === name) {
                return { ...field, value };
            }
            return field;
        });
        setFormData(newFormData);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Contrôles de saisie côté front-end
        const nom = formData.find(field => field.name === "nom").value;
        const prenom = formData.find(field => field.name === "prenom").value;
        const email = formData.find(field => field.name === "email").value;
        const motDePasse = formData.find(field => field.name === "motDePasse").value;
        const motDePasseControl = formData.find(field => field.name === "motDePasseControl").value;

        const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{13,}$/;
        if (motDePasse !== motDePasseControl) {
            // Les mots de passe ne correspondent pas
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        if(!regexPass.test(motDePasse))
        {
            alert("Le mot de passe doit contenir au moins 13 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Veuillez entrer une adresse e-mail valide.");
            return;
        }
        if (nom === "" || prenom === "") {
            alert("Veuillez remplir tous les champs!");
            return;
        }

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
                verif: true
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
                        alert("Connexion Invalide.");
                        throw new Error('Connexion Invalide.');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                    // Gérer ici la réponse de succès
                    // Par exemple, vous pouvez mettre à jour l'état de votre application ou rediriger l'utilisateur.
                })
                .catch((error) => {
                    console.error('Error:', error);
                    // Gérer ici l'erreur
                    // Par exemple, vous pouvez afficher un message d'erreur à l'utilisateur.
                });




            // Reset the form fields
            setFormData([
                { type: "text", name: "nom", value: "", label: "Nom" },
                { type: "text", name: "prenom", value: "", label: "Prénom" },
                { type: "email", name: "email", value: "", label: "Email" },
                { type: "password", name: "motDePasse", value: "", label: "Mot de Passe" },
                { type: "password", name: "motDePasseControl", value: "", label: "Confirmer Mot de Passe" }
            ]);
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
                    <MyForm
                        formData={formData}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        buttonText="S'inscrire"
                        buttonDisabled={false}
                    />
                </div>
                <p className={"pasDeCompte"}>Vous avez déjà un compte? <Link to="/connexion">Connectez-vous!</Link></p>
            </div>
            <div className={"right-div"}>
                <img src={"./imageADroite.jpg"} alt={"image représentation"}/>
            </div>
        </div>
    );
};

export default Inscription;
