// MyForm.js
import React from "react";

const MyForm = ({ formData, onChange, onSubmit, buttonText, buttonDisabled }) => {
    return (
        <form onSubmit={onSubmit}>
            {formData.map((field, index) => (
                <div key={index}>
                    <label>
                        {field.label}:
                        <input
                            type={field.type}
                            name={field.name}
                            value={field.value}
                            onChange={onChange}
                        />
                    </label>
                    <br />
                </div>
            ))}
            <button type="submit" disabled={buttonDisabled}>{buttonText}</button>

        </form>
    );
};

export default MyForm;

