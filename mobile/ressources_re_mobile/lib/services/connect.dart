import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ressources_re_mobile/pages/catalogue_page.dart';
import 'dart:convert';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';
import 'package:ressources_re_mobile/utilities/authentification.dart'; // Importer pour utiliser getToken

class Connect {
  static Future<void> login(BuildContext context, String email, String password, Function(bool) onLoginSuccess) async {
    String url = ApiConfig.apiUrl + "/api/login";
    Map<String, String> body = {
      'email': email,
      'password': password,
    };

    var response = await http.post(
      Uri.parse(url),
      body: json.encode(body),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
    );

    if (response.statusCode == 200) {
      // Connexion réussie
      print('Connexion réussie');

      // Extraire le token et le refresh de la réponse JSON
      var jsonResponse = json.decode(response.body);
      // Stocker le token et le refresh localement
      await saveTokens(jsonEncode(jsonResponse)); // Stockez directement la réponse JSON encodée
      
      // Appeler la fonction de rappel pour indiquer que la connexion a réussi
      onLoginSuccess(true);
    } else {
      // Erreur lors de la connexion
      print('Erreur lors de la connexion');
      // Afficher un message d'erreur à l'utilisateur
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erreur lors de la connexion : $email $password $url'),
        ),
      );

      // Appeler la fonction de rappel pour indiquer que la connexion a échoué
      onLoginSuccess(false);
    }
  }
}

