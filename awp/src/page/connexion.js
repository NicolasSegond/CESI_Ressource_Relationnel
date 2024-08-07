import React, { useRef, useState } from "react";
import MyForm from "../composants/MyForm";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material"; // Importez le composant d'alerte de MUI
import CheckIcon from '@mui/icons-material/Check'; // Importez l'icône de confirmation
import "./Inscription/inscriptionDesign.css";
import apiConfig from "../utils/config";

const Connexion = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [formData, setFormData] = useState([
        { label: "Email", type: "email", name: "email", ref: emailRef },
        { label: "Mot de passe", type: "password", name: "motDePasse", ref: passwordRef },
        { label: "pseudo", type: 'text', name: 'pseudo', visibility: true}
    ]);
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState(null); // State pour le message d'alerte
    const [alertSeverity, setAlertSeverity] = useState("error"); // State pour la gravité de l'alerte

    const isValidPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{13,}$/;
        return regex.test(password);
    };

    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const motDePasse = passwordRef.current.value;

        if (!isValidPassword(motDePasse)) {
            setAlertSeverity("error"); // Définir la gravité de l'alerte sur "error"
            setAlertMessage("Le mot de passe doit contenir au moins 13 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.");
            return;
        }

        const email = emailRef.current.value;

        if (!isValidEmail(email)) {
            setAlertSeverity("error"); // Définir la gravité de l'alerte sur "error"
            setAlertMessage("L'adresse e-mail doit suivre le format standard avec une partie locale, un '@', suivi d'un nom de domaine. Exemple : utilisateur@domaine.com");
            return;
        }

        const body = JSON.stringify({
            email: email,
            password: motDePasse,
        });

        fetch(`${apiConfig.apiUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        })
            .then(response => {
                if (!response.ok) {
                    return response.text(); // Récupérer le contenu texte de la réponse
                }
                return response.json();
            })
            .then(data => {
                if (typeof data === 'string') { // Vérifier si la réponse est une chaîne de caractères (HTML)
                    const parser = new DOMParser();
                    const htmlDocument = parser.parseFromString(data, 'text/html');
                    const detailElement = htmlDocument.querySelector('title'); // Adapter ce sélecteur en fonction de votre structure HTML
                    if (detailElement) {
                        setAlertSeverity("warning"); // Définir la gravité de l'alerte sur "warning"
                        setAlertMessage(detailElement.textContent.trim()); // Afficher le détail de l'erreur
                    } else {
                        throw new Error('Erreur inattendue'); // Gérer l'erreur si le détail n'est pas trouvé
                    }
                } else {
                    sessionStorage.setItem('token', JSON.stringify(data));
                    navigate('/');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                // Gérer ici l'erreur
            });
    };

    return (
        <div className={"container"}>
            <div className={"filigranes-container"}>
                <img src={"./filigranes.png"} className={"filigranes"} alt={"Filigranes"} />
            </div>
            <div className={"left-div"}>
                <div className={"form-container"}>
                    <img className={"logo"} src={"./logo.png"} alt={"Logo Du site internet"}/>
                    <div className={"title"}>Se Connecter</div>
                    <MyForm
                        formData={formData}
                        onSubmit={handleSubmit}
                        buttonText="Se connecter"
                    />
                    {/* Affichage de l'alerte */}
                    <br/>
                    {alertMessage && (
                        <Alert severity={alertSeverity} onClose={() => setAlertMessage(null)}>{alertMessage}</Alert>
                    )}
                </div>
                <br/>
                <p className={"pasDeCompte"}><Link to="/passwordReset">Mot de passe Oublié ?</Link></p>
                <br />
                <p className={"pasDeCompte"}>Vous n’avez pas de compte ? <Link to="/inscription">Inscrivez-vous</Link></p>
            </div>
            <div className={"right-div"}>
                <img src={"./imageADroite.jpg"} alt={"image représentation"} />
            </div>
        </div>
    );
};

export default Connexion;
