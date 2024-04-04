import React, { useState, useEffect } from 'react';
import Pagination from "../../composants/General/PaginationGlobal";
import CardRessource from "../../composants/Ressource/CardRessource";
import { customFetch } from "../../utils/customFetch";
import {useLoaderData} from "react-router-dom";

function ListRessources({  }) {

    const data = useLoaderData().data;


    return (
        <div>
            <h1>Ressources:</h1>
            <br/>


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
    );
}

export default ListRessources;

export async function loader() {
    try {
        const { data, error } = await customFetch({
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
