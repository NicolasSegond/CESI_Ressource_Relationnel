    // MenuSideBar.js
    import * as React from "react";
    import Logo from "../../assets/logo.png";
    import { Link } from "react-router-dom";
    import IosShareIcon from '@mui/icons-material/IosShare';
    import StarIcon from '@mui/icons-material/Star';
    import DashboardIcon from '@mui/icons-material/Dashboard';
    import CloseIcon from '@mui/icons-material/Close';
    import './MenuStyle.css';
    import {getRolesUser, getToken} from "../../utils/authentification";
    import HowToRegIcon from '@mui/icons-material/HowToReg';
    import PersonIcon from '@mui/icons-material/Person';
    import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

    const SideBar = ({ isOpen, toggleSidebar }) => {
        const token = getToken();
        const roles = token ? getRolesUser(token) : [];

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
                        {roles.includes("ROLE_ADMIN") && <Link to="/inscription" className="lien-menuSideBar"><IosShareIcon className="icon"/> Administration</Link>}
                    </>
                )}
                {!token && <Link to="/connexion" className="lien-menuSideBar"><PersonIcon className="icon"/> Connexion</Link>}
                {!token && <Link to="/inscription" className="lien-menuSideBar"><HowToRegIcon className="icon"/> Inscription</Link>}
            </div>
        );
    };

    export default SideBar;
