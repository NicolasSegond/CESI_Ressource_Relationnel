import React, {useEffect, useMemo, useState} from 'react';
import {Outlet, useParams, useNavigate} from 'react-router-dom';
import {Alert, Grid} from "@mui/material";
import MenuSideBar from "../composants/Menu/MenuSideBar";
import MenuNavBar from "../composants/Menu/MenuNavBar";
import Footer from "../composants/Footer/footer";
import CheckIcon from "@mui/icons-material/Check";
import CustomAlert from "../composants/CustomAlert";
import apiConfig from "../utils/config";


const VerifCodeInscription = () => {
    const { id, code,tokenVerif } = useParams();
    const [alertType, setAlertType] = useState(null);
    const [message, setMessage] = useState(null);
    const [severity, setSeverity] = useState(null);
    const [data, setData] = useState(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate()


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const fetchData = async () => {
        try {
            const response = await fetch(`${apiConfig.apiUrl}/api/verif/${id}/${code}/${tokenVerif}`);
            if (response.status === 200)
            {
                setAlertType(0);
                setSeverity('success')
                setMessage("Validation réussi! Redirection Connect!")
                setTimeout(() => {
                    navigate('/connexion')
                }, 3000)

            }
            else if (response.status === 406) {
                setAlertType(3);
                setSeverity('info')
                setMessage("Compte déjà vérifier!")
                setTimeout(() => {
                    navigate('/connexion')
                }, 3000)
            }
            else{
                setAlertType(1);
                setSeverity('warning')
                setMessage("Oups, Problème survenu Utilisateur introuvable")
                setTimeout(() => {
                    navigate('/inscription')
                }, 3000)
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            setAlertType(2);
            setSeverity('error')
            setMessage("Inscription non vérifiée! En cas de souci contacter le support!")
            setTimeout(() => {
                navigate('/')
            }, 3000)
        }
    };

    useEffect(() => {
        if (id && code) {
            fetchData();
        }
    }, [id, code]);

    return (
        <>
        <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '25%',
            zIndex: 10000,
        }}>
            <CustomAlert  alertType={alertType}  message={message} severity={severity}/>
        </div>
            <Grid container spacing={1} width={"100vw"} className={"grid-container"}>
                {/* Barre latérale à gauche */}
                <Grid item xl={2} lg={3} md={4} className={`sidebar-grid  ${isOpen ? "opened" : "closed"}`}>
                    <MenuSideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
                </Grid>

                {/* Barre de navigation en haut */}
                <Grid item xl={10} lg={9} md={8} sm={12} xs={12} className={"navbar-grid"}>
                    <MenuNavBar toggleSidebar={toggleSidebar} />
                </Grid>

                {/* Contenu principal */}
                <Grid item xl={10} lg={9} md={8} sm={12} xs={12} className={"main-grid"}>

                </Grid>
            </Grid>
        </>
    );
};
export default VerifCodeInscription;