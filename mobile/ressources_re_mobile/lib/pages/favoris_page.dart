import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:ressources_re_mobile/classes/Ressource.dart';
import 'package:ressources_re_mobile/classes/Progression.dart';
import 'package:ressources_re_mobile/utilities/authentification.dart';
import 'package:ressources_re_mobile/utilities/customFetch.dart';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';
import 'package:ressources_re_mobile/pages/ressource_page.dart';
import 'package:ressources_re_mobile/pages/connexion_page.dart';
import 'dart:convert';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: FavorisPage(),
    );
  }
}

class FavorisPage extends StatefulWidget {
  @override
  _FavorisPageState createState() => _FavorisPageState();
}

class _FavorisPageState extends State<FavorisPage> {
  List<Progression> _ressources = [];
  List<Progression> _miseDeCote = [];
  int? userId; // ID de l'utilisateur

  @override
  void initState() {
    super.initState();
    _initializePage();
  }

  Future<void> _initializePage() async {
    await fetchUserId();
    _fetchData();
    _fetchMiseDeCote();
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

  void _fetchData() async {
      Map<String, dynamic> response = await customFetch({
        'url': ApiConfig.apiUrl + '/api/progressions?TypeProgression=1&Utilisateur=' + userId.toString(),
        'method': 'GET',
        'headers': {
          'Content-Type': 'application/json',
        }, 
      }, connecter: true);

      print(response['error']);

      if (response['error'] == '') {
        final dynamic result = json.decode(response['data']);
        final List<dynamic> members = result['hydra:member'];

        setState(() {
          _ressources = members.map((e) => Progression.fromJson(e)).toList();
        });
      } else {
        if(response['error'].contains("DECONNEXION NECCESSAIRE")){
          Navigator.pushReplacementNamed(context, '/connexion');
        } else {
          throw Exception('Failed to load data');
        }
      }
  }

  Future<void> _fetchMiseDeCote() async {
    try {
      Map<String, dynamic> response = await customFetch({
        'url': ApiConfig.apiUrl + '/api/progressions?TypeProgression=2&Utilisateur=' + userId.toString(),
        'method': 'GET',
        'headers': {
          'Content-Type': 'application/json',
        }, 
      }, connecter: true);

      if (response['error'] == '') {
        final dynamic result = json.decode(response['data']);
        final List<dynamic> members = result['hydra:member'];

        setState(() {
          _miseDeCote = members.map((e) => Progression.fromJson(e)).toList();
        });
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      print('Erreur lors du chargement des données de la mise de côté : $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Mes Ressources et Mises de Côté'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // DataTable pour les ressources
          Expanded(
            child: Container(
              width: double.infinity,
              margin: EdgeInsets.all(16),
              decoration: BoxDecoration(
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.5),
                    spreadRadius: 5,
                    blurRadius: 7,
                    offset: Offset(0, 3),
                  ),
                ],
              ),
              child: Card(
                elevation: 0,
                child: Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.all(8),
                      child: Text(
                        'Mes Ressources',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    _ressources.isNotEmpty
                      ? SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: SingleChildScrollView(
                            scrollDirection: Axis.vertical,
                            child: DataTable(
                              headingRowColor: MaterialStateColor.resolveWith((states) => Colors.blue),
                              dataRowColor: MaterialStateColor.resolveWith((states) => Colors.white),
                              columns: [
                                DataColumn(
                                  label: Text('ID',
                                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)
                                  )
                                ),
                                DataColumn(
                                  label: Text('Titre',
                                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)
                                  )
                                ),
                                DataColumn(
                                  label: Text('Date de création',
                                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)
                                  )
                                ),
                              ],
                              rows: _ressources.map((progression) {
                                final ressource = progression.ressource;
                                return DataRow(cells: [
                                  DataCell(Text(ressource?.getId()?.toString() ?? '')),
                                  DataCell(
                                    GestureDetector(
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) =>
                                              Ressources_page(uneRessource: ressource),
                                          ),
                                        );
                                      },
                                      child: Text(ressource?.getTitre() ?? '',
                                        style: TextStyle(
                                          color: Colors.blue,
                                          decoration: TextDecoration.underline
                                        ),
                                      ),
                                    ),
                                  ),
                                  DataCell(Text(ressource?.getDateCreation() ?? '')),
                                ]);
                              }).toList(),
                            ),
                          ),
                        )
                      : Center(child: CircularProgressIndicator()),
                  ],
                ),
              ),
            ),
          ),

          // DataTable pour les mises de côté
          Expanded(
            child: Container(
              width: double.infinity,
              margin: EdgeInsets.all(16),
              decoration: BoxDecoration(
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.5),
                    spreadRadius: 5,
                    blurRadius: 7,
                    offset: Offset(0, 3),
                  ),
                ],
              ),
              child: Card(
                elevation: 0,
                child: Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.all(8),
                      child: Text(
                        'Mes Mises de Côté',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    _miseDeCote.isNotEmpty
                      ? SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: SingleChildScrollView(
                            scrollDirection: Axis.vertical,
                            child: DataTable(
                              headingRowColor: MaterialStateColor.resolveWith((states) => Colors.blue),
                              dataRowColor: MaterialStateColor.resolveWith((states) => Colors.white),
                              columns: [
                                DataColumn(
                                  label: Text('ID',
                                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)
                                  )
                                ),
                                DataColumn(
                                  label: Text('Titre',
                                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)
                                  )
                                ),
                                DataColumn(
                                  label: Text('Date de création',
                                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)
                                  )
                                ),
                              ],
                              rows: _miseDeCote.map((progression) {
                                final ressource = progression.ressource;
                                return DataRow(cells: [
                                  DataCell(Text(ressource?.getId()?.toString() ?? '')),
                                  DataCell(
                                    GestureDetector(
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) =>
                                              Ressources_page(uneRessource: ressource),
                                          ),
                                        );
                                      },
                                      child: Text(ressource?.getTitre() ?? '',
                                        style: TextStyle(
                                          color: Colors.blue,
                                          decoration: TextDecoration.underline
                                        ),
                                      ),
                                    ),
                                  ),
                                  DataCell(Text(ressource?.getDateCreation() ?? '')),
                                ]);
                              }).toList(),
                            ),
                          ),
                        )
                      : Center(child: CircularProgressIndicator()),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
