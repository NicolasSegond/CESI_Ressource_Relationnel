// MyForm.js
import React from "react";
import {Button, TextField} from "@mui/material";
import {Form, Link} from 'react-router-dom';
const MyForm = ({ formData, onChange, onSubmit, buttonText, buttonDisabled }) => {
    return (
        <Form onSubmit={onSubmit}>
            {formData.map((field, index) => (
                <div key={index}>
                    <TextField
                        type={field.type}
                        name={field.name}
                        label={field.name}
                        value={field.value}
                        onChange={onChange}
                        className={"textfield"}
                    />
                    <br/><br/>
                </div>
            ))}
            <Button type="submit" className={"send"} variant="contained" disabled={buttonDisabled}>{buttonText}</Button>
        </Form>
    );
};

export default MyForm;

