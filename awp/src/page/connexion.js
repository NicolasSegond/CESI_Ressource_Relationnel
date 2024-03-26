// Connexion.js
import React, {useRef, useState} from "react";
import MyForm from "../composants/MyForm";
import {Link,useNavigate} from "react-router-dom";
import "./Inscription/inscriptionDesign.css";


const Connexion = () => {
    const emailRef = useRef();
    const passwordRef = useRef()
    const [formData, setFormData] = useState([
        { label: "Email", type: "email", name: "email", ref: emailRef },
        { label: "Mot de passe", type: "password", name: "motDePasse", ref: passwordRef },
    ]);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const navigate = useNavigate();

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
            alert("Le mot de passe doit contenir au moins 13 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.");
            return;
        }

        const email = emailRef.current.value;

        if (!isValidEmail(email)) {
            alert("L'adresse e-mail doit suivre le format standard avec une partie locale, un '@', suivi d'un nom de domaine. Exemple : utilisateur@domaine.com");
            return;
        }
        const body = JSON.stringify({
            email: email,
            password: motDePasse,
        });
        fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
                sessionStorage.setItem('token', JSON.stringify(data)); // Stocke le token dans le session storage
                navigate('/'); // Redirige l'utilisateur vers la page souhaitée

                // Gérez ici la réponse de succès
            })
            .catch((error) => {
                console.error('Error:', error);
                // Gérez ici l'erreur
            });
    };

    return (
        <div className={"container"}>
            <div className={"filigranes-container"}>
                <img src={"./filigranes.png"} className={"filigranes"} alt={"Filigranes"}/>
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
                </div>
                <br/>
                <p className={"pasDeCompte"}> <Link to="/passwordReset">Mot de passe Oublié ?</Link></p>
                <br/>
                <p className={"pasDeCompte"}>Vous n’avez pas de compte ? <Link to="/inscription">Inscrivez-vous</Link></p>
            </div>
            <div className={"right-div"}>
                <img src={"./imageADroite.jpg"} alt={"image représentation"}/>
            </div>
        </div>
    )
        ;
};

export default Connexion;