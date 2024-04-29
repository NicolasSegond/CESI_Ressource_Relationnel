import React from 'react';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const CustomModal = ({open, handleClose, handleConfirm, label, title, inputValue, setInputValue}) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            {/* Contenu du modal */}
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <Paper style={{padding: '20px', minWidth: '500px'}}>
                    <h2>{title}</h2>
                    <TextField
                        fullWidth
                        label={label}
                        variant="outlined"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        margin="normal"
                    />
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                        <Button onClick={handleClose} variant="outlined" color="inherit">
                            Cancel
                        </Button>
                        <Button onClick={() => handleConfirm(inputValue)} variant="contained" color="primary">
                            Confirm
                        </Button>
                    </div>
                </Paper>
            </div>
        </Modal>
    );
};

export default CustomModal;
