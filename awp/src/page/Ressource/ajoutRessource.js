
import React from 'react';
import MonFormRessource from '../../composants/Ressource/MonFormRessource';
import './formRessource.css';

const handleChange = (e) => {

}

const handleSubmit = (e) => {

}



const AjoutRessource = () => {
    return (
        <MonFormRessource
            onChange={handleChange}
            onSubmit={handleSubmit}
            buttonText={"Ajouter la ressource"}
        />
    );
}

export default AjoutRessource;