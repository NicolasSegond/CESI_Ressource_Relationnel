import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:jwt_decode/jwt_decode.dart';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';
import 'package:ressources_re_mobile/utilities/fetchDataException.dart';
import 'package:ressources_re_mobile/utilities/customFetch.dart';


final storage = new FlutterSecureStorage();

Future<Map<String, dynamic>?> getToken() async {
  final tokensString = await storage.read(key: 'token');

  if (tokensString == null) {
    throw Exception('DECONNEXION NECCESSAIRE - tokens non trouvé');
  }

  try {
    final Map<String, dynamic> tokens =  jsonDecode(tokensString) as Map<String, dynamic>;

    if (tokens['token'] != null &&
        tokens['refresh_token'] != null &&
        tokens['token'] is String &&
        tokens['refresh_token'] is String) {
      return tokens;
    } else {
      return null;
    }
  } catch (error) {
    print("Erreur lors de l'analyse du token: $error");
    return null; 
  }
}

Future<Map<String, dynamic>?> getTokenDisconnected() async {
  final token = await storage.read(key: 'token');

  try {
    final Map<String, dynamic> tokens = jsonDecode(token!) as Map<String, dynamic>;

    if (tokens['token'] != null &&
        tokens['refresh_token'] != null &&
        tokens['token'] is String &&
        tokens['refresh_token'] is String) {
      return tokens;
    } else {
      return null;
    }
  } catch (error) {
    print("Erreur lors de l'analyse du token: $error");
    return null; 
  }
}

Future<int> getTokenExpiration(String token) async {
  try {
    final exp = Jwt.parseJwt(token)['exp'];
    final expirationDate = DateTime.fromMillisecondsSinceEpoch(exp * 1000);
    final currentDate = DateTime.now();
    final difference = expirationDate.difference(currentDate);
    return difference.inSeconds;
  } catch (e) {
    throw Exception('DECONNEXION NECCESSAIRE - Unable to extract token expiration');
  }
}

Future<String> refreshToken(String refreshToken) async {
  final response = await http.post(
    Uri.parse(ApiConfig.apiUrl + '/api/token/refresh'),
    headers: <String, String>{
      'Content-Type': 'application/json',
    },
    body: jsonEncode(<String, String>{'refresh_token': refreshToken}),
  );

  print('reponse : ' + await response.body);

  if (response.statusCode != 200) {
    throw FetchDataException('Impossible to refresh token');
  }

  final data = jsonDecode(response.body);
  await storage.write(key: 'token', value: jsonEncode(data));

  return data['token'];
}

Map<String, dynamic> addBearerToTheHeader(String token, Map<String, dynamic> requestConfigInit) {
  if (token == null || token.isEmpty) {
    return requestConfigInit;
  }

  final Map<String, dynamic> headers = Map<String, dynamic>.from(requestConfigInit['headers'] ?? <String, dynamic>{});
  headers['Authorization'] = 'Bearer $token';

  final Map<String, dynamic> updatedConfig = Map<String, dynamic>.from(requestConfigInit);
  updatedConfig['headers'] = headers;

  return updatedConfig;
}
Future<void> saveTokens(String tokensJson) async {
  await storage.write(key: 'token', value: tokensJson);
}

Future<int> getIdUser(Map<String, dynamic> tokens) async {
  try {
    // Extraire le token d'accès
    final token = tokens['token'] as String;
    
    // Décoder le token JWT
    final decodedToken = Jwt.parseJwt(token);
    print("token: " +decodedToken.toString());
    // Récupérer l'ID de l'utilisateur depuis le token
    final userObject = decodedToken['user'] as Map<String, dynamic>;
    // Récupérer l'ID de l'utilisateur depuis l'objet utilisateur
    final id = userObject['id'] as int;
    return id;
  } catch (e) {
    throw Exception('DECONNEXION NECESSAIRE - Impossible d\'extraire l\'ID de l\'utilisateur');
  }
}

Future<List<String>> getRolesUser(int id) async {
  try {
    final response = await customFetch({
      'url': ApiConfig.apiUrl + '/api/utilisateurs/$id/roles',
      'method': 'GET',
    });

    if (response['error'] != null) {
      if (response['error'].toString().contains('DECONNEXION NECESSAIRE')) {
        // Gérer la redirection vers la page de connexion si une déconnexion est nécessaire
        // Rediriger vers '/login' ou toute autre route appropriée
      } else {
        print("Une erreur s'est produite lors de la récupération des rôles : ${response['error']}");
        throw Exception("Une erreur s'est produite lors de la récupération des rôles");
      }
    }

    final data = response['data'] as Map<String, dynamic>;
    final roles = data['hydra:member'] as List<dynamic>;

    if (roles.isNotEmpty) {
      // Extraire les rôles de la réponse
      final userRoles = roles[0]['roles'] as List<dynamic>;
      // Convertir les rôles en liste de chaînes
      final roleNames = userRoles.map((role) => role.toString()).toList();
      return roleNames;
    } else {
      throw Exception("Aucun rôle trouvé pour l'utilisateur");
    }
  } catch (err) {
    print("Une erreur s'est produite lors de la récupération des rôles : $err");
    throw err;
  }
}
