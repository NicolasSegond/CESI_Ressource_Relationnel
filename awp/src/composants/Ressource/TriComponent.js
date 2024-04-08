import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const TriComponent = ({ label, onChangeTri, categories }) => {
    const handleTriChange = (e) => {
        const { value } = e.target;
        if (value !== undefined) {
            onChangeTri(value); // Envoyer seulement l'ID sélectionné
        }
    };

    const getLabelProperty = (category) => {
        // Déterminez quelle propriété utiliser pour le libellé en fonction de la source des données
        return category.nom !== undefined ? category.nom : category.libelle;
    };

    return (
            <Box sx={{ width: '100%', maxWidth: 200}}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={label}
                    onChange={handleTriChange}
                    defaultValue=""
                >
                    {/* Ajoutez une option vide */}
                    <MenuItem value="">Aucun</MenuItem>
                    {/* Mappez les autres options */}
                    {categories && categories.map((category, index) => (
                        <MenuItem key={index} value={category.id}>{getLabelProperty(category)}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default TriComponent;
