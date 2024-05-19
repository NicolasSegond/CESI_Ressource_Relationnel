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
      home: GestionCategories(),
    );
  }
}

class GestionCategories extends StatefulWidget {
  @override
  _GestionCategoriesState createState() => _GestionCategoriesState();
}

class _GestionCategoriesState extends State<GestionCategories> {
  late Future<List<dynamic>> futureCategories;
  List<dynamic> categories = [];
  int _currentPage = 1;
  int _totalPages = 1;
  HydraView hydraView = HydraView(id: '', first: '', last: '');

  @override
  void initState() {
    super.initState();
    futureCategories = fetchCategories(_currentPage);
  }

  Future<List<dynamic>> fetchCategories(int page) async {
    Map<String, dynamic> response = await customFetch({
      'url': ApiConfig.apiUrl + '/api/categories?page=$page',
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
      },
    });

    if (response['error'] == '') {
      final dynamic result = json.decode(response['data']);
      final List<dynamic> members = result['hydra:member'];

      setState(() {
        categories = members;
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
      });
      return members;
    } else {
      if (response['error'].contains("DECONNEXION NECESSAIRE")) {
        Navigator.pushReplacementNamed(context, '/connexion');
      } else {
        throw Exception('Failed to load categories');
      }
    }
    return [];
  }

  void _showAddCategoryModal(BuildContext context) {
    final TextEditingController nameController = TextEditingController();
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Ajouter une catégorie'),
          content: TextField(
            controller: nameController,
            decoration: InputDecoration(labelText: 'Nom'),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Annuler'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Ajouter'),
              onPressed: () async {
                await _addCategory(nameController.text);
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _addCategory(String name) async {
    Map<String, dynamic> response = await customFetchPost({
      'url': ApiConfig.apiUrl + '/api/categories',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
      },
      'body': json.encode({'nom': name}),
    }, connecter: true);

    if (response['error'] == '') {
      setState(() {
        futureCategories = fetchCategories(_currentPage);
      });
    } else {
      throw Exception('Failed to add category');
    }
  }

  void _showEditCategoryModal(BuildContext context, int idCategorie, String currentName) {
    final TextEditingController nameController = TextEditingController();
    nameController.text = currentName;
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Modifier la catégorie'),
          content: TextField(
            controller: nameController,
            decoration: InputDecoration(labelText: 'Nom'),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Annuler'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Modifier'),
              onPressed: () async {
                await _editCategory(idCategorie, nameController.text);
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _editCategory(int idCategorie, String name) async {
    Map<String, dynamic> response = await customFetchPatch({
      'url': ApiConfig.apiUrl + '/api/categories/$idCategorie',
      'method': 'PATCH',
      'headers': {
        'Content-Type': 'application/merge-patch+json',
      },
      'body': json.encode({'nom': name}),
    }, connecter: true);

    if (response['error'] == '') {
      setState(() {
        futureCategories = fetchCategories(_currentPage);
      });
    } else {
      throw Exception('Failed to edit category');
    }
  }

  Future<void> _deleteCategory(int categorieID) async {
    Map<String, dynamic> response = await customFetchDelete({
      'url': ApiConfig.apiUrl + '/api/categories/$categorieID',
      'method': 'DELETE',
      'headers': {
        'Content-Type': 'application/json',
      },
    }, connecter: true);

    if (response['error'] == '') {
      setState(() {
        futureCategories = fetchCategories(_currentPage);
      });
    } else {
      throw Exception('Failed to delete category');
    }
  }

  void _previousPage() {
    if (_currentPage > 1) {
      setState(() {
        _currentPage--;
        futureCategories = fetchCategories(_currentPage);
      });
    }
  }

  void _nextPage() {
    if (_currentPage < _totalPages) {
      setState(() {
        _currentPage++;
        futureCategories = fetchCategories(_currentPage);
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
              child: FutureBuilder<List<dynamic>>(
                future: futureCategories,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else {
                    return ListView.builder(
                      itemCount: categories.length,
                      itemBuilder: (context, index) {
                        final category = categories[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(vertical: 10.0),
                          elevation: 4.0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(10.0),
                            child: ListTile(
                              title: Text(category['nom']),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon: Icon(Icons.edit),
                                    onPressed: () {
                                      _showEditCategoryModal(context, category['id'], category['nom']);
                                    },
                                  ),
                                  IconButton(
                                    icon: Icon(Icons.delete),
                                    onPressed: () {
                                      _deleteCategory(category['id']);
                                    },
                                  ),
                                ],
                              ),
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
            SizedBox(height: 10.0),
            ElevatedButton(
              onPressed: () {
                _showAddCategoryModal(context);
              },
              child: Text('Ajouter une catégorie'),
            ),
          ],
        ),
      ),
    );
  }
}
