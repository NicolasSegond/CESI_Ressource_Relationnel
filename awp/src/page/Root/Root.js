// Root.js
import {Grid} from "@mui/material";
import {Outlet} from "react-router-dom";
import MenuNavBar from "../../composants/Menu/MenuNavBar";
import MenuSideBar from "../../composants/Menu/MenuSideBar";
import "../../composants/Menu/MenuStyle.css";
import * as React from "react";
import "../../composants/Footer/Footer.css";
import Footer from "../../composants/Footer/footer";
import {getTokenDisconnected} from "../../utils/authentification";

const Root = (roles) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const token = getTokenDisconnected();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        console.log("isOpen", isOpen)
    };

    console.log("roles", roles);

    return (
        <Grid container spacing={1} width={"100vw"} className={"grid-container"}>
            {/* Barre latérale à gauche */}
            <Grid item xl={isOpen ? 2 : 0} lg={isOpen ? 3 : 0} md={isOpen ? 4 : 0}
                  className={`sidebar-grid  ${isOpen ? "opened" : "closed"}`}>
                <MenuSideBar isOpen={isOpen} toggleSidebar={toggleSidebar} token={token} rolesUser={roles}/>
            </Grid>

            {/* Barre de navigation en haut */}
            <Grid item xl={isOpen ? 10 : 12} lg={isOpen ? 9 : 12} md={isOpen ? 8 : 12} sm={12} xs={12}
                  style={{marginLeft: isOpen ? '330px' : '0'}} className={"navbar-grid"}>
                <MenuNavBar toggleSidebar={toggleSidebar} token={token}/>
            </Grid>

            {/* Contenu principal */}
            <Grid item xl={isOpen ? 10 : 12} lg={isOpen ? 9 : 12} md={isOpen ? 8 : 12} sm={12} xs={12}
                  style={{marginLeft: isOpen ? '330px' : '0'}} className={"main-grid"}>

                <main style={{padding: '10px 0'}}>
                    <Outlet/>
                </main>
                <Footer/>
            </Grid>
        </Grid>
    );
};

export default Root;
