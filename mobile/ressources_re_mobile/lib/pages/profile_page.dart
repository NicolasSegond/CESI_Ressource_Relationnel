import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:ressources_re_mobile/classes/Utilisateur.dart';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';
import 'package:ressources_re_mobile/utilities/customFetch.dart';
import 'package:ressources_re_mobile/utilities/authentification.dart';

class ProfilPage extends StatefulWidget {
  final int? id;

  const ProfilPage({Key? key, this.id}) : super(key: key);

  @override
  _ProfilPageState createState() => _ProfilPageState();
}

class _ProfilPageState extends State<ProfilPage> {
  final _prenomController = TextEditingController();
  final _nomController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  Utilisateur? _utilisateur;
  int? userId; // ID de l'utilisateur

  @override
  void initState() {
    super.initState();
    _initializePage();
  }

  @override
  void dispose() {
    _prenomController.dispose();
    _nomController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _initializePage() async {
    await fetchUserId();
    _fetchUserProfile();
  }

  Future<void> fetchUserId() async {
    try {
      final tokens = await getToken();
      if (tokens != null) {
        final id = await getIdUser(tokens!);
        setState(() {
          userId = id;
        });
      }
    } catch (e) {
      print('Une erreur s\'est produite lors de la récupération de l\'ID de l\'utilisateur : $e');
    }
  }

  void _fetchUserProfile() async {
    Map<String, dynamic> response = await customFetch({
      'url': ApiConfig.apiUrl + '/api/utilisateurs/' + userId.toString(),
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
      },
    }, connecter: true);

    if (response['error'] == '') {
      final dynamic result = json.decode(response['data']);
      setState(() {
        _utilisateur = Utilisateur.fromJson(result);
        _prenomController.text = _utilisateur!.prenom ?? '';
        _nomController.text = _utilisateur!.nom ?? '';
      });
    } else {
      if (response['error'].contains("DECONNEXION NECESSAIRE")) {
        Navigator.pushReplacementNamed(context, '/connexion');
      } else {
        throw Exception('Failed to load data');
      }
    }
  }

  String _getInitials(String? prenom, String? nom) {
    if (prenom == null || nom == null) return '';
    return '${prenom[0].toUpperCase()}${nom[0].toUpperCase()}';
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      final prenom = _prenomController.text;
      final nom = _nomController.text;
      final password = _passwordController.text;
      final confirmPassword = _confirmPasswordController.text;

      RegExp regex = RegExp(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{13,}$");


      if(password != '' && !regex.hasMatch(password)){
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Le mot de passe doit contenir au moins 13 caractères, dont au moins une majuscule, un chiffre et un caractère spécial'),
          ),
        );
      } else {
        if (password != confirmPassword) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Les mots de passe ne correspondent pas'),
            ),
          );
        } else {
          
          final updatedData = {
            'prenom': prenom,
            'nom': nom,
          };
          
          if (password != '') {
            updatedData['password'] = password;
          }

          setState(() {
            _isLoading = true;
          });

          customFetchPatch({
            'url': ApiConfig.apiUrl + '/api/utilisateurs/' + userId.toString(),
            'method': 'PATCH',
            'headers': {
              'Content-Type': 'application/merge-patch+json',
            },
            'body': jsonEncode(updatedData),
          }).then((response) {
            if (response['error'] == '') {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Profil mis à jour avec succès'),
                ),
              );
              _fetchUserProfile();
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Erreur : ' + response['error']),
                ),
              );
            }
            setState(() {
              _isLoading = false;
            });
          });

        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile Page'),
      ),
      body: _utilisateur != null
          ? SingleChildScrollView(
              child: Center(
                child: Container(
                  padding: EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CircleAvatar(
                          child: Text(
                            _getInitials(_utilisateur!.prenom, _utilisateur!.nom),
                            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                          ),
                          radius: 50,
                        ),
                        SizedBox(height: 20),
                        Text(
                          '${_utilisateur!.prenom} ${_utilisateur!.nom}',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 10),
                        Text(
                          'Email: ${_utilisateur!.email}',
                          style: TextStyle(fontSize: 16),
                        ),
                        SizedBox(height: 10),
                        Text(
                          'Rôles: ${_utilisateur!.roles.join(', ')}',
                          style: TextStyle(fontSize: 16),
                        ),
                        SizedBox(height: 10),
                        TextFormField(
                          controller: _prenomController,
                          decoration: InputDecoration(labelText: 'Prénom'),
                        ),
                        SizedBox(height: 10),
                        TextFormField(
                          controller: _nomController,
                          decoration: InputDecoration(labelText: 'Nom'),
                        ),
                        SizedBox(height: 10),
                        TextFormField(
                          controller: _passwordController,
                          decoration: InputDecoration(labelText: 'Mot de passe'),
                          obscureText: true,
                        ),
                        SizedBox(height: 10),
                        TextFormField(
                          controller: _confirmPasswordController,
                          decoration: InputDecoration(labelText: 'Confirmer votre nouveau mot de passe'),
                          obscureText: true,
                          validator: (value) {
                            if (value != _passwordController.text) {
                              return 'Les mots de passe ne correspondent pas';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: _submitForm,
                          child: _isLoading
                              ? CircularProgressIndicator(color: Colors.white)
                              : Text('Valider'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            )
          : Center(
              child: CircularProgressIndicator(),
            ),
    );
  }
}
