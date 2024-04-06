import React, { useState, useEffect } from 'react';
import Pagination from "../../composants/General/PaginationGlobal";
import CardRessource from "../../composants/Ressource/CardRessource";
import { customFetch } from "../../utils/customFetch";
import {useLoaderData} from "react-router-dom";
import TriComponent from "../../composants/Ressource/TriComponent";

function ListRessources({  }) {

    const [data, setData] = useState([]);
    const [tri, setTri] = useState({});
    const [categories, setCategories] = useState([]);
    const [typeRessources, setTypeRessources] = useState([]);
    const [typeRelations, setTypeRelations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTypeRelation, setSelectedTypeRelation] = useState(null);
    const [selectedTypeRessource, setSelectedTypeRessource] = useState(null);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const responsecat = await fetch('http://127.0.0.1:8000/api/categories');
                const responseDatacat = await responsecat.json();
                setCategories(responseDatacat['hydra:member']);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchTypeRelations = async () => {
            try {
                const responsetrel = await fetch('http://127.0.0.1:8000/api/type_relations');
                const responseDatarel = await responsetrel.json();
                setTypeRelations(responseDatarel['hydra:member']);
            } catch (error) {
                console.error('Error fetching type relations:', error);
            }
        };

        const fetchTypeRessources = async () => {
            try {
                const responsetres = await fetch('http://127.0.0.1:8000/api/type_de_ressources');
                const responseDatares = await responsetres.json();
                setTypeRessources(responseDatares['hydra:member']);
            } catch (error) {
                console.error('Error fetching type ressources:', error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await fetchCategories();
            await fetchTypeRelations();
            await fetchTypeRessources();
            setLoading(false);
        };

        fetchData();
    }, []);
    const handleChangeTri = (field, value) => {
        setTri({ ...tri, [field]: value });
        // Effectuez ici l'action appropriée en fonction des nouveaux critères de tri
    };
    const fetchData = async () => {
        setLoading(true);
        try {
            let url = 'http://127.0.0.1:8000/api/ressources?page=1';
            if (selectedCategory) {
                url += `&categorie=${selectedCategory}`;
            }
            if (selectedTypeRelation) {
                url += `&typeRelations=${selectedTypeRelation}`;
            }
            if (selectedTypeRessource) {
                url += `&typeDeRessource=${selectedTypeRessource}`;
            }
            const { data, error } = await customFetch({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }, false);
            console.log(url)
            if (error) {
                console.error('Erreur lors de la récupération des ressources:', error);
                setData([]);
            } else {
                setData(data['hydra:member']);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des ressources:', error);
            setData([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [selectedCategory, selectedTypeRelation, selectedTypeRessource]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleTypeRelationChange = (typeRelation) => {
        setSelectedTypeRelation(typeRelation);
    };

    const handleTypeRessourceChange = (typeRessource) => {
        setSelectedTypeRessource(typeRessource);
    };

    return (
        <div>
            <h1>Ressources:</h1>
            <br />
            <div>
                <h1>Liste des ressources</h1>
                <TriComponent
                    label="Catégories"
                    categories={categories}
                    onChangeTri={handleCategoryChange}
                />
                <TriComponent
                    label="Type de relations"
                    categories={typeRelations}
                    onChangeTri={handleTypeRelationChange}
                />
                <TriComponent
                    label="Type de ressources"
                    categories={typeRessources}
                    onChangeTri={handleTypeRessourceChange}
                />
            </div>

            {loading ? (
                <p>Chargement des ressources...</p>
            ) : (
                <div>
                    {data.map(ressource => (
                        <CardRessource
                            key={ressource['@id']}
                            imageUrl={`http://127.0.0.1:8000/images/book/${ressource.miniature}`}
                            title={ressource.titre}
                            description={ressource.contenu}
                        />
                    ))}
                    <Pagination currentPage={1} totalPages={10} />
                </div>
            )}
        </div>
    );
}
export default ListRessources;

export async function loader() {
    try {
        const {data, error} = await customFetch({
            url: `http://127.0.0.1:8000/api/ressources`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        },false);

        if (error) {
            console.error('Erreur lors de la récupération des ressources:', error);
            return {
                data: [] // Retourner une liste vide en cas d'erreur
            };
        }
        console.info(data['hydra:member']);
        return {
            data: data['hydra:member']  // Vérifier si data et data['hydra:member'] sont définis
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des ressources:', error);
        return {
            data: [] // Retourner une liste vide en cas d'erreur
        };
    }
}
