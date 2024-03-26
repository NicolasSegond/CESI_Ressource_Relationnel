import React from 'react';
import { Alert } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

const CustomAlert = ({ open, handleClose, message,severity }) => {
    return (
        <>
            {open && ( // Afficher l'alerte uniquement si open est true
                <Alert sx={{position: 'fixed', top: '20px', zIndex: 999, left: '50%', transform: 'translate(-50%)'}} icon={<CheckIcon fontSize="inherit" />} onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            )}
        </>
    );
};

export default CustomAlert;
