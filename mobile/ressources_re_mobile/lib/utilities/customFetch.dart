import 'authentification.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'fetchDataException.dart';

dynamic refreshTokenVar;
dynamic modifiedError;

Future<Map<String, dynamic>> customFetch(Map<String, dynamic> parameters, {bool connecter = true}) async {
  var response = {'data': '', 'error': ''};
  var data;

  var requestConfig = {
    'method': parameters['method'] ?? 'GET',
    'headers': parameters['headers'] ?? {},
    'body': parameters['body'] ?? ''
  };

  try {
    if (connecter) {
      var token = await getToken();

      final duration = await getTokenExpiration(token!['token']);

      if (duration < 0) {
        if (refreshTokenVar == null) {
          print(token!['refresh_token']);
          refreshTokenVar = refreshToken(token!['refresh_token']);
        }
        try {
          token = await refreshTokenVar;
          token!['token'] = token;
        } catch (e) {
          throw FetchDataException('DECONNEXION NECESSAIRE - Token expiré même après rafraîchissement. ');
        }
      }

      requestConfig = addBearerToTheHeader(token!['token'], requestConfig);
    }

    var headers = (requestConfig['headers'] as Map<String, dynamic>)
        .map<String, String>((key, value) => MapEntry(key, value.toString()));

    var res = await http.get(
      Uri.parse(parameters['url']),
      headers: parameters['headers']
    );

    data = res.body;
    response['data'] = data;

    print(res.statusCode);

    if (res.statusCode != 200) {
      var responseData = jsonDecode(data);

      // Récupérer le code d'erreur s'il existe
      var errorCode = responseData['code'];

      // Vérifier si le jeton JWT est expiré
      if (await expirationErrorTestAndThrower(connecter, responseData, res, true)) {
        var authTokens = await getToken();

        if (refreshTokenVar == null) {
          refreshTokenVar = refreshToken(authTokens!['refresh_token']);
        }

        try {
          authTokens!['token'] = await refreshTokenVar;


          requestConfig = addBearerToTheHeader(authTokens!['token'], requestConfig);
          headers = (requestConfig['headers'] as Map<String, dynamic>)
              .map<String, String>((key, value) => MapEntry(key, value.toString()));
        } catch (e) {}

        res = await http.get(
          Uri.parse(parameters['url']),
          headers: headers, // Passer les en-têtes mis à jour ici
        );
        
        data = res.body;
        response['data'] = data;

        if (res.statusCode != 200) {
          // Gérer l'erreur si le jeton est toujours expiré après le rafraîchissement
          modifiedError = Exception('DECONNEXION NECESSAIRE - Token expiré même après rafraîchissement. ');
        }
      }
    }
  } catch (err) {
    modifiedError = err.toString(); // Déclarer une nouvelle variable pour stocker l'erreur modifiée
    if (err.toString().contains('JWT token non trouvé')) {
      modifiedError = Exception('DECONNEXION NECESSAIRE - JWT Token non trouvé');
    } 
    response['error'] = modifiedError;
    response['data'] = '';
  } finally {
    refreshTokenVar = null;
  }
  return response;
}

Future<Map<String, dynamic>> customFetchPost(Map<String, dynamic> parameters, {bool connecter = true}) async {
  var response = {'data': '', 'error': ''};
  var data;

  var requestConfig = {
    'headers': parameters['headers'] ?? {},
    'body': parameters['body'] ?? ''
  };

  try {
    if (connecter) {
      var token = await getToken();

      final duration = await getTokenExpiration(token!['token']);

      if (duration < 0) {
        if (refreshTokenVar == null) {
          print(token!['refresh_token']);
          refreshTokenVar = refreshToken(token!['refresh_token']);
        }
        try {
          token = await refreshTokenVar;
          token!['token'] = token;
        } catch (e) {
          throw FetchDataException('DECONNEXION NECESSAIRE - Token expiré même après rafraîchissement. ');
        }
      }

      requestConfig = addBearerToTheHeader(token!['token'], requestConfig);
    }

    var headers = (requestConfig['headers'] as Map<String, dynamic>)
        .map<String, String>((key, value) => MapEntry(key, value.toString()));


    var res = await http.post(
      Uri.parse(parameters['url']),
      headers: parameters['headers'],
      body: parameters['body']
    );

    data = res.body;
    response['data'] = data;

    if (res.statusCode != 200) {
      var responseData = jsonDecode(data);

      // Récupérer le code d'erreur s'il existe
      var errorCode = responseData['code'];

      // Vérifier si le jeton JWT est expiré
      if (await expirationErrorTestAndThrower(connecter, responseData, res, true)) {
        var authTokens = await getToken();

        if (refreshTokenVar == null) {
          refreshTokenVar = refreshToken(authTokens!['refresh_token']);
        }

        try {
          authTokens!['token'] = await refreshTokenVar;


          requestConfig = addBearerToTheHeader(authTokens!['token'], requestConfig);
          headers = (requestConfig['headers'] as Map<String, dynamic>)
              .map<String, String>((key, value) => MapEntry(key, value.toString()));
        } catch (e) {}

        res = await http.post(
          Uri.parse(parameters['url']),
          headers: headers, // Passer les en-têtes mis à jour ici
        );
        
        data = res.body;
        response['data'] = data;

        if (res.statusCode != 200) {
          modifiedError = Exception('DECONNEXION NECESSAIRE - Token expiré même après rafraîchissement. ');
        }
      }
    }
  } catch (err) {
    modifiedError = err.toString(); // Déclarer une nouvelle variable pour stocker l'erreur modifiée
    if (err.toString().contains('JWT token non trouvé')) {
      modifiedError = Exception('DECONNEXION NECESSAIRE - JWT Token non trouvé');
    } 
    response['error'] = modifiedError;
    response['data'] = '';
  } finally {
    refreshTokenVar = null;
  }
  return response;
}

Future<Map<String, dynamic>> customFetchDelete(Map<String, dynamic> parameters, {bool connecter = true}) async {
  var response = {'data': '', 'error': ''};
  var data;

  var requestConfig = {
    'headers': parameters['headers'] ?? {},
    'body': parameters['body'] ?? ''
  };

  try {
    if (connecter) {
      var token = await getToken();

      final duration = await getTokenExpiration(token!['token']);

      if (duration < 0) {
        if (refreshTokenVar == null) {
          print(token!['refresh_token']);
          refreshTokenVar = refreshToken(token!['refresh_token']);
        }
        try {
          token = await refreshTokenVar;
          token!['token'] = token;
        } catch (e) {
          throw FetchDataException('DECONNEXION NECESSAIRE - Token expiré même après rafraîchissement. ');
        }
      }

      requestConfig = addBearerToTheHeader(token!['token'], requestConfig);
    }

    var headers = (requestConfig['headers'] as Map<String, dynamic>)
        .map<String, String>((key, value) => MapEntry(key, value.toString()));


    var res = await http.delete(
      Uri.parse(parameters['url']),
      headers: parameters['headers'],
      body: parameters['body']
    );

    data = res.body;
    response['data'] = data;

    if (res.statusCode != 200) {
      var responseData = jsonDecode(data);

      // Récupérer le code d'erreur s'il existe
      var errorCode = responseData['code'];

      // Vérifier si le jeton JWT est expiré
      if (await expirationErrorTestAndThrower(connecter, responseData, res, true)) {
        var authTokens = await getToken();

        if (refreshTokenVar == null) {
          refreshTokenVar = refreshToken(authTokens!['refresh_token']);
        }

        try {
          authTokens!['token'] = await refreshTokenVar;


          requestConfig = addBearerToTheHeader(authTokens!['token'], requestConfig);
          headers = (requestConfig['headers'] as Map<String, dynamic>)
              .map<String, String>((key, value) => MapEntry(key, value.toString()));
        } catch (e) {}

        res = await http.delete(
          Uri.parse(parameters['url']),
          headers: headers, // Passer les en-têtes mis à jour ici
        );
        
        data = res.body;
        response['data'] = data;

        if (res.statusCode != 200) {
          modifiedError = Exception('DECONNEXION NECESSAIRE - Token expiré même après rafraîchissement. ');
        }
      }
    }
  } catch (err) {
    modifiedError = err.toString(); // Déclarer une nouvelle variable pour stocker l'erreur modifiée
    if (err.toString().contains('JWT token non trouvé')) {
      modifiedError = Exception('DECONNEXION NECESSAIRE - JWT Token non trouvé');
    } 
    response['error'] = modifiedError;
    response['data'] = '';
  } finally {
    refreshTokenVar = null;
  }
  return response;
}

Future<bool> expirationErrorTestAndThrower(bool connecter, dynamic data, http.Response res, bool avantDeuxiemeEssai) async {
  if (data['detail'] != null && data['detail'] is String) {
    if (connecter && data['detail'] == 'Expired JWT Token') {
      if (avantDeuxiemeEssai) {
        return true;
      } else {
        throw new Exception('DECONNEXION NECESSAIRE - Token expiré même après rafraîchissement. ');
      }
    } else {
      throw new Exception(data['detail']);
    }
  } else {
    throw new Exception('Mauvaise réponse du serveur');
  }
}

