import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const TriComponent = ({ label, onChangeTri, categories, aucunActif,defautSelect }) => {
    const handleTriChange = (e) => {
        const { value } = e.target;
        onChangeTri(value); // Envoyer la valeur sélectionnée
    };

    const isObjectArray = categories.length > 0 && typeof categories[0] === 'object';

    return (
        <Box sx={{ width: '100%', maxWidth: 200 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={label}
                    onChange={handleTriChange}
                    defaultValue={defautSelect ? defautSelect : ''}
                    //value={categories.includes('') ? '' : categories[0]} // Assurez-vous qu'une valeur par défaut valide est fournie
                >
                    {aucunActif && <MenuItem value="">Aucun</MenuItem>}
                    {categories && categories.map((category, index) => (
                        <MenuItem key={index} value={isObjectArray ? category.id : category}>
                            {isObjectArray ? category.nom || category.libelle || category.name : category}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default TriComponent;
