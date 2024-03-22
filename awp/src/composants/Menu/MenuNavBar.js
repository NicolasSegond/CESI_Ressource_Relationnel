import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Avatar,
    Menu,
    Toolbar,
} from "@mui/material";
import { Box } from "@mui/system";
import {Link, useLocation} from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import LogoMinistere from "../../assets/logoMinistere.png";

function ResponsiveAppBar({ toggleSidebar, token }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const location = useLocation();
    const path = location.pathname;
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getPageTitle = () => {
        switch (path) {
            case '/dashboard':
                return 'Mon tableau de bord';
            default:
                return 'Ressources Relationnelles';
        }
    };

    return (
        <Container maxWidth="auto" className={"navbar"}>
            <Toolbar style={{ padding: 0, margin: 0 }}>
                {windowWidth < 900 && token && token.token && ( // Correction ici, vérifiez si token est défini et s'il a une propriété token
                    <MenuIcon className={"bouton-hamburger"} style={{ fontSize: "40px" }} onClick={toggleSidebar} />
                )}
                <img src={LogoMinistere} alt="logo" className={"logoMinistere"} />
                <div className={"title_container"}>
                    <div className={"title_page"}>{getPageTitle()}</div>
                    <div className={"title_bienvenue"}> Bienvenue</div>
                </div>
                <Box sx={{ flexGrow: 1 }} />
                {token && token.token && (
                    <>
                        <Link to={"/ressource/ajout"} className={"btn_creer"}> + Créer</Link>
                        <Avatar className={"avatar"} onClick={handleClick}><PersonIcon /></Avatar>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <a href={"/"} className={"menu_item"} onClick={handleClose}>Profil</a>
                            <a href={"/"} className={"menu_item"} onClick={handleClose}>Paramètres</a>
                        </Menu>
                    </>
                )}
                {windowWidth < 900 && !token && (
                    <MenuIcon className={"bouton-hamburger"} style={{ fontSize: "40px" }} onClick={toggleSidebar} />
                )}
            </Toolbar>
        </Container>
    );
}

export default ResponsiveAppBar;
