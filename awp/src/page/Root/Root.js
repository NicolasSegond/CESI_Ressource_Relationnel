// Root.js
import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import MenuNavBar from "../../composants/Menu/MenuNavBar";
import MenuSideBar from "../../composants/Menu/MenuSideBar";
import "../../composants/Menu/MenuStyle.css";
import * as React from "react";
import "../../composants/Footer/Footer.css";
import Footer from "../../composants/Footer/footer";


const Root = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

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

                <main style={{margin: 5}}>
                    <Outlet/>
                    <div style={{height: '2000px'}}>
                        <h1>Contenu de test</h1>
                        <p>Ce contenu est ajouté pour tester le positionnement fixed.</p>
                    </div>
                </main>
                <Footer/>
            </Grid>
        </Grid>
    );
};

export default Root;
