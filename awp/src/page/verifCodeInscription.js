import React, { useEffect, useState } from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {Alert, Grid} from "@mui/material";
import MenuSideBar from "../composants/Menu/MenuSideBar";
import MenuNavBar from "../composants/Menu/MenuNavBar";
import Footer from "../composants/Footer/footer";
import CheckIcon from "@mui/icons-material/Check";

const VerifCodeInscription = () => {
            const { id, code } = useParams();
            const [alertType, setAlertType] = useState(null);
            const [data, setData] = useState(null);
            const [isOpen, setIsOpen] = React.useState(false);
            const [hasFetched, setHasFetched] = useState(false); // Nouvel état

            const toggleSidebar = () => {
                setIsOpen(!isOpen);
            };

            useEffect(() => {
                const fetchData = async () => {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/api/verif/${id}/${code}`);

                        if (response.status === 406)
                            setAlertType(3);
                        else if (response.status === 200)
                            setAlertType(0);
                        else
                            setAlertType(1);

                    } catch (error) {
                        console.error('Erreur lors de la récupération des données:', error);
                        setAlertType(2);
                    }
                };

                if (id && code) {
                    fetchData();
                }
            }, [id, code]); // Exécutez l'effet uniquement lorsque id ou code changent

    return (
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
                {alertType === 0 && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Compte vérifier avec succé! Redirection à la page de connection!
                    </Alert>
                )}
                {alertType === 1 && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="warning">
                        Inscription non vérifier! En cas de souci contacter le support!
                    </Alert>
                )}
                {alertType === 2 && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
                        Inscription non vérifier! En cas de souci contacter le support!
                    </Alert>
                )}
                {alertType === 3 && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="info">
                        L'inscription à déjà était vérifier!
                    </Alert>
                )}
                <Footer/>
            </Grid>
        </Grid>
    );
}

export default VerifCodeInscription;