import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:jwt_decode/jwt_decode.dart';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';
import 'package:ressources_re_mobile/utilities/fetchDataException.dart';

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

