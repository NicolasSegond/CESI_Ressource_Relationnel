import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:ressources_re_mobile/utilities/authentification.dart';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';
import 'package:ressources_re_mobile/utilities/customFetch.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: FilterPage(),
    );
  }
}

class FilterPage extends StatefulWidget {
  @override
  _FilterPageState createState() => _FilterPageState();
}

class _FilterPageState extends State<FilterPage> {
  final storage = FlutterSecureStorage();
  Map<String, dynamic>? _token;

  @override
  void initState() {
    super.initState();
    // Charger le token lors de l'initialisation de la page
    _loadToken();
  }

  // Fonction pour charger le token depuis Flutter Secure Storage
  void _loadToken() async {
    Map<String, dynamic>? token = await getTokenDisconnected();

    //String refresh = await refreshToken(token!['refresh_token']);
    //print('ICI : ' + refresh);

    Map<String, dynamic> response = await customFetch({
      'url': ApiConfig.apiUrl + '/api/ressources',
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }, connecter: false);

    setState(() {
      _token = token;
    });
  }

  // Fonction pour enregistrer le token
  void _saveToken(Map<String, dynamic>? token) async {
    await storage.write(key: 'token', value: json.encode(token));
    setState(() {
      _token = token;
    });
  }

  // Fonction pour supprimer le token
  void _deleteToken() async {
    await storage.delete(key: 'token');
    setState(() {
      _token = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Filters Demo'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(_token != null ? 'Token: ${_token!["token"]}' : 'No token stored'),
            ElevatedButton(
              onPressed: () {
                // Simuler la sauvegarde d'un token
                _saveToken({
                  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MTI2Nzk2NTQsImV4cCI6MTcxMjY4MTQ1NCwicm9sZXMiOiIiLCJ1c2VybmFtZSI6Im5pY29sYXNzZWdvbmQwQGdtYWlsLmNvbSIsInVzZXIiOnsidXJpX3V0aWxpc2F0ZXVyIjoiL2FwaS91c2Vycy8yMTQiLCJpZCI6MjE0fX0.rLLQ0aoeeiWky_puXIEeTe8ZeqzfLu3YrTUVNlT5NyGZfutIuXuzEVvQogTHaQ-2qQhc41OuRnpR8jXpP3N3lOSwykvvnZH0DDuawVUwMY9oI-6eUd4QGqDZDU7XNPmcKCDE5-E_iU--vCxX6pFhZWA0XdYcbYilXdZvFDPRL3dIk0aDmcxWtgHNqCrsEFaEOVVo5uxEzOBOzBTWm0VVQ8MXcrjjk_DFQxEwkg8kyO4-eVGPWeXZ3QOzQ9MFrDcMbL9PYvJ5GtBPfu95nZ-ux6NW2ReDcnZ8JqsFv7J6hkcqS_UtfCNVpRY357kuyZFR3zCYrTtkq_JKqnKVX6RCnA",
                  "refresh_token": "549bb7df74c219feaebb8250bacb55340459b1550655582a6996edc5ff33b76527956c3c9b354d8beae5c67c714ebdf4484a22327c0149830d47b20758fbfb8d"
                });
              },
              child: Text('Save Token'),
            ),
            ElevatedButton(
              onPressed: () {
                // Supprimer le token
                _deleteToken();
              },
              child: Text('Delete Token'),
            ),
          ],
        ),
      ),
    );
  }
}
