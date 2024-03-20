import React, {useState} from 'react';
import { Alert } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

const CustomAlert = ({ alertType, message,severity }) => {

    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false); // Met à jour l'état pour fermer l'alerte lorsque l'utilisateur clique sur l'icône de fermeture
    };

    return (
        <>
            {alertType != null && open && ( // Afficher l'alerte uniquement si alertType est défini et open est true
                <Alert icon={<CheckIcon fontSize="inherit" />} onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            )}
        </>
    );
};

export default CustomAlert;
