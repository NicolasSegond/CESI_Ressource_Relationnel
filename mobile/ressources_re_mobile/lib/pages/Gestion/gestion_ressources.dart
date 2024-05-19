import 'package:flutter/material.dart';
import 'dart:convert';
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
      home: GestionRessources(),
    );
  }
}

class GestionRessources extends StatefulWidget {
  @override
  _GestionRessourcesState createState() => _GestionRessourcesState();
}

class _GestionRessourcesState extends State<GestionRessources> {
  late Future<List<dynamic>> futureRessources;
  List<dynamic> ressources = [];
  int _currentPage = 1;
  int _totalPages = 1;

  @override
  void initState() {
    super.initState();
    futureRessources = fetchRessources(_currentPage);
  }

  Future<List<dynamic>> fetchRessources(int page) async {
    Map<String, dynamic> response = await customFetch({
      'url': ApiConfig.apiUrl + '/api/ressources?page=$page',
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
      },
    });

    if (response['error'] == '') {
      final dynamic result = json.decode(response['data']);
      final List<dynamic> members = result['hydra:member'];

      setState(() {
        ressources = members;
        if (result.containsKey('hydra:view')) {
          HydraView hydraView = HydraView.fromJson(result['hydra:view']);
          String lastPageUrl = hydraView.last;
          List<String> parts = lastPageUrl.split("page=");
          setState(() {
            _totalPages = int.tryParse(parts.last) ?? 1;
          });
        } else {
          setState(() {
            _totalPages = 1;
          });
        }
      });
      return members;
    } else {
      if (response['error'].contains("DECONNEXION NECESSAIRE")) {
        Navigator.pushReplacementNamed(context, '/connexion');
      } else {
        throw Exception('Failed to load ressources');
      }
    }
    return [];
  }

  Future<void> _deleteRessource(int ressourceID) async {
    Map<String, dynamic> response = await customFetchDelete({
      'url': ApiConfig.apiUrl + '/api/ressources/$ressourceID',
      'method': 'DELETE',
      'headers': {
        'Content-Type': 'application/json',
      },
    }, connecter: true);

    if (response['error'] == '') {
      setState(() {
        futureRessources = fetchRessources(_currentPage);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ressource supprimée avec succès !')),
      );
    } else {
      throw Exception('Failed to delete ressource');
    }
  }

  Future<void> _acceptResource(int ressourceID) async {
    Map<String, dynamic> response = await customFetchPatch({
      'url': ApiConfig.apiUrl + '/api/ressources/$ressourceID/valider',
      'method': 'PATCH',
      'headers': {
        'Content-Type': 'application/merge-patch+json',
      },
      'body': json.encode({}),
    }, connecter: true);

    if (response['error'] == '') {
      setState(() {
        futureRessources = fetchRessources(_currentPage);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ressource acceptée avec succès !')),
      );
    } else {
      throw Exception('Failed to accept ressource');
    }
  }

  Future<void> _rejectResource(int ressourceID, String message) async {
    Map<String, dynamic> response = await customFetchPatch({
      'url': ApiConfig.apiUrl + '/api/ressources/$ressourceID/refuser',
      'method': 'PATCH',
      'headers': {
        'Content-Type': 'application/merge-patch+json',
      },
      'body': json.encode({'message': message}),
    }, connecter: true);

    if (response['error'] == '') {
      setState(() {
        futureRessources = fetchRessources(_currentPage);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ressource refusée avec succès !')),
      );
    } else {
      throw Exception('Failed to reject ressource');
    }
  }

  Future<void> _suspendResource(int ressourceID) async {
    Map<String, dynamic> response = await customFetchPatch({
      'url': ApiConfig.apiUrl + '/api/ressources/$ressourceID/refuser',
      'method': 'PATCH',
      'headers': {
        'Content-Type': 'application/merge-patch+json',
      },
      'body': json.encode({'message': 'Ressource suspendue par un administrateur car elle ne respectait pas le réglement de la plateforme, aucun retour en arrière n\'est possible.'}),
    }, connecter: true);

    if (response['error'] == '') {
      setState(() {
        futureRessources = fetchRessources(_currentPage);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ressource suspendue avec succès !')),
      );
    } else {
      throw Exception('Failed to suspend ressource');
    }
  }

  Widget _buildStatusTag(String status) {
    Color bgColor;
    Color textColor;
    switch (status) {
      case 'Valide':
        bgColor = Colors.green[100]!;
        textColor = Colors.green[800]!;
        break;
      case 'Refuse':
        bgColor = Colors.red[100]!;
        textColor = Colors.red[800]!;
        break;
      case 'Attente':
        bgColor = Colors.orange[100]!;
        textColor = Colors.orange[800]!;
        break;
      default:
        bgColor = Colors.grey[100]!;
        textColor = Colors.grey[800]!;
    }
    return Container(
      padding: EdgeInsets.symmetric(vertical: 4.0, horizontal: 8.0),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: Text(
        status,
        style: TextStyle(
          color: textColor,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Future<void> _showRejectDialog(int ressourceID) async {
    TextEditingController _controller = TextEditingController();

    return showDialog<void>(
      context: context,
      barrierDismissible: false, // User must tap a button!
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Rejeter la ressource'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('Veuillez entrer le motif du rejet:'),
                TextField(
                  controller: _controller,
                  decoration: InputDecoration(
                    hintText: 'Motif du rejet',
                  ),
                  maxLines: 3,
                ),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Annuler'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Rejeter'),
              onPressed: () {
                _rejectResource(ressourceID, _controller.text);
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  void _previousPage() {
    if (_currentPage > 1) {
      setState(() {
        _currentPage--;
        futureRessources = fetchRessources(_currentPage);
      });
    }
  }

  void _nextPage() {
    if (_currentPage < _totalPages) {
      setState(() {
        _currentPage++;
        futureRessources = fetchRessources(_currentPage);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Administration des Ressources"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          children: [
            Expanded(
              child: FutureBuilder<List<dynamic>>(
                future: futureRessources,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Erreur: ${snapshot.error}'));
                  } else {
                    return ListView.builder(
                      itemCount: ressources.length,
                      itemBuilder: (context, index) {
                        final ressource = ressources[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(vertical: 10.0),
                          elevation: 4.0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          child: ListTile(
                            contentPadding: EdgeInsets.all(10.0),
                            title: Text(
                              ressource['titre'],
                              style: TextStyle(
                                fontSize: 18.0,
                                fontWeight: FontWeight.bold,
                                color: Colors.blueAccent,
                              ),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                SizedBox(height: 5.0),
                                Text(
                                  'Date de création: ${ressource['dateCreation']}',
                                  style: TextStyle(
                                    fontSize: 14.0,
                                    color: Colors.black54,
                                  ),
                                ),
                                Text(
                                  'Propriétaire: ${ressource['proprietaire']['nom']} ${ressource['proprietaire']['prenom']}',
                                  style: TextStyle(
                                    fontSize: 14.0,
                                    color: Colors.black54,
                                  ),
                                ),
                                SizedBox(height: 5.0),
                                Row(
                                  children: [
                                    Text(
                                      'Statut: ',
                                      style: TextStyle(
                                        fontSize: 14.0,
                                        color: Colors.black54,
                                      ),
                                    ),
                                    _buildStatusTag(ressource['statut']['nomStatut']),
                                  ],
                                ),
                              ],
                            ),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  icon: Icon(Icons.edit, color: Colors.blue),
                                  onPressed: () {
                                    // redirection vers page modif
                                  },
                                ),
                                IconButton(
                                  icon: Icon(Icons.delete, color: Colors.red),
                                  onPressed: () {
                                    _deleteRessource(ressource['id']);
                                  },
                                ),
                                PopupMenuButton<String>(
                                  onSelected: (value) {
                                    switch (value) {
                                      case 'Accepter':
                                        _acceptResource(ressource['id']);
                                        break;
                                      case 'Refuser':
                                        _showRejectDialog(ressource['id']);
                                        break;
                                      case 'Suspendre':
                                        _suspendResource(ressource['id']);
                                        break;
                                    }
                                  },
                                  itemBuilder: (BuildContext context) {
                                    return ['Accepter', 'Refuser', 'Suspendre'].map((String choice) {
                                      return PopupMenuItem<String>(
                                        value: choice,
                                        child: Text(choice),
                                      );
                                    }).toList();
                                  },
                                  icon: Icon(Icons.more_vert, color: Colors.black),
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
