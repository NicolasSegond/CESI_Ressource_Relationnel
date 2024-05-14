import React, { useEffect, useState } from 'react';
import Pagination from "../../composants/General/PaginationGlobal";
import CardRessource from "../../composants/Ressource/CardRessource";
import { customFetch } from "../../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import TriComponent from "../../composants/Ressource/TriComponent";
import { getIdUser, getRolesUser, getTokenDisconnected } from "../../utils/authentification";
import styles from './listRessources.module.css';
import { Snackbar } from '@mui/material';

function ListRessources({ }) {
    const [data, setData] = useState([]);
    const [tri, setTri] = useState({});
    const { options } = useLoaderData(); // Utiliser les options récupérées du loader
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1); // Initialisation du nombre total de pages à 1
    const [currentPage, setCurrentPage] = useState(1);
    const token = getTokenDisconnected();
    const connectUser = token ? getIdUser(token) : null;
    const [userRoles, setUserRoles] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null); // State pour gérer le message de l'alerte

    useEffect(() => {
        const fetchData = async () => {
            if (token && connectUser) {
                const rolesUser = await getRolesUser(connectUser);
                setUserRoles(rolesUser);
            }
        };

        fetchData();

    }, []);

    const visibilite = [
        { libelle: 'Public', id: 1 },
        { libelle: 'Privé', id: 2 },
        { libelle: 'Partage', id: 3 },
        { libelle: 'Mes Ressources', id: 4 }
    ];

    const [selectedVisibilite, setSelectedVisibilite] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTypeRelation, setSelectedTypeRelation] = useState(null);
    const [selectedTypeRessource, setSelectedTypeRessource] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            setLoading(false);
        };

        fetchData();
    }, []);

    const handleChangeTri = (field, value) => {
        if (value !== undefined) {
            setTri({ ...tri, [field]: value });
            // Effectuez ici l'action appropriée en fonction des nouveaux critères de tri
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            let url = `http://127.0.0.1:8000/api/ressources?page=${currentPage}`;
            if (selectedCategory) {
                url += `&categorie=${selectedCategory}`;
            }
            if (selectedTypeRelation) {
                url += `&typeRelations=${selectedTypeRelation}`;
            }
            if (selectedTypeRessource) {
                url += `&typeDeRessource=${selectedTypeRessource}`;
            }
            if (selectedVisibilite !== null) { // Vérifiez si la visibilité est sélectionnée
                if (selectedVisibilite == 2)
                    url += `&proprietaire=${connectUser}`;
                else if (selectedVisibilite == 3)
                    url += `&voirRessource=${connectUser}`;

                else if (selectedVisibilite == 4) {
                    url += `&proprietaire=${connectUser}`;
                }
                if (selectedVisibilite !== 4) {
                    url += `&visibilite=${selectedVisibilite}`;
                }
            }
            else {
                url += `&visibilite=1`;
            }

            const { data, error } = await customFetch({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }, false);
            if (error) {
                console.error('Erreur lors de la récupération des ressources:', error);
                setData([]);
            } else {
                setData(data['hydra:member']);
                const lastPageUrl = data['hydra:view'] ? data['hydra:view']['hydra:last'] : null;
                const totalPages = lastPageUrl ? extractTotalPages(lastPageUrl) : 1;
                setTotalPages(totalPages);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des ressources:', error);
            setData([]);
        }
        setLoading(false);
    };

    // Ajoutez une fonction pour gérer le changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchData();
    }, [selectedCategory, selectedTypeRelation, selectedTypeRessource, selectedVisibilite, currentPage]); // Ajoutez selectedVisibilite à la liste des dépendances

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleTypeRelationChange = (typeRelation) => {
        setSelectedTypeRelation(typeRelation);
    };

    const handleTypeRessourceChange = (typeRessource) => {
        setSelectedTypeRessource(typeRessource);
    };
    const handleVisibiliteChange = (visibilite) => {
        const selectedValue = visibilite !== null ? visibilite : ''; // Gérer le cas où la valeur est null
        setSelectedVisibilite(selectedValue);
        const selectedValueIndex = visibilite !== null ? visibilite : ''; // Gérer le cas où la valeur est null
        console.log('Index de la visibilité sélectionnée :', visibilite !== null ? visibilite : ''); // Afficher l'index de la visibilité sélectionnée
    };


    // Fonction pour extraire le nombre total de pages à partir de l'URL
    const extractTotalPages = (url) => {
        const match = url.match(/page=(\d+)$/);
        if (match && match[1]) {
            return parseInt(match[1]);
        }
        return 1;
    };

    // Fonction pour afficher un message d'alerte
    const showAlertMessage = (message) => {
        setAlertMessage(message);
    };

    return (
        <div className={styles['container']}>
            <h1>Ressources:</h1>
            <br />
            <div className={styles['container-filtre']}>
                <TriComponent
                    label="Catégories"
                    categories={options.categories || []}
                    onChangeTri={handleCategoryChange}
                    aucunActif={true}
                />
                <TriComponent
                    label="Type de relations"
                    categories={options.relationTypes || []}
                    onChangeTri={handleTypeRelationChange}
                    aucunActif={true}
                />
                <TriComponent
                    label="Type de ressources"
                    categories={options.resourceTypes || []}
                    onChangeTri={handleTypeRessourceChange}
                    aucunActif={true}
                />
                {connectUser && <TriComponent
                    label="Visibilité"
                    categories={visibilite}
                    onChangeTri={handleVisibiliteChange}
                    aucunActif={false}
                    defautSelect={1}
                />}
            </div>
            <br /><br />
            {loading ? (
                <p>Chargement des ressources...</p>
            ) : (
                <div>
                    {data.map(ressource => (
                        <CardRessource
                            key={ressource['@id']}
                            idRessource={ressource['id']}
                            imageUrl={`http://127.0.0.1:8000/images/book/${ressource.miniature}`}
                            title={ressource.titre}
                            description={ressource.contenu}
                            proprietaire={ressource.proprietaire}
                            vue={ressource.nombreVue}
                            nom={ressource.proprietaire.nom}
                            prenom={ressource.proprietaire.prenom}
                            date_creation={ressource.dateCreation}
                            visibilite={ressource.visibilite.libelle}
                            typeRessource={ressource.typeDeRessource.libelle}
                            typeRelations={ressource.typeRelations}
                            categorie={ressource.categorie.nom}
                            nbCommentaire={ressource.commentaires.length}
                            voirRessource={ressource.voirRessource}
                            idUser={connectUser}
                            userRoles={userRoles}
                            progressions={ressource.progressions}
                            showAlertMessage={showAlertMessage} // Passer la fonction pour afficher l'alerte au composant enfant
                        />
                    ))}
                    <br /><br />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            )}
            {/* Affichage de l'alerte */}
            <Snackbar
                open={!!alertMessage}
                autoHideDuration={6000}
                onClose={() => setAlertMessage(null)}
                message={alertMessage}
            />
        </div>
    );
}

export default ListRessources;
export async function loader() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/options');
        const responseData = await response.json();

        if (response.ok) {
            return {
                options: responseData // Retourner les options récupérées
            };
        } else {
            console.error('Erreur lors de la récupération des options:', responseData.error);
            return {
                options: {} // Retourner un objet vide en cas d'erreur
            };
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des options:', error);
        return {
            options: {} // Retourner un objet vide en cas d'erreur
        };
    }
}
