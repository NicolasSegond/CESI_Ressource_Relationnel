import React, {useEffect, useState} from "react";
import Logo from "../../assets/logo.png";
import {Link} from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloseIcon from '@mui/icons-material/Close';
import './MenuStyle.css';
import {getIdUser, getRolesUser} from "../../utils/authentification";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonIcon from '@mui/icons-material/Person';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const SideBar = ({isOpen, toggleSidebar, token}) => {
    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                const userID = getIdUser(token);
                const rolesUser = await getRolesUser(userID);
                setUserRoles(rolesUser);
            }
        };

        fetchData();

    }, [token]);


    const menuItems = [
        {
            icon: <DashboardIcon className={"icon"}/>,
            texte: "Tableau de bord",
            chemin: "/inscription",
            tokenNecessaire: true
        },
        {icon: <LibraryBooksIcon className={"icon"}/>, texte: "Catalogue des ressources", chemin: "/"},
        {icon: <StarIcon className={"icon"}/>, texte: "Favoris", chemin: "/inscription", tokenNecessaire: true},
        {
            icon: <AdminPanelSettingsIcon className={"icon"}/>,
            texte: "Administration Dashboard",
            chemin: "/admin/dashboard",
            tokenNecessaire: true,
            estAdmin: true
        },
        {
            icon: <SupervisorAccountIcon className={"icon"}/>,
            texte: "Administration Gestions",
            chemin: "/admin/gestion",
            tokenNecessaire: true,
            estAdmin: true
        },
        {
            icon: <ExitToAppIcon className={"icon"}/>,
            texte: "Déconnexion",
            chemin: "/deconnexion",
            tokenNecessaire: true
        },
    ];

    return (
        <>
            <div className="sidebar-container">
                {isOpen && <CloseIcon onClick={toggleSidebar} className="fermeture_croix"/>}
                <img src={Logo} alt="logo" className="logo"/>
                {menuItems.map((item, index) => (
                    (item.tokenNecessaire && !token) ||
                    (item.estAdmin && (!userRoles || !userRoles.includes("ROLE_ADMIN"))) ||
                    (item.userRole && (!userRoles || !userRoles.includes(item.userRole))) ? null :
                        <Link key={index} to={item.chemin} className="lien-menuSideBar">
                            {item.icon}
                            {item.texte}
                        </Link>
                ))}
                {!token && (
                    <>
                        <Link to="/connexion" className="lien-menuSideBar">
                            <PersonIcon/>
                            Connexion
                        </Link>
                        <Link to="/inscription" className="lien-menuSideBar">
                            <HowToRegIcon/>
                            Inscription
                        </Link>
                    </>
                )}
            </div>
        </>
    );
};

export default SideBar;
