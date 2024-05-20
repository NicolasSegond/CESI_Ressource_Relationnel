import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './pageRessource.module.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import LabelIcon from '@mui/icons-material/Label';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getIdUser, getTokenDisconnected } from "../../utils/authentification";
import apiConfig from "../../utils/config";
import { customFetch } from "../../utils/customFetch";
import CustomAlert from "../../composants/CustomAlert";

function PageRessource() {
    const { id } = useParams();
    const [ressource, setRessource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [commentaire, setCommentaire] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alerts, setAlerts] = useState([]);

    const addAlert = (severity, message) => {
        setAlerts(prevAlerts => [...prevAlerts, { severity, message }]);
    };
    const handleCloseAlert = (index) => {
        setAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
    };

    const fetchCommentaire = async () => {
        try {
            let url = `${apiConfig.apiUrl}/api/commentaires/${id}/ressources?&order%5Bdate%5D=desc`;
            const { data, error } = await customFetch({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }, false);

            if (error) {
                console.error('Erreur lors de la récupération des commentaires:', error);
            } else {
                setCommentaire(data['hydra:member']);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des commentaires:', error);
        }
    };

    useEffect(() => {
        const token = getTokenDisconnected();

        if (token) {
            setUserId(getIdUser(token));
        }

        customFetch(
            {
                url: `${apiConfig.apiUrl}/api/ressources/${id}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            false
        ).then(({ data, error }) => {
            if (error) {
                console.error("Failed to fetch resource:", error);
                setError(error);
                setLoading(false);
            } else {
                setRessource(data);
                setLoading(false);
                fetchCommentaire();
            }
        });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading the resource.</div>;
    if (!ressource) return <div>No resource found.</div>;

    const handleCommentSubmit = (e) => {
        e.preventDefault();

        if (isSubmitting) {
            addAlert('info', 'Veuillez attendre 10 secondes avant de soumettre à nouveau.');
            return;
        }

        if (commentContent.length < 30) {
            addAlert('info', 'Le commentaire doit contenir au moins 30 caractères.');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => setIsSubmitting(false), 10000);

        const commentData = {
            contenu: commentContent,
            utilisateur: `/api/utilisateurs/${userId}`,
            ressource: `/api/ressources/${ressource.id}`,
            date: new Date().toISOString(),
        };

        customFetch(
            {
                url: `${apiConfig.apiUrl}/api/commentaires`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData)
            }, false
        )
            .then(({ data, error }) => {
                if (error) {
                    console.error("Error posting comment:", error);
                } else {
                    setCommentaire(prevCommentaire => [...prevCommentaire, data]);
                    setCommentContent('');
                }
            });
    };

    return (
        <div className={styles["page-container"]}>
            <h1 className={styles["header"]}>{ressource.titre}</h1>
            <img className={styles["article-image"]} src={`http://127.0.0.1:8000/images/book/${ressource.miniature}`} alt="Miniature" />
            <div className={styles["article-metadata"]}>
                <p><AccessTimeIcon style={{ verticalAlign: 'middle' }} /> Crée le : {new Date(ressource.dateCreation).toLocaleDateString()}</p>
                <p><EditIcon style={{ verticalAlign: 'middle' }} /> Dernière modification : {new Date(ressource.dateModification).toLocaleDateString()}</p>
                <p><VisibilityIcon style={{ verticalAlign: 'middle' }} /> Vues : {ressource.nombreVue}</p>
                <p><PersonIcon style={{ verticalAlign: 'middle' }} /> Propriétaire : {ressource.proprietaire.nom} {ressource.proprietaire.prenom}</p>
                <p><LabelIcon style={{ verticalAlign: 'middle' }} /> Type: {ressource.typeDeRessource.libelle}</p>
                <p><CategoryIcon style={{ verticalAlign: 'middle' }} /> Categorie : {ressource.categorie.nom}</p>
            </div>

            <div className={styles["article-content"]} dangerouslySetInnerHTML={{ __html: ressource.contenu }} />
            <div className={styles["attachments-section"]}>
                <h2>Pièces jointes</h2>
                {ressource.fichiers && ressource.fichiers.map((fichier, index) => (
                    <div key={index} className={styles["attachment"]}>
                        <AttachFileIcon />
                        <a href={`${apiConfig.apiUrl}/images/book/${fichier.nom}`} target="_blank" rel="noopener noreferrer">
                            {fichier.nom}
                        </a>
                    </div>
                ))}
            </div>
            <div className={styles["comment-section"]}>
                <h2>Commentaires</h2>
                {commentaire.map((comment, index) => (
                    <div key={index} className={styles["comment"]}>
                        <p>{comment.contenu}</p>
                        <p className={styles["comment-date"]}>Posté le : {new Date(comment.date).toLocaleDateString()}</p>
                    </div>
                ))}
                <div className={styles["comment-form"]}>
                    {userId && (
                        <form onSubmit={handleCommentSubmit}>
                            <textarea
                                value={commentContent}
                                onChange={e => setCommentContent(e.target.value)}
                                placeholder="Ajoutez un commentaire..."
                                className={styles["comment-input"]}
                                required
                            />
                            <button type="submit" className={styles["submit-comment"]}>Poster le commentaire</button>
                        </form>
                    )}
                </div>
            </div>
            {alerts.map((alert, index) => (
                <CustomAlert
                    key={index}
                    open={true}
                    message={alert.message}
                    handleClose={() => handleCloseAlert(index)}
                    severity={alert.severity}
                />
            ))}
        </div>
    );
}

export default PageRessource;
