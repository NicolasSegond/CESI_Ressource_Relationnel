import React, {useEffect, useState} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import CustomAlert from "../composants/CustomAlert";


const VerifCodeInscription = () => {
    const { id, code } = useParams();
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [severity, setSeverity] = useState(null);

    const handleCloseAlert = () => {
        setAlertOpen(false);
    }
    const fetchData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/verif/${id}/${code}`);
            if (response.status === 200)
            {
                setAlertOpen(true);
                setSeverity('success');
                setMessage("Validation réussi! Redirection Connect!");
            }
            else if (response.status === 406) {
                setAlertOpen(true);
                setSeverity('info');
                setMessage("Compte déjà vérifier!");
            }
            else{
                setAlertOpen(true);
                setSeverity('warning');
                setMessage("Oups, Problème survenu Utilisateur introuvable");
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            setSeverity('error')
            setMessage("Inscription non vérifiée! En cas de souci contacter le support!")
        }
    };

    useEffect(() => {
        if (id && code) {
            fetchData();
        }
    }, [id, code]);

    return (
        <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '25%',
            zIndex: 10000,
        }}>
            <CustomAlert open={alertOpen} handleClose={handleCloseAlert} message={message} severity={severity}/>
        </div>
    );
};
export default VerifCodeInscription;