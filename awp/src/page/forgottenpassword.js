import React, {useRef, useState} from "react";
import MyForm from "../composants/MyForm";
import {Link} from "react-router-dom";
import "./Inscription/inscriptionDesign.css";

const Forgottenpassword = () => {
    const emailRef = useRef()
    const [formData, setFormData] = useState([
        { label: "Email", type: "email", name: "email", ref: emailRef },
    ]);

    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        if (!isValidEmail(email)) {
            alert("L'adresse e-mail doit suivre le format standard avec une partie locale, un '@', suivi d'un nom de domaine. Exemple : utilisateur@domaine.com");
            return;
        }

    }

    return (
        <div className={"container"}>
            <div className={"filigranes-container"}>
                <img src={"./filigranes.png"} className={"filigranes"} alt={"Filigranes"}/>
            </div>
            <div className={"left-div"}>
                <div className={"form-container"}>
                    <img className={"logo"} src={"./logo.png"} alt={"Logo Du site internet"}/>
                    <div className={"title"}>Problèmes de connexion ?</div>
                    <br/>
                    <p className={"pasDeCompte"}>Entrez votre adresse e-mail et </p>
                    <p>nous vous enverrons un lien <br/>pour récupérer votre compte.</p>
                    <br/>
                    <MyForm
                        formData={formData}
                        onSubmit={handleSubmit}
                        buttonText="Envoyer"
                    />
                </div>
                <br/>
                <p className={"pasDeCompte"}><Link to="/inscription">Créer un compte</Link></p>
                <br/>
                <p className={"pasDeCompte"}><Link to="/connexion">Revenir à l'écran de connexion</Link></p>
            </div>
            <div className={"right-div"}>
                <img src={"./imageADroite.jpg"} alt={"image représentation"}/>
            </div>
        </div>
    )
        ;
}
export default Forgottenpassword;