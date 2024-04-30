import React from "react";
import {Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select} from "@mui/material";
import {Form} from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import {Stack} from "@mui/system";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";

const MyForm = ({formData, onChange, onSubmit, buttonText, buttonDisabled}) => {
    const modules = {
        toolbar: [
            [{'header': '1'}, {'header': '2'}],
            [{'size': []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'video'],
            [{'align': []}],
            ['clean']
        ],
    };

    const inputsGauche = formData.filter((field) => field.alignment === 'gauche');
    const inputsDroite = formData.filter((field) => field.alignment === 'droite');

    return (
        <Form onSubmit={onSubmit}>
            <div className={"ajout-form-container"}>
                <div className={"partie-gauche"}>
                    {inputsGauche.map((field, index) => (
                        <div key={index}>
                            {field.select_type === 'text' && (
                                <>
                                    <p className={"ajout-label"}>{field.label}</p>
                                    <input required type={"text"} className={"textfield-ajout"} name={field.name} ref={field.ref} defaultValue={field.value}/>
                                </>
                            )}
                            {field.select_type === 'textarea' && (
                                <>
                                    <p className={"ajout-label"}>{field.label}</p>
                                    <ReactQuill
                                        theme="snow"
                                        value={field.value}
                                        onChange={(event) =>  field.onChange(event)}
                                        placeholder={field.placeholder}
                                        modules={modules}
                                        className={"react-quill"}
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className={"partie-droite"}>
                    <div className={"partie-options"}>
                        <p className={"partie-options-label"}> Options de la ressource : </p>
                        {inputsDroite.map((field, index) => (
                            <div key={index}>
                                {field.select_type === 'tags' && (
                                    <div className="tags">
                                        {field.options.map((option, index) => (
                                            <span
                                                key={index}
                                                className={field.value === option.name ? `tag selected tag${index + 1}` : `tag tag${index + 1}`}
                                                onClick={() => field.onChange(option)}
                                            >
                                              {option.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {field.select_type === 'select' && (
                                    <>
                                        <div className={"partie-options-select"}>
                                            <p className={"select-label"}>{field.label_select}</p>
                                            <FormControl id={"select-visibilite"}>
                                                <InputLabel
                                                    id="demo-simple-select-helper-label"> {field.label} </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-helper-label"
                                                    id="demo-simple-select-helper"
                                                    name={field.name}
                                                    label={field.label}
                                                    value={field.value}
                                                    onChange={(event) => field.onChange(event.target.value)}
                                                >
                                                    {field.options.map((option, index) => (
                                                        <MenuItem key={index} value={option.id}>{option.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </>
                                )}
                                {field.select_type === 'multi-select' && (
                                    <div className={"partie-options-select"}>
                                        <p className={"select-label"}>{field.label_select}</p>
                                        <FormControl sx={{width: '100%'}}>
                                            <InputLabel>{field.label}</InputLabel>
                                            <Select
                                                multiple
                                                value={field.value}
                                                name={field.name}
                                                ref={field.ref}
                                                onChange={field.onChange}
                                                input={<OutlinedInput label={field.label}/>}
                                                sx={{height: '100%'}}
                                                renderValue={(selected) => (
                                                    <Stack gap={1} direction="row" flexWrap="wrap">
                                                        {selected.map((value) => (
                                                            <Chip
                                                                key={value}
                                                                label={field.options.find(option => option.id === value).name}
                                                                onDelete={() => field.onDelete(value)}
                                                                deleteIcon={
                                                                    <CancelIcon
                                                                        onMouseDown={(event) => event.stopPropagation()}
                                                                    />
                                                                }
                                                            />
                                                        ))}
                                                    </Stack>
                                                )}
                                            >
                                                {field.options.map((type) => (
                                                    <MenuItem
                                                        key={type.id}
                                                        value={type.id}
                                                        sx={{justifyContent: "space-between"}}
                                                    >
                                                        {type.name}
                                                        {field.value.includes(type.id) ?
                                                            <CheckIcon color="info"/> : null}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                )}
                                {field.select_type === 'telechargement' && (
                                    <>
                                        <p className={"select-label"}
                                           style={{marginBlockStart: "10px"}}>{field.label}</p>
                                        <label htmlFor={field.name} className={field.className}>
                                            <input style={{marginTop: "10px", marginBottom: "10px"}} type="file"
                                                   name={field.name} id={field.name} multiple={field.ismultiple} ref={field.ref} required={field.required}/>
                                        </label>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="submit" className={"button-submit"} disabled={buttonDisabled}>{buttonText}</button>
                </div>

            </div>
        </Form>
    );
};

export default MyForm;