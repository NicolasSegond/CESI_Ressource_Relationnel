import {jwtDecode} from "jwt-decode";
import dayjs from "dayjs";
import apiConfig from "./config";


export function getToken() {
    const tokens = localStorage.getItem('token');

    if (!tokens) {
        throw new Error('DECONNEXION NECESSAIRE - token non trouvé');
    }

    try {
        const TokensOk = JSON.parse(tokens);

        if (TokensOk.token && TokensOk.refresh_token && typeof TokensOk.token === 'string' && typeof TokensOk.refresh_token === 'string') {
            return TokensOk;
        } else {
            throw new Error('DECONNEXION NECESSAIRE - token invalides');
        }
    } catch (e) {
        throw new Error('DECONNEXION NECESSAIRE - token invalides');
    }
}

export function getTokenExpiration(token) {
    try{
        const exp = jwtDecode(token).exp;
        return dayjs.unix(exp).diff(dayjs());
    } catch (e) {
        throw new Error('DECONNEXION NECESSAIRE - Impossible d\'extraire l\'expiration du token');
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
        throw new Error('Impossible de rafraîchir le token');
    }

    let data = await response.json();
    localStorage.setItem('token', JSON.stringify(data));

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