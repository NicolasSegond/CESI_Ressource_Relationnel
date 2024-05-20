import React, {useEffect, useState} from 'react';
import styles from './ressourceTypeJeu.module.css';
import apiConfig from '../../utils/config';
import {customFetch} from '../../utils/customFetch';
import {getIdUser, getTokenDisconnected} from '../../utils/authentification';

// Fonction pour récupérer les commentaires
const fetchComments = async (idRessource, setComments) => {
    try {
        let url = `${apiConfig.apiUrl}/api/commentaires/${idRessource}/ressources?&order%5Bdate%5D=desc`;
        const {data, error} = await customFetch({
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }, false);

        if (error) {
            console.error('Erreur lors de la récupération des commentaires:', error);
        } else {
            setComments(data['hydra:member']);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
    }
};

const RessourceTypeJeu = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [comments, setComments] = useState([]);
    const [userId, setUserId] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const idRessource = 169;

    useEffect(() => {
        const token = getTokenDisconnected();
        if (token) {
            setUserId(getIdUser(token));
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchComments(idRessource, setComments);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const calculateBotMove = (board) => {
            const emptyCells = board.reduce((acc, cell, index) => {
                if (!cell) {
                    acc.push(index);
                }
                return acc;
            }, []);
            if (emptyCells.length === 0) {
                return -1; // Aucune cellule vide
            }
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            return emptyCells[randomIndex];
        };

        if (!xIsNext) {
            const botMove = calculateBotMove(board);
            if (botMove !== -1) {
                setTimeout(() => {
                    const newBoard = [...board];
                    newBoard[botMove] = 'O'; // Le bot est 'O'
                    setBoard(newBoard);
                    setXIsNext(true);
                }, 500); // Délai pour la simulation du coup du bot
            }
        }
    }, [xIsNext, board]);

    const handleClick = (index) => {
        if (winner || board[index]) {
            return;
        }
        const newBoard = [...board];
        newBoard[index] = 'X'; // Le joueur est 'X'
        setBoard(newBoard);
        setXIsNext(false);
    };

    const renderCell = (index) => (
        <div className={styles.cell} onClick={() => handleClick(index)}>
            {board[index]}
        </div>
    );

    useEffect(() => {
        const calculateWinner = (board) => {
            const lines = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ];
            for (let i = 0; i < lines.length; i++) {
                const [a, b, c] = lines[i];
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a];
                }
            }
            return null;
        };

        const calcWinner = calculateWinner(board);
        if (calcWinner) {
            setWinner(calcWinner);
        }
    }, [board]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        const commentData = {
            contenu: commentContent,
            utilisateur: `/api/utilisateurs/${userId}`,
            ressource: `/api/ressources/${idRessource}`,
            date: new Date().toISOString(),
        };

        fetch('http://127.0.0.1:8000/api/commentaires', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Échec de l\'ajout du commentaire');
                }
                return response.json();
            })
            .then(data => {
                setComments([...comments, data]);
                setCommentContent('');
                fetchComments(idRessource, setComments); // Rafraîchir les commentaires après l'ajout
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout du commentaire:', error);
            });
    };

    const status = winner ? `Gagnant: ${winner}` : `Prochain joueur: ${xIsNext ? 'X' : 'O'}`;

    return (
        <div>
            <h1>Jeux - Morpion</h1>
            <div className={styles.board}>
                {board.map((cell, index) => renderCell(index))}
            </div>
            <div>{status}</div>

            <h2>Commentaires</h2>
            <div className={styles.comments}>
                {comments === null ? (
                    <p>Chargement des commentaires...</p>
                ) : comments.length === 0 ? (
                    <p>Aucun commentaire pour le moment</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment['@id']} className={styles.comment}>
                            <p>{comment.contenu}</p>
                            <p>Par {comment.utilisateur.prenom} {comment.utilisateur.nom} le {new Date(comment.date).toLocaleDateString()}</p>
                        </div>
                    ))
                )}
            </div>

            {userId === null ? (
                <p>Connectez-vous pour ajouter un commentaire</p>
            ) : (
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        placeholder="Ajouter un commentaire..."
                        value={commentContent}
                        className={styles['textarea_comment']}
                        onChange={e => setCommentContent(e.target.value)}
                    />
                    <button className={styles['button_submit']} type="submit">Envoyer</button>
                </form>
            )}
        </div>
    );
};

export default RessourceTypeJeu;
