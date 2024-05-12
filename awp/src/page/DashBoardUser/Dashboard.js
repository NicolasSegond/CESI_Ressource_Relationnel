import React from 'react';
import ListTypeProgression from "../../composants/Dashboard/ListTypeProgression";

function Dashboard() {
    const titleLeft = "Favorie";
    const idLeft = 1; // Exemple d'ID
    const titleRight = "Mise de côté";
    const idRight = 2; // Exemple d'ID

    const containerStyle = {
        textAlign: 'center',
    };

    const listContainerStyle = {
        display: 'inline-block',
        marginRight: '20px', // Espace entre les deux composants
        verticalAlign: 'top', // Aligner les composants en haut
    };

    return (
        <div style={containerStyle}>
            <h2>Dashboard</h2>
            <br />
            <div style={{marginLeft: '20px'}}>
                <div>
                    <div style={listContainerStyle}>
                        <ListTypeProgression title={titleLeft} id={idLeft} />
                    </div>
                    <div style={listContainerStyle}>
                        <ListTypeProgression title={titleRight} id={idRight} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
