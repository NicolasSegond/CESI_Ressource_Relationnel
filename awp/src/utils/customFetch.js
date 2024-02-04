import {addBearerToTheHeader, getToken, getTokenExpiration, refreshToken} from "./connexionUtil";

let refreshTokenVar = undefined;

export async function customFetch(parametres, connecter = true) {
    let reponse = {data: null, error: null};
    let data;

    let requeteConfig = {
        method: parametres.method ? parametres.method : 'GET',
        headers: parametres.headers ? parametres.headers : {},
        body: parametres.body ? JSON.stringify(parametres.body) : null
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

        data = await res.json();
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
                data = await res.json();
                reponse.data = data;

                if (!res.ok) {
                    expirationErrorTestAndThrower(true, data, res, false);
                }
            }
        }
    } catch (err) {
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
    if (data.message && typeof data.message === 'string') {
        if (connecter && data.message === 'Expired JWT Token') {
            if (avantDeuxiemeEssai) {
                return true;
            } else {
                throw new Error('DECONNEXION NECESSAIRE - Token expiré même après rafraîchissement. ');
            }
        } else {
            if (data.code) {
                throw new Error(data.message);
            }
            throw new Error(data.message);        }
    } else {
        throw new Error('Mauvaise réponse du serveur');
    }
}