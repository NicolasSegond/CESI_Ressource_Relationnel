// Connexion.js
import React, { useState } from "react";
import MyForm from "../composants/MyForm";

const Connexion = () => {
    const [formData, setFormData] = useState([
        { label: "Email", type: "email", name: "email", value: "" },
        { label: "Mot de passe", type: "password", name: "motDePasse", value: "" },
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
        console.log(body)
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
                console.log('Success:', data);
                localStorage.setItem('token', data.token);
                // Gérez ici la réponse de succès
            })
            .catch((error) => {
                console.error('Error:', error);
                // Gérez ici l'erreur
            });
    };

    return (
        <div>
            <h2>Connexion</h2>
            <MyForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                buttonText="Se connecter"
                buttonDisabled={isValidPassword}
            />
        </div>
    );
};

export default Connexion;
