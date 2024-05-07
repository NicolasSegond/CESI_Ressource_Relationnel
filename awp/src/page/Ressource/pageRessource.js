import React, { useEffect, useState } from 'react';
import {useLocation, useParams} from 'react-router-dom';
import styles from './pageRessource.module.css'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import LabelIcon from '@mui/icons-material/Label';
import {getIdUser, getTokenDisconnected} from "../../utils/authentification";

function PageRessource() {
    const location = useLocation();
    const { id } = location.state || {};
    const [ressource, setRessource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [commentContent, setCommentContent] = useState('');



    useEffect(() => {
        const token = getTokenDisconnected();
        if (token) {
            setUserId(getIdUser(token));
        }

        fetch(`http://127.0.0.1:8000/api/ressources/${id}`)
            .then(response => response.json())
            .then(data => {
                setRessource(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch resource:", err);
                setError(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading the resource.</div>;
    if (!ressource) return <div>No resource found.</div>;
    const sortedComments = ressource.commentaires.sort((a, b) => new Date(a.date) - new Date(b.date));


    //Attention ici à refaire !!
    function handleCommentSubmit(e) {
        e.preventDefault();
        if (!commentContent.trim()) return;

        const commentData = {
            contenu: commentContent,
            date: new Date().toISOString(), // Suppose the server accepts date in this format
            // Add other necessary fields here
        };
        //Attention faire Car pas le back
        fetch(`http://127.0.0.1:8000/api/commentaires`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getTokenDisconnected()}`
            },
            body: JSON.stringify(commentData)
        })
            .then(response => response.json())
            .then(newComment => {
                setRessource(prevRessource => ({
                    ...prevRessource,
                    commentaires: [...prevRessource.commentaires, newComment]
                }));
                setCommentContent('');
            })
            .catch(error => {
                console.error("Error posting comment:", error);
            });
    }


    return (
        <div className={styles["page-container"]}>
            <h1 className={styles["header"]}>{ressource.titre}</h1>
            <img className={styles["article-image"]} src={`http://127.0.0.1:8000/images/book/${ressource.miniature}`}
                 alt="Miniature"/>
            <div className={styles["article-metadata"]}>
                <p><AccessTimeIcon style={{verticalAlign: 'middle'}}/> Created
                    on: {new Date(ressource.dateCreation).toLocaleDateString()}</p>
                <p><EditIcon style={{verticalAlign: 'middle'}}/> Last
                    modified: {new Date(ressource.dateModification).toLocaleDateString()}</p>
                <p><VisibilityIcon style={{verticalAlign: 'middle'}}/> Views: {ressource.nombreVue}</p>
                <p><PersonIcon
                    style={{verticalAlign: 'middle'}}/> Owner: {ressource.proprietaire.nom} {ressource.proprietaire.prenom}
                </p>
                <p><LabelIcon style={{verticalAlign: 'middle'}}/> Type: {ressource.typeDeRessource.libelle}</p>
                <p><CategoryIcon style={{verticalAlign: 'middle'}}/> Category: {ressource.categorie.nom}</p>
            </div>

            <div className={styles["article-content"]} dangerouslySetInnerHTML={{__html: ressource.contenu}}/>
            <div className={styles["comment-section"]}>
                <h2>Commentaires</h2>
                {sortedComments.map((comment, index) => (
                    <div key={index} className={styles["comment"]}>
                        <p>{comment.contenu}</p>
                        <p className={styles["comment-date"]}>Posted
                            on: {new Date(comment.date).toLocaleDateString()}</p>
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
        </div>
    );
}

export default PageRessource;
