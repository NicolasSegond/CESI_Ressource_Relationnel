import React, { useState } from "react";
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
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nom:
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <label>
                    Mot de passe:
                    <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />
                </label>
                <br />
                <button type="submit">S'inscrire</button>
            </form>
        </div>
    );
};

export default Inscription;
