import React, {useEffect, useRef, useState} from 'react';
import {redirect, useLoaderData, useNavigate, useParams} from 'react-router-dom';
import styles from '../Utilisateur/profilPage.module.css';
import {customFetch} from '../../utils/customFetch';
import apiConfig from '../../utils/config';
import {getIdUser, getTokenDisconnected} from "../../utils/authentification";
import CustomAlert from "../../composants/CustomAlert";

const ProfilePage = () => {
    const { id } = useParams();
    const {donnees} = useLoaderData();
    const navigate = useNavigate();

    const prenomRef = useRef(donnees.prenom);
    const nomRef = useRef(donnees.nom);
    const passwordRef = useRef('');
    const confirmPasswordRef = useRef('');

    const [severity, setSeverity] = useState('');
    const [message, setMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = getTokenDisconnected();
            if (!token) {
                navigate('/connexion');
            }

            const userID = getIdUser(token);

            console.log(userID, donnees.id);

            if(userID !== donnees.id) {
                navigate('/connexion');
            }

        };

        fetchData();
    }, []);



    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{13,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const prenom = prenomRef.current.value;
        const nom = nomRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (password !== '' && !regexPass.test(password)) {
            setSeverity('error');
            setMessage('Le mot de passe doit contenir au moins 13 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial!');
            setAlertOpen(true);
            return;
        }

        if (password !== confirmPassword) {
            setSeverity('error');
            setMessage('Les mots de passe ne correspondent pas!');
            setAlertOpen(true);
        }

        // Créer l'objet de données à envoyer
        const updatedData = {
            prenom: prenom,
            nom: nom
        };

        // Ajouter le mot de passe à l'objet si le champ n'est pas vide
        if (password !== '') {
            updatedData.password = password;
        }

        // Envoyer les données mises à jour à l'API
        const {data, error} = await customFetch({
            url: `${apiConfig.apiUrl}/api/utilisateurs/${id}`,
            method: 'PATCH',
            headers: {'Content-Type': 'application/merge-patch+json'},
            body: JSON.stringify({
                ...updatedData,
            }),
        }, true);

        if (error) {
            setSeverity('error');
            setMessage('Une erreur est survenue lors de la mise à jour du profil!');
            setAlertOpen(true);
        } else {
            setSeverity('success');
            setMessage('Profil mis à jour avec succès!');
            setAlertOpen(true);
        }
    };

    const getInitials = (prenom, nom) => {
        return `${prenom.charAt(0).toUpperCase()}${nom.charAt(0).toUpperCase()}`;
    };

    const handleCloseAlert = () => {
        setSeverity('');
        setMessage('');
        setAlertOpen(false);
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.avatar}>
                {getInitials(donnees.prenom, donnees.nom)}
            </div>
            <div className={styles.userInfo}>
                <h2>{donnees.prenom} {donnees.nom}</h2>
                <p>{donnees.email}</p>
                <p>Rôles: {donnees.roles.join(', ')}</p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="prenom"
                    defaultValue={donnees.prenom}
                    ref={prenomRef}
                    placeholder="Prénom"
                    className={styles.input}
                />
                <input
                    type="text"
                    name="nom"
                    defaultValue={donnees.nom}
                    ref={nomRef}
                    placeholder="Nom"
                    className={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    ref={passwordRef}
                    placeholder="Mot de passe"
                    className={styles.input}
                />
                <input
                    type="password"
                    ref={confirmPasswordRef}
                    placeholder="Confirmez le mot de passe"
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Mettre à jour</button>
            </form>
            <CustomAlert open={alertOpen} handleClose={handleCloseAlert} severity={severity} message={message}/>
        </div>
    );
};

export default ProfilePage;

export async function loader({ params }) {
    const { id } = params;

    let { data, error } = await customFetch({
        url: `${apiConfig.apiUrl}/api/utilisateurs/${id}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }, true);

    if (error && error.message && error.message.includes('DECONNEXION NECCESSAIRE')) {
        return redirect('/connexion');
    }

    return {
        donnees: data,
    };
}
