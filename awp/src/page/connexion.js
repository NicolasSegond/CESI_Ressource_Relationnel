// Connexion.js
import React, { useState } from "react";
import MyForm from "../composants/MyForm";
import {Link,useNavigate} from "react-router-dom";
import "./Inscription/inscriptionDesign.css";


const Connexion = () => {
    const [formData, setFormData] = useState([
        { label: "Email", type: "email", name: "email", value: "" },
        { label: "Mot de passe", type: "password", name: "motDePasse", value: "" },
    ]);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = formData.map((field) => {
            if (field.name === name) {
                if (name === "motDePasse") {
                    setIsPasswordValid(isValidPassword(value));
                }
                return { ...field, value };
            }
            return field;
        });
        setFormData(newFormData);
    };

    const isValidPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{13,}$/;
        return regex.test(password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const motDePasse = formData.find(field => field.name === "motDePasse").value;

        if (!isValidPassword(motDePasse)) {
            alert("Le mot de passe doit contenir au moins 13 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.");
            return;
        }

        const email = formData.find(field => field.name === "email").value;
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
                sessionStorage.setItem('token', data.token); // Stocke le token dans le session storage
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
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        buttonText="Se connecter"
                        buttonDisabled={!isPasswordValid}
                    />
                </div>
                <p className={"pasDeCompte"}> <Link to="/connexion">Mot de passe Oublié ?</Link></p>
            </div>
            <div className={"right-div"}>
                <img src={"./imageADroite.jpg"}/>
            </div>
        </div>
)
    ;
};

export default Connexion;
