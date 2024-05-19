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
import 'package:ressources_re_mobile/classes/HydraView.dart';

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
  List<Ressource> _ressourcesEnAttente = [];
  int? userId;
  int currentPageFavoris = 1;
  int currentPageMDC = 1;
  int currentPageAttente = 1;
  HydraView hydraViewFavoris = HydraView(id: '', first: '', last: '');
  HydraView hdyraViewMDC = HydraView(id: '', first: '', last: '');
  HydraView hydraViewAttente = HydraView(id: '', first: '', last: '');
  int totalPagesFavoris = 1;
  int totalPagesMDC = 1;
  int totalPagesAttente = 1;


  @override
  void initState() {
    super.initState();
    _initializePage();
  }

  Future<void> _initializePage() async {
    await fetchUserId();
    _fetchData();
    _fetchMiseDeCote();
    _fetchRessourceEnAttente();
  }

  Future<void> fetchUserId() async {
    try {
      final tokens = await getToken();
      if (tokens != null) {
        final id = await getIdUser(tokens);
        setState(() {
          userId = id;
        });
      }
    } catch (e) {
      print('Error fetching user ID: $e');
    }
  }

  void _fetchData() async {
    try {
      Map<String, dynamic> response = await customFetch({
        'url': '${ApiConfig.apiUrl}/api/progressions?TypeProgression=1&page=$currentPageFavoris&Utilisateur=$userId',
        'method': 'GET',
        'headers': {
          'Content-Type': 'application/json',
        },
      }, connecter: true);

      if (response.containsKey('error') && response['error'] == '') {
        final dynamic result = json.decode(response['data']);
        final List<dynamic> members = result['hydra:member'];

        setState(() {
          _ressources = members.map((e) => Progression.fromJson(e)).toList();
          hydraViewFavoris = HydraView.fromJson(result['hydra:view']);
          String lastPageUrl = hydraViewFavoris.last;
          List<String> parts = lastPageUrl.split("page=");
          totalPagesFavoris = int.tryParse(parts.last) ?? 1;
        });

      } else {
        if (response.containsKey('error') && response['error'].contains("DECONNEXION NECESSAIRE")) {
          Navigator.pushReplacementNamed(context, '/connexion');
        } else {
          throw Exception('Échec du chargement des données');
        }
      }
    } catch (e) {
      print('Erreur lors de la récupération des données: $e');
    }
  }


  Future<void> _fetchMiseDeCote() async {
    try {
      Map<String, dynamic> response = await customFetch({
        'url': '${ApiConfig.apiUrl}/api/progressions?TypeProgression=2&page=$currentPageMDC&Utilisateur=$userId',
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
          hdyraViewMDC = HydraView.fromJson(result['hydra:view']);
          String lastPageUrl = hdyraViewMDC.last;
          List<String> parts = lastPageUrl.split("page=");
          totalPagesMDC = int.tryParse(parts.last) ?? 1;
        });
      } else {
        throw Exception('Failed to load mise de côté');
      }
    } catch (e) {
      print('Error fetching mise de côté: $e');
    }
  }

  Future<void> _fetchRessourceEnAttente() async {
    try {
      Map<String, dynamic> response = await customFetch({
        'url': '${ApiConfig.apiUrl}/api/ressources?page=$currentPageAttente&statut=2&proprietaire=$userId',
        'method': 'GET',
        'headers': {
          'Content-Type': 'application/json',
        },
      }, connecter: true);

      if (response['error'] == '') {
        final dynamic result = json.decode(response['data']);
        final List<dynamic> members = result['hydra:member'];

        setState(() {
          _ressourcesEnAttente = members.map((e) => Ressource.fromJson(e)).toList();
          hydraViewAttente = HydraView.fromJson(result['hydra:view']);
          String lastPageUrl = hydraViewAttente.last;
          List<String> parts = lastPageUrl.split("page=");
          totalPagesAttente = int.tryParse(parts.last) ?? 1;
        });
      } else {
        throw Exception('Failed to load resources en attente');
      }
    } catch (e) {
      print('Error fetching resources en attente: $e');
    }
  }

  void _deleteRessource(int ressourceId) async {
    try {
      await customFetchDelete({
        'url': '${ApiConfig.apiUrl}/api/progressions/$ressourceId',
        'headers': {
          'Content-Type': 'application/json',
        },
      }, connecter: true);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Suppression de la ressource en favorite avec succès'),
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erreur lors de la suppression'),
        ),
      );
    }
  }

  void _modifyRessource(Ressource ressource) {
    // Ajoutez votre logique de modification ici
    // Par exemple, naviguez vers une page de modification avec les détails de la ressource
    /*
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ModifyRessourcePage(ressource: ressource),
      ),
    );
    */
  }

  void fetchPageFavoris(int page) {
    setState(() {
      currentPageFavoris = page;
      _fetchData();
    });
  }

  void fetchPageMDC(int page) {
    setState(() {
      currentPageMDC = page;
      _fetchMiseDeCote();
    });
  }

  void fetchPageAttente(int page) {
    setState(() {
      currentPageAttente = page;
      _fetchRessourceEnAttente();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Mes Ressources et Mises de Côté'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Container pour les ressources
            Container(
              width: double.infinity,
              margin: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.5),
                    spreadRadius: 5,
                    blurRadius: 7,
                    offset: Offset(0, 3),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Padding(
                    padding: EdgeInsets.all(8),
                    child: Text(
                      'Mes Ressources favorites',
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
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: DataTable(
                                headingRowColor: MaterialStateColor.resolveWith((states) => Colors.blue),
                                dataRowColor: MaterialStateColor.resolveWith((states) => Colors.white),
                                columns: [
                                  DataColumn(
                                      label: Text('ID',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                                  DataColumn(
                                      label: Text('Titre',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                                  DataColumn(
                                      label: Text('Date de création',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                                  DataColumn(
                                      label: Text('Action',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
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
                                              builder: (context) => Ressources_page(idRessource: ressource?.getId()),
                                            ),
                                          );
                                        },
                                        child: Text(
                                          ressource?.getTitre() ?? '',
                                          style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
                                        ),
                                      ),
                                    ),
                                    DataCell(Text(ressource?.getDateCreation() ?? '')),
                                    DataCell(
                                      IconButton(
                                        icon: Icon(Icons.delete),
                                        onPressed: () {
                                          _deleteRessource(ressource!.getId()!);
                                        },
                                      ),
                                    ),
                                  ]);
                                }).toList(),
                              ),
                            ),
                          ),
                        )
                      : Center(child: CircularProgressIndicator()),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          IconButton(
                            icon: Icon(Icons.arrow_back),
                            onPressed: currentPageFavoris > 1 ? () => fetchPageFavoris(currentPageFavoris - 1) : null,
                          ),
                          Text('$currentPageFavoris / $totalPagesFavoris'),
                          IconButton(
                            icon: Icon(Icons.arrow_forward),
                            onPressed: currentPageFavoris < totalPagesFavoris ? () => fetchPageFavoris(currentPageFavoris + 1) : null,
                          ),
                        ],
                      ),
                ],
              ),
            ),

            // Container pour les mises de côté
            Container(
              width: double.infinity,
              margin: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.5),
                    spreadRadius: 5,
                    blurRadius: 7,
                    offset: Offset(0, 3),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Padding(
                    padding: EdgeInsets.all(8),
                    child: Text(
                      'Mises de Côté',

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
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: DataTable(
                                headingRowColor: MaterialStateColor.resolveWith((states) => Colors.blue),
                                dataRowColor: MaterialStateColor.resolveWith((states) => Colors.white),
                                columns: [
                                  DataColumn(
                                      label: Text('ID',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                                  DataColumn(
                                      label: Text('Titre',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                                  DataColumn(
                                      label: Text('Date de création',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                                  DataColumn(
                                      label: Text('Action',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
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
                                              builder: (context) => Ressources_page(idRessource: ressource?.getId()),
                                            ),
                                          );
                                        },
                                        child: Text(
                                          ressource?.getTitre() ?? '',
                                          style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
                                        ),
                                      ),
                                    ),
                                    DataCell(Text(ressource?.getDateCreation() ?? '')),
                                    DataCell(
                                      IconButton(
                                        icon: Icon(Icons.delete),
                                        onPressed: () {
                                          _deleteRessource(progression.getId()!);
                                        },
                                      ),
                                    ),
                                  ]);
                                }).toList(),
                              ),
                            ),
                          ),
                        )
                      : Center(child: CircularProgressIndicator()),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          IconButton(
                            icon: Icon(Icons.arrow_back),
                            onPressed: currentPageMDC > 1 ? () => fetchPageMDC(currentPageMDC - 1) : null,
                          ),
                          Text('$currentPageMDC / $totalPagesMDC'),
                          IconButton(
                            icon: Icon(Icons.arrow_forward),
                            onPressed: currentPageMDC < totalPagesMDC ? () => fetchPageMDC(currentPageMDC + 1) : null,
                          ),
                        ],
                      ),
                ],
              ),
            ),

            // Container pour les ressources en attente
            Container(
              width: double.infinity,
              margin: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.5),
                    spreadRadius: 5,
                    blurRadius: 7,
                    offset: Offset(0, 3),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Padding(
                    padding: EdgeInsets.all(8),
                    child: Text(
                      'Ressources en Attente',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  _ressourcesEnAttente.isNotEmpty
                      ? SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: SingleChildScrollView(
                            scrollDirection: Axis.vertical,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: DataTable(
                                headingRowColor: MaterialStateColor.resolveWith((states) => Colors.blue),
                                dataRowColor: MaterialStateColor.resolveWith((states) => Colors.white),
                                columns: [
                                  DataColumn(
                                      label: Text('ID',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                                  DataColumn(
                                      label: Text('Titre',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                                  DataColumn(
                                      label: Text('Date de création',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                                  DataColumn(
                                      label: Text('Action',
                                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                                ],
                                rows: _ressourcesEnAttente.map((ressource) {
                                  return DataRow(cells: [
                                    DataCell(Text(ressource.getId()?.toString() ?? '')),
                                    DataCell(
                                      GestureDetector(
                                        onTap: () {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (context) => Ressources_page(idRessource: ressource?.getId()),
                                            ),
                                          );
                                        },
                                        child: Text(
                                          ressource.getTitre() ?? '',
                                          style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
                                        ),
                                      ),
                                    ),
                                    DataCell(Text(ressource.getDateCreation() ?? '')),
                                    DataCell(
                                      IconButton(
                                        icon: Icon(Icons.edit),
                                        onPressed: () {
                                          _modifyRessource(ressource);
                                        },
                                      ),
                                    ),
                                  ]);
                                }).toList(),
                              ),
                            ),
                          ),
                        )
                      : Center(child: CircularProgressIndicator()),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          IconButton(
                            icon: Icon(Icons.arrow_back),
                            onPressed: currentPageAttente > 1 ? () => fetchPageAttente(currentPageAttente - 1) : null,
                          ),
                          Text('$currentPageAttente / $totalPagesAttente'),
                          IconButton(
                            icon: Icon(Icons.arrow_forward),
                            onPressed: currentPageAttente < totalPagesAttente ? () => fetchPageAttente(currentPageAttente + 1) : null,
                          ),
                        ],
                      ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
