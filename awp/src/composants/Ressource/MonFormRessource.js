import React, {useState} from "react";
import {Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField} from "@mui/material";
import {Form} from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import {Stack} from "@mui/system";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";

const MyForm = ({formData, onChange, onSubmit, buttonText, buttonDisabled}) => {
    const [visibilite, setVisibilite] = useState('');
    const [value, setContenu] = useState('');

    const handleVisibiliteChange = (event) => {
        setVisibilite(event.target.value);
    };

    const handleTagClick = (value) => {
        setVisibilite(value);
    };

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
                                    <TextField type={"text"} name={field.name} label={field.label} value={field.value}
                                               className={"textfield-ajout"}/>
                                </>
                            )}
                            {field.select_type === 'textarea' && (
                                <>
                                    <p className={"ajout-label"}>{field.label}</p>
                                    <ReactQuill
                                        theme="snow"
                                        value={value}
                                        onChange={setContenu}
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
                                                className={visibilite === option ? `tag selected tag${index + 1}` : `tag tag${index + 1}`}
                                                onClick={() => handleTagClick(option)}
                                            >
                                              {option}
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
                                                    label={field.label}
                                                    value={visibilite}
                                                    onChange={handleVisibiliteChange}
                                                >
                                                    {field.options.map((option, index) => (
                                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </>
                                )}
                                {field.select_type === 'tags' && visibilite === "Partager" && (
                                    <>
                                        <p className={"select-label"}> Partager avec : </p>
                                        <TextField type={"text"} name={"nom_partager"} value={""}
                                                   placeholder={"Saissisez les adresses mail"}
                                                   className={"textfield-ajout"}/>
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
                                                onChange={field.onChange}
                                                input={<OutlinedInput label={field.label}/>}
                                                renderValue={(selected) => (
                                                    <Stack gap={1} direction="row" flexWrap="wrap">
                                                        {selected.map((value) => (
                                                            <Chip
                                                                key={value}
                                                                label={value}
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
                                                {field.name.map((name) => (
                                                    <MenuItem
                                                        key={name}
                                                        value={name}
                                                        sx={{justifyContent: "space-between"}}
                                                    >
                                                        {name}
                                                        {field.value.includes(name) ?
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
                                        <label htmlFor="images" className={field.className}>
                                            <input style={{marginTop: "10px", marginBottom: "10px"}} type="file"
                                                   name="images" id="images" multiple={field.ismultiple} required/>
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
