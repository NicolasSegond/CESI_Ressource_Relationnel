import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:ressources_re_mobile/classes/Utilisateur.dart';
import 'package:ressources_re_mobile/utilities/authentification.dart';
import 'package:ressources_re_mobile/utilities/customFetch.dart';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';
import 'package:ressources_re_mobile/classes/HydraView.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: GestionUtilisateur(),
    );
  }
}

class GestionUtilisateur extends StatefulWidget {
  @override
  _GestionUtilisateurState createState() => _GestionUtilisateurState();
}

class _GestionUtilisateurState extends State<GestionUtilisateur> {
  late Future<List<Utilisateur>> futureUtilisateurs;
  int _currentPage = 1;
  int _totalPages = 1;

  @override
  void initState() {
    super.initState();
    futureUtilisateurs = fetchUtilisateurs(_currentPage);
  }

  Future<List<Utilisateur>> fetchUtilisateurs(int page) async {
    Map<String, dynamic> response = await customFetch({
      'url': ApiConfig.apiUrl + '/api/utilisateurs?page=$page',
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
      },
    }, connecter: true);

    if (response['error'] == '') {
      final dynamic result = json.decode(response['data']);
      final List<dynamic> members = result['hydra:member'];

      if (result.containsKey('hydra:view')) {
        HydraView hydraView = HydraView.fromJson(result['hydra:view']);
        String lastPageUrl = hydraView.last;
        List<String> parts = lastPageUrl.split("page=");
        setState(
          () {
            _totalPages = int.tryParse(parts.last) ?? 1;
          },
        );    
      } else {
        setState(
          () {
            _totalPages = 1;
          },
        );  
      }

      return members.map((json) => Utilisateur.fromJson(json)).toList();
    } else {
      if (response['error'].contains("DECONNEXION NECCESSAIRE")) {
        Navigator.pushReplacementNamed(context, '/connexion');
      } else {
        throw Exception('Failed to load data');
      }
    }
    return [];
  }

  Future<void> _promoteToModerator(int userId) async {
    Map<String, dynamic> response = await customFetchPatch({
        'url': ApiConfig.apiUrl + '/api/utilisateurs/' + userId.toString(),
        'method': 'PATCH',
        'headers': {
          'Content-Type': 'application/merge-patch+json',
        },
        'body': json.encode({'roles': ['ROLE_MODO']}),
      }, connecter: true);

      if (response['error'] == '') {     
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Utilisateur promu modérateur!')),
        );
        setState(() {
          futureUtilisateurs = fetchUtilisateurs(_currentPage);
        });
      } else {
        if (response['error'].contains("DECONNEXION NECESSAIRE")) {
          Navigator.pushReplacementNamed(context, '/connexion');
        } else {
          throw Exception('Failed to load data');
        }
      }
  }

  Future<void> _promoteToAdmin(int userId) async {
    Map<String, dynamic> response = await customFetchPatch({
        'url': ApiConfig.apiUrl + '/api/utilisateurs/' + userId.toString(),
        'method': 'PATCH',
        'headers': {
          'Content-Type': 'application/merge-patch+json',
        },
        'body': json.encode({'roles': ['ROLE_ADMIN', 'ROLE_MODO']}),
      }, connecter: true);

      if (response['error'] == '') {     
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Utilisateur promu administrateur!')),
        );
        setState(() {
          futureUtilisateurs = fetchUtilisateurs(_currentPage);
        });
      } else {
        if (response['error'].contains("DECONNEXION NECESSAIRE")) {
          Navigator.pushReplacementNamed(context, '/connexion');
        } else {
          throw Exception('Failed to promote');
        }
      }
  }

  Future<void> _banUser(int userId) async {
    Map<String, dynamic> response = await customFetchPatch({
        'url': ApiConfig.apiUrl + '/api/utilisateurs/' + userId.toString(),
        'method': 'PATCH',
        'headers': {
          'Content-Type': 'application/merge-patch+json',
        },
        'body': json.encode({'verif': 2}),
      }, connecter: true);

      if (response['error'] == '') {     
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Utilisateur bannis avec succès!')),
        );
        setState(() {
          futureUtilisateurs = fetchUtilisateurs(_currentPage);
        });
      } else {
        if (response['error'].contains("DECONNEXION NECESSAIRE")) {
          Navigator.pushReplacementNamed(context, '/connexion');
        } else {
          throw Exception('Failed to promote');
        }
      }
  }

  Future<void> _unbanUser(int userId) async {
    Map<String, dynamic> response = await customFetchPatch({
        'url': ApiConfig.apiUrl + '/api/utilisateurs/' + userId.toString(),
        'method': 'PATCH',
        'headers': {
          'Content-Type': 'application/merge-patch+json',
        },
        'body': json.encode({'verif': 1}),
      }, connecter: true);

      if (response['error'] == '') {     
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Utilisateur débannis avec succès!')),
        );
        setState(() {
          futureUtilisateurs = fetchUtilisateurs(_currentPage);
        });
      } else {
        if (response['error'].contains("DECONNEXION NECESSAIRE")) {
          Navigator.pushReplacementNamed(context, '/connexion');
        } else {
          throw Exception('Failed to promote');
        }
      }
  }

  Future<void> _demoteUser(int userId) async {
    Map<String, dynamic> response = await customFetchPatch({
        'url': ApiConfig.apiUrl + '/api/utilisateurs/' + userId.toString(),
        'method': 'PATCH',
        'headers': {
          'Content-Type': 'application/merge-patch+json',
        },
        'body': json.encode({'roles': ['ROLE_USER']}),
      }, connecter: true);

      if (response['error'] == '') {     
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Utilisateur dégrader avec succès!')),
        );
        setState(() {
          futureUtilisateurs = fetchUtilisateurs(_currentPage);
        });
      } else {
        if (response['error'].contains("DECONNEXION NECESSAIRE")) {
          Navigator.pushReplacementNamed(context, '/connexion');
        } else {
          throw Exception('Failed to promote');
        }
      }
  }

  Widget _buildVerificationTag(int verif) {
    String text;
    Color color;

    switch (verif) {
      case 1:
        text = 'Vérifié';
        color = Colors.green;
        break;
      case 0:
        text = 'Non vérifié';
        color = Colors.orange;
        break;
      case 2:
        text = 'Banni';
        color = Colors.red;
        break;
      default:
        text = 'Inconnu';
        color = Colors.grey;
    }

    return Chip(
      label: Text(text),
      backgroundColor: color,
      labelStyle: TextStyle(color: Colors.white),
    );
  }

  String _getInitials(String? firstName, String? lastName) {
    String initials = '';
    if (firstName != null && firstName.isNotEmpty) {
      initials += firstName[0];
    }
    if (lastName != null && lastName.isNotEmpty) {
      initials += lastName[0];
    }
    return initials.toUpperCase();
  }

  void _previousPage() {
    if (_currentPage > 1) {
      setState(() {
        _currentPage--;
        futureUtilisateurs = fetchUtilisateurs(_currentPage);
      });
    }
  }

  void _nextPage() {
    if (_currentPage < _totalPages) {
      setState(() {
        _currentPage++;
        futureUtilisateurs = fetchUtilisateurs(_currentPage);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Administration"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          children: [
            Expanded(
              child: FutureBuilder<List<Utilisateur>>(
                future: futureUtilisateurs,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else {
                    final utilisateurs = snapshot.data!;
                    return ListView.builder(
                      itemCount: utilisateurs.length,
                      itemBuilder: (context, index) {
                        final utilisateur = utilisateurs[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(vertical: 10.0),
                          elevation: 4.0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(10.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                ListTile(
                                  contentPadding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 15.0),
                                  leading: CircleAvatar(
                                    radius: 25.0,
                                    backgroundColor: Colors.blue.shade700,
                                    child: Text(
                                      _getInitials(utilisateur.prenom, utilisateur.nom),
                                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  title: Text(
                                    '${utilisateur.prenom ?? 'Prénom inconnu'} ${utilisateur.nom ?? 'Nom inconnu'}',
                                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                  ),
                                  subtitle: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      SizedBox(height: 5.0),
                                      Text(utilisateur.email ?? 'Email non disponible'),
                                      SizedBox(height: 5.0),
                                      Wrap(
                                        spacing: 8.0,
                                        runSpacing: 4.0,
                                        children: utilisateur.roles.map((role) => Chip(
                                          label: Text(role),
                                        )).toList(),
                                      ),
                                      SizedBox(height: 5.0),
                                      _buildVerificationTag(utilisateur.verif ?? 0),
                                    ],
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.only(left: 15.0, right: 15.0, bottom: 10.0),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    children: [
                                      IconButton(
                                        icon: Icon(Icons.verified_user, color: Colors.blue),
                                        onPressed: utilisateur.id != null ? () => _promoteToModerator(utilisateur.id!) : null,
                                        tooltip: 'Promouvoir Modérateur',
                                      ),
                                      IconButton(
                                        icon: Icon(Icons.security, color: Colors.blue),
                                        onPressed: utilisateur.id != null ? () => _promoteToAdmin(utilisateur.id!) : null,
                                        tooltip: 'Promouvoir Administrateur',
                                      ),
                                      IconButton(
                                        icon: Icon(Icons.block, color: Colors.red),
                                        onPressed: utilisateur.id != null ? () => _banUser(utilisateur.id!) : null,
                                        tooltip: 'Bannir',
                                      ),
                                      IconButton(
                                        icon: Icon(Icons.restore, color: Colors.green),
                                        onPressed: utilisateur.id != null ? () => _unbanUser(utilisateur.id!) : null,
                                        tooltip: 'Débannir',
                                      ),
                                      IconButton(
                                        icon: Icon(Icons.arrow_downward, color: Colors.orange),
                                        onPressed: utilisateur.id != null ? () => _demoteUser(utilisateur.id!) : null,
                                        tooltip: 'Dégrader l\'utilisateur',
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  }
                },
              ),
            ),
            SizedBox(height: 10.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: _currentPage > 1 ? _previousPage : null,
                  child: Text('Précédent'),
                ),
                Text('Page $_currentPage de $_totalPages'),
                ElevatedButton(
                  onPressed: _currentPage < _totalPages ? _nextPage : null,
                  child: Text('Suivant'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
