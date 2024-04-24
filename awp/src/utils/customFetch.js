import {addBearerToTheHeader, getToken, getTokenExpiration, refreshToken} from "./authentification";

let refreshTokenVar = undefined;

export async function customFetch(parametres, connecter = true) {
    let reponse = {data: null, error: null, statusCode: null};
    let data;
    let statusCode;

    let requeteConfig = {
        method: parametres.method ? parametres.method : 'GET',
        headers: parametres.headers ? parametres.headers : {},
        body: parametres.body ? parametres.body : null
    };

    try {
        if (connecter) {
            try {
                let token = getToken();
                const duration = getTokenExpiration(token.token);

                if (duration < 0) {
                    if (!refreshTokenVar) {
                        refreshTokenVar = refreshToken(token.refresh_token, true);
                    }
                    try {
                        const token = await refreshTokenVar;
                        token.token = token;
                    } catch (e) {
                    }
                }

                requeteConfig = addBearerToTheHeader(token.token, requeteConfig);
            } catch (e) {
                throw e;
            }
        }

        let res = await fetch(parametres.url, requeteConfig);
        reponse.statusCode = res.status;

        data = await res.json();
        console.log("data", data);
        reponse.data = data;

        if (!res.ok) {
            if (expirationErrorTestAndThrower(connecter, data, res, true)) {
                let authTokens = getToken();

                if (!refreshTokenVar) {
                    refreshTokenVar = refreshToken(authTokens.refresh_token, false);
                }
                try {
                    authTokens.token = await refreshTokenVar;

                    requeteConfig = addBearerToTheHeader(authTokens.token, requeteConfig);
                } catch (e) {
                }

                res = await fetch(parametres.url, requeteConfig);
                reponse.statusCode = res.status;
                data = await res.json();
                reponse.data = data;

                if (!res.ok) {
                    expirationErrorTestAndThrower(true, data, res, false);
                }
            }
        }
    } catch (err) {
        console.log(err);
        if (err.message && err.message.includes('JWT token non trouvé')) {
            err.message = 'DECONNEXION NECESSAIRE - JWT Token non trouvé';
        }
        reponse.error = err;
        reponse.data = null;
    } finally {
        refreshTokenVar = undefined;
    }
    return reponse;
}


export function expirationErrorTestAndThrower(connecter, data, res, avantDeuxiemeEssai = false) {
    if (data.detail && typeof data.detail === 'string') {
        if (connecter && data.detail === 'Expired JWT Token') {
            if (avantDeuxiemeEssai) {
                return true;
            } else {
                throw new Error('DECONNEXION NECESSAIRE - Token expiré même après rafraîchissement. ');
            }
        } else {
            throw new Error(data.detail);
        }
    } else {
        throw new Error('Mauvaise réponse du serveur');
    }
}