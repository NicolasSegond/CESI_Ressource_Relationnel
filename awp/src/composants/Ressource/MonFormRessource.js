// MyForm.js
import React, {useState} from "react";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {Form} from 'react-router-dom';
import {SelectChangeEvent} from "@mui/material";
const MyForm = ({ onChange, onSubmit, buttonText, buttonDisabled }) => {
    const [visibilite, setVisibilite] = useState('');

    const handleVisibiliteChange = (event) => {
        setVisibilite(event.target.value);
    };

    return (
        <Form onSubmit={onSubmit}>
            <div className={"ajout-form-container"}>
                <div className={"partie-gauche"}>
                    <p className={"titre-label"}>Titre de la ressource : </p>
                    <TextField type={"text"} name={"titre"} label={"Saississez le titre de la ressource"} value={""} onChange={onChange} className={"textfield"}/>
                </div>
                <div className={"partie-droite"}>
                    <div className={"partie-options"}>
                        <p className={"partie-options-label"}> Options de la ressource : </p>
                        <div className={"partie-options-select"}>
                            <p className={"select-label"}> Visibilité de la ressource : </p>
                            <FormControl>
                                <InputLabel id="demo-simple-select-helper-label"> Visibilité </InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="Visibilité *"
                                    value={visibilite}
                                    onChange={handleVisibiliteChange}
                                >
                                    <MenuItem value={10}>Public</MenuItem>
                                    <MenuItem value={20}>Privé</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <p className={"helper"}>Required</p>
                        <p className={"categorie-label"}> Catégories de la ressource : </p>
                    </div>
                    <button type="submit" className={"button-submit"} disabled={buttonDisabled}>{buttonText}</button>
                </div>
            </div>
        </Form>
    );
};

export default MyForm;

