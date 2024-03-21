import {jwtDecode} from "jwt-decode";
import dayjs from "dayjs";
import apiConfig from "./config";

export function getToken() {
    const tokensString = sessionStorage.getItem('token');

    if (!tokensString) {
        throw new Error('DECONNEXION NECCESSAIRE - tokens non trouvé');
    }

    try {
        const tokens = JSON.parse(tokensString);

        if (tokens.token && tokens.refresh_token && typeof tokens.token === 'string' && typeof tokens.refresh_token === 'string') {
            return tokens;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de l'analyse du token:", error);
        return null; // La valeur n'est pas un JSON valide
    }
}

export function getTokenDisconnected() {
    const token = sessionStorage.getItem('token');

    try {
        const tokens = JSON.parse(token);

        if (tokens.token && tokens.refresh_token && typeof tokens.token === 'string' && typeof tokens.refresh_token === 'string') {
            return tokens;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de l'analyse du token:", error);
        return null; // La valeur n'est pas un JSON valide
    }
}


export function getTokenExpiration(token) {
    try{
        const exp = jwtDecode(token).exp;
        return dayjs.unix(exp).diff(dayjs());
    } catch (e) {
        throw new Error('DECONNEXION NECCESSAIRE - Unable to extract token expiration');
    }
}

export async function refreshToken(refreshtoken) {
    let response = await fetch(apiConfig.apiUrl + '/api/token/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'refresh_token': refreshtoken})
    });

    if (!response.ok) {
        throw new Error('Impossible to refresh token');
    }

    let data = await response.json();
    sessionStorage.setItem('token', JSON.stringify(data));

    return data.token;
}

export function addBearerToTheHeader(token, requestConfigInit = {}) {
    if (!token || typeof token != 'string') {
        return requestConfigInit;
    }
    if (!requestConfigInit.headers || typeof requestConfigInit.headers != 'object') {
        requestConfigInit.headers = {};
    }
    return {
        ...requestConfigInit,
        'headers': {
            ...requestConfigInit.headers,
            ...{
                'Authorization': 'Bearer ' + token
            }
        }
    };
}

export function getIdUser(token) {
    try {
        // Décoder le token
        const decodedToken = jwtDecode(token.token);

        // Récupérer l'id de l'utilisateur
        const user = decodedToken.user;

        return user.id;
    } catch (e) {
        throw new Error('LOGOUT NEEDED - Unable to extract user id');
    }
}

export function getRolesUser(token) {
    try {
        // Décoder le token
        const decodedToken = jwtDecode(token);

        // Récupérer les rôles de l'utilisateur
        return decodedToken.user.roles;
    } catch (e) {
        throw new Error('Unable to extract user roles');
    }
}