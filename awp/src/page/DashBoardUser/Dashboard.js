import React from 'react';
import ListTypeProgression from "../../composants/Dashboard/ListTypeProgression";
import ListStatutRessource from "../../composants/Dashboard/ListStatutRessource";
import {getIdUser, getToken, getTokenDisconnected} from "../../utils/authentification";

function Dashboard() {
    const titleLeft = "Favoris";
    const idLeft = 1;
    const titleRight = "Mises de côté";
    const idRight = 2;
    const idStatut = 2;
    const titleStatut = "Vos ressources";
    const UserConnect = getIdUser(getTokenDisconnected());
    console.log(UserConnect);
    const containerStyle = {
        textAlign: 'center',
        backgroundColor: '#f2f2f2', // Couleur de fond de la page
        padding: '20px', // Espacement intérieur
    };

    const listContainerStyle = {
        display: 'inline-block',
        marginRight: '20px',
        verticalAlign: 'top',
    };

    return (
        <div style={containerStyle}>
            <h1>Dashboard</h1>
            <br/>
            <div style={{marginLeft: '20px', marginTop: '20px'}}>

                <div style={listContainerStyle}>
                    <ListStatutRessource title={titleStatut} ownerId={UserConnect} statusId={idStatut}/>
                </div>
            </div>
            <div style={{marginLeft: '20px', marginTop: '20px'}}>
                <div>
                    <div style={listContainerStyle}>
                        <ListTypeProgression title={titleLeft} id={idLeft}/>
                    </div>
                    <div style={listContainerStyle}>
                        <ListTypeProgression title={titleRight} id={idRight}/>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
