import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import IosShareIcon from '@mui/icons-material/IosShare';
import StarIcon from '@mui/icons-material/Star';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloseIcon from '@mui/icons-material/Close';
import './MenuStyle.css';
import { getRolesUser, getToken } from "../../utils/authentification";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonIcon from '@mui/icons-material/Person';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const SideBar = ({ isOpen, toggleSidebar }) => {
    const [userRoles, setUserRoles] = useState([]);
    const token = getToken();

    useEffect(() => {
        if (token) {
            const roles = getRolesUser(token.token);
            setUserRoles(roles);
        }
    }, [token]);

    return (
        <div className="sidebar-container">
            {isOpen && <CloseIcon onClick={toggleSidebar} className="fermeture_croix"/>}
            <img src={Logo} alt="logo" className="logo"/>
            {token && <Link to="/inscription" className="lien-menuSideBar"><DashboardIcon className="icon"/> Tableau de bord</Link>}
            <Link to="/inscription" className="lien-menuSideBar"><LibraryBooksIcon className="icon"/> Catalogue des ressources</Link>
            {token && (
                <>
                    <Link to="/inscription" className="lien-menuSideBar"><IosShareIcon className="icon"/> Fichiers partagés</Link>
                    <Link to="/inscription" className="lien-menuSideBar"><StarIcon className="icon"/> Favoris</Link>
                    {userRoles.includes("ROLE_ADMIN") && <Link to="/inscription" className="lien-menuSideBar"><IosShareIcon className="icon"/> Administration</Link>}
                </>
            )}
            {!token && <Link to="/connexion" className="lien-menuSideBar"><PersonIcon className="icon"/> Connexion</Link>}
            {!token && <Link to="/inscription" className="lien-menuSideBar"><HowToRegIcon className="icon"/> Inscription</Link>}
            {/* Affichage dynamique des éléments de menu en fonction du rôle de l'utilisateur */}
            {userRoles.includes("ROLE_USER") && (
                <Link to="/profile" className="lien-menuSideBar"><PersonIcon className="icon"/> Mon Profil</Link>
            )}
            {userRoles.includes("ROLE_MANAGER") && (
                <Link to="/manager" className="lien-menuSideBar"><DashboardIcon className="icon"/> Manager Dashboard</Link>
            )}
        </div>
    );
};

export default SideBar;
