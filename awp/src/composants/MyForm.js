// MyForm.js
import React from "react";
import {Button, TextField} from "@mui/material";
import {Form} from 'react-router-dom';
const MyForm = ({ formData, onSubmit, buttonText, buttonDisabled }) => {
    return (
        <Form onSubmit={onSubmit}>
            {formData.map((field, index) => (
                !field.visibility ? (
                    <div key={index}>
                        <TextField
                            type={field.type}
                            name={field.name}
                            label={field.label}
                            className={"textfield"}
                            inputRef={field.ref}
                        />
                        <br/><br/>
                    </div>
                ) : null
            ))}
            <Button type="submit" className={"send"} variant="contained" disabled={buttonDisabled}>{buttonText}</Button>
        </Form>
    );
};

export default MyForm;

