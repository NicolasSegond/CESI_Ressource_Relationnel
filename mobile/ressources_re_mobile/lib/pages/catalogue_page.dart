// ignore_for_file: camel_case_types, library_private_types_in_public_api

import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ressources_re_mobile/classes/Ressource.dart';

class Catalogue extends StatefulWidget {
  const Catalogue({Key? key}) : super(key: key);

  @override
  _CatalogueState createState() => _CatalogueState();
}

class _CatalogueState extends State<Catalogue> {
  late List<Ressource> albums;

  List<dynamic> visibilites = [
    {"id": 1, "name": "Public"},
    {"id": 2, "name": "Privé"},
    {"id": 3, "name": "Partagé"}
  ];
  List<dynamic> categories = [];
  List<dynamic> relationTypes = [];
  List<dynamic> resourceTypes = [];

  Map<String, List<int>> selectedFilters = {
    'visibilite': [1],
    'categorie': [],
    'typeRelations': [],
    'typeDeRessource': [],
  };

  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  String buildUrlWithFilters(Map<String, List<int>> filters) {
    Map<String, List<String>> params = {
      'page': ['1'],
      'visibilite': filters.containsKey('visibilite') ? filters['visibilite']!.map((v) => v.toString()).toList() : [],
      'categorie[]': filters.containsKey('categorie') ? filters['categorie']!.map((v) => v.toString()).toList() : [],
      'typeDeRessource[]': filters.containsKey('typeDeRessource') ? filters['typeDeRessource']!.map((v) => v.toString()).toList() : [],
      'typeRelations[]': filters.containsKey('typeRelations') ? filters['typeRelations']!.map((v) => v.toString()).toList() : [],
    };

    if (params.containsKey('visibilite') && params['visibilite']!.contains('2')) {
      params['proprietaire'] = ['9'];
    }

    if (params.containsKey('visibilite') && params['visibilite']!.contains('3')) {
      params['voirRessource'] = ['9'];
    }

    return Uri.http('127.0.0.1:8000', '/api/ressources', params).toString();
  }

  Future<List<Ressource>> fetchAlbum() async {
    String url = buildUrlWithFilters(selectedFilters);

    print(url);

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final dynamic result = json.decode(response.body);
      final List<dynamic> members = result['hydra:member'];

      for(var member in members) {
        print(member['id']);
      }

      return members.map((e) => Ressource.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load data');
    }
  }

  Future<void> fetchData() async {
    setState(() {
      isLoading = true;
    });

    final response =
        await http.get(Uri.parse('http://127.0.0.1:8000/api/options'));
    if (response.statusCode == 200) {
      Map<String, dynamic> data = json.decode(response.body);
      setState(() {
        categories = data['categories'];
        relationTypes = data['relationTypes'];
        resourceTypes = data['resourceTypes'];
        isLoading = false;
      });

      // Appel à fetchAlbum() lors de l'initialisation des données
      fetchAlbum();
    } else {
      throw Exception('Failed to load data');
    }
  }

  void _openFilterModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            return Padding(
              padding: EdgeInsets.only(left: 20),
              child: Container(
                height: MediaQuery.of(context).size.height * 0.7,
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      _buildFilter('Visibilités : ','visibilite', visibilites, setState),
                      _buildFilter('Catégories : ','categorie', categories, setState),
                      _buildFilter('Type de relations : ', 'typeRelations', relationTypes, setState),
                      _buildFilter('Type de ressources : ','typeDeRessource', resourceTypes, setState),
                      SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          fetchAlbum();
                        },
                        child: Text('Appliquer les filtres'),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xffffffff),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Align(
            alignment: Alignment.centerLeft,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(10, 10, 0, 0),
              child: OutlinedButton(
                onPressed: () {
                  _openFilterModal(context);
                },
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Colors.grey),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Ouvrir les filtres',
                  style: TextStyle(color: Colors.black),
                ),
              ),
            ),
          ),
          FutureBuilder(
            future: fetchAlbum(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return Center(
                  child: CircularProgressIndicator(),
                );
              } else if (snapshot.hasError) {
                return Center(
                  child: Text('Erreur de chargement des données'),
                );
              } else {
                albums = snapshot.data;
                return Expanded(
                  child: ListView.builder(
                    itemCount: albums.length,
                    itemBuilder: (context, index) {
                      final album = albums[index];
                      return GestureDetector(
                        onTap: () {
                          print('Album tapped: $index');
                        },
                        child: Container(
                          margin: const EdgeInsets.all(10),
                          padding: const EdgeInsets.all(0),
                          decoration: BoxDecoration(
                            color: const Color(0x1fffffff),
                            shape: BoxShape.rectangle,
                            borderRadius: BorderRadius.circular(15.0),
                            border: Border.all(
                              color: const Color(0x4d9e9e9e),
                              width: 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                margin: const EdgeInsets.all(0),
                                padding: const EdgeInsets.all(0),
                                width: double.infinity,
                                height: 90,
                                decoration: BoxDecoration(
                                  color: const Color(0x1f000000),
                                  shape: BoxShape.rectangle,
                                  borderRadius: const BorderRadius.only(
                                    topLeft: Radius.circular(15.0),
                                    topRight: Radius.circular(15.0),
                                  ),
                                  border: Border.all(
                                    color: const Color(0x4d9e9e9e),
                                    width: 1,
                                  ),
                                ),
                                child: Stack(
                                  alignment: Alignment.topLeft,
                                  children: [
                                    Opacity(
                                      opacity: 0.5,
                                      child: ClipRRect(
                                        borderRadius: const BorderRadius.only(
                                          topLeft: Radius.circular(15.0),
                                          topRight: Radius.circular(15.0),
                                        ),
                                        child: Image(
                                          image: NetworkImage("http://127.0.0.1:8000/images/book/${album.getMiniature()}"),
                                          height: 100,
                                          width: MediaQuery.of(context).size.width,
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                    Align(
                                      alignment: Alignment.bottomCenter,
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.start,
                                        crossAxisAlignment: CrossAxisAlignment.center,
                                        mainAxisSize: MainAxisSize.max,
                                        children: [
                                          Align(
                                            alignment: const Alignment(0.0, 0.9),
                                            child: Padding(
                                              padding: const EdgeInsets.fromLTRB(10, 0, 0, 0),
                                              child: ClipRRect(
                                                borderRadius: BorderRadius.circular(15.0),
                                                child: Image.network(
                                                  "http://127.0.0.1:8000/images/book/valorisation-engagement-png-220-6602ffd2787b5.png",
                                                  height: 100,
                                                  width: MediaQuery.of(context).size.width,
                                                  fit: BoxFit.cover,
                                                ),
                                              ),
                                            ),
                                          ),
                                          Padding(
                                            padding: const EdgeInsets.fromLTRB(10, 0, 0, 0),
                                            child: Align(
                                              alignment: Alignment(0.0, 0.6),
                                              child: Text(
                                                album.getProprietaire()!.getNom()!,
                                                textAlign: TextAlign.start,
                                                overflow: TextOverflow.clip,
                                                style: TextStyle(
                                                  fontWeight: FontWeight.w400,
                                                  fontStyle: FontStyle.normal,
                                                  fontSize: 14,
                                                  color: const Color(0xffffffff),
                                                ),
                                              ),
                                            ),
                                          ),
                                          Expanded(
                                            flex: 1,
                                            child: Row(
                                              mainAxisAlignment: MainAxisAlignment.end,
                                              crossAxisAlignment: CrossAxisAlignment.end,
                                              children: [
                                                Padding(
                                                  padding: const EdgeInsets.fromLTRB(0, 10, 10, 0),
                                                  child: Align(
                                                    alignment: const Alignment(0.8, -0.8),
                                                    child: IconButton(
                                                      icon: const Icon(
                                                        Icons.more_vert,
                                                        color: Color(0xff000000),
                                                        size: 24,
                                                      ),
                                                      onPressed: () {
                                                        print('More button tapped');
                                                      },
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                margin: const EdgeInsets.all(0),
                                padding: const EdgeInsets.all(0),
                                width: double.infinity,
                                height: 90,
                                decoration: BoxDecoration(
                                  color: const Color(0x1fffffff),
                                  shape: BoxShape.rectangle,
                                  borderRadius: const BorderRadius.only(
                                    bottomLeft: Radius.circular(15.0),
                                    bottomRight: Radius.circular(15.0),
                                  ),
                                  border: Border.all(
                                    color: const Color(0x4d9e9e9e),
                                    width: 1,
                                  ),
                                ),
                                child: Align(
                                  alignment: Alignment.centerLeft,
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 10),
                                    child: Column(
                                      mainAxisAlignment: MainAxisAlignment.start,
                                      crossAxisAlignment: CrossAxisAlignment.center,
                                      mainAxisSize: MainAxisSize.max,
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                                          child: Align(
                                            alignment: Alignment.centerLeft,
                                            child: Text(
                                              album.getTitre()!,
                                              textAlign: TextAlign.start,
                                              overflow: TextOverflow.clip,
                                              style: TextStyle(
                                                fontWeight: FontWeight.w400,
                                                fontStyle: FontStyle.normal,
                                                fontSize: 14,
                                                color: const Color(0xff000000),
                                              ),
                                            ),
                                          ),
                                        ),
                                        Align(
                                          alignment: Alignment.centerLeft,
                                          child: Text(
                                            album.getDateCreation().toString(),
                                            textAlign: TextAlign.start,
                                            overflow: TextOverflow.clip,
                                            style: TextStyle(
                                              fontWeight: FontWeight.w300,
                                              fontStyle: FontStyle.normal,
                                              fontSize: 12,
                                              color: const Color(0xff000000),
                                            ),
                                          ),
                                        ),
                                        Expanded(
                                          flex: 1,
                                          child: Align(
                                            alignment: const Alignment(0.0, -0.5),
                                            child: Row(
                                              mainAxisAlignment: MainAxisAlignment.start,
                                              crossAxisAlignment: CrossAxisAlignment.center,
                                              mainAxisSize: MainAxisSize.max,
                                              children: [
                                                Chip(
                                                  labelPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 4),
                                                  label: const Text("Chip View"),
                                                  labelStyle: const TextStyle(
                                                    fontSize: 14,
                                                    fontWeight: FontWeight.w400,
                                                    fontStyle: FontStyle.normal,
                                                    color: const Color(0xffffffff),
                                                  ),
                                                  backgroundColor: const Color(0xff3a57e8),
                                                  elevation: 0,
                                                  shadowColor: const Color(0xff808080),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius: BorderRadius.circular(16.0),
                                                  ),
                                                ),
                                                Chip(
                                                  labelPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 4),
                                                  label: const Text("Chip View"),
                                                  labelStyle: const TextStyle(
                                                    fontSize: 14,
                                                    fontWeight: FontWeight.w400,
                                                    fontStyle: FontStyle.normal,
                                                    color: const Color(0xffffffff),
                                                  ),
                                                  backgroundColor: const Color(0xff3a57e8),
                                                  elevation: 0,
                                                  shadowColor: const Color(0xff808080),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius: BorderRadius.circular(16.0),
                                                  ),
                                                ),
                                                Chip(
                                                  labelPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 4),
                                                  label: const Text("Chip View"),
                                                  labelStyle: const TextStyle(
                                                    fontSize: 14,
                                                    fontWeight: FontWeight.w400,
                                                    fontStyle: FontStyle.normal,
                                                    color: const Color(0xffffffff),
                                                  ),
                                                  backgroundColor: const Color(0xff3a57e8),
                                                  elevation: 0,
                                                  shadowColor: const Color(0xff808080),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius: BorderRadius.circular(16.0),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                );
              }
            },
          )
        ],
      ),
    );
  }

  Widget _buildFilter(String title, String filterName, List<dynamic> items, StateSetter setState) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(8.0, 8.0, 8.0, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            title,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
          SizedBox(height: 10),
          if (filterName == 'visibilite')
            Column(
              children: items.map<Widget>((item) {
                bool isSelected = selectedFilters[filterName]!.contains(item['id']);
                return RadioListTile(
                  title: Text(item['name']),
                  value: item['id'],
                  groupValue: selectedFilters[filterName]!.isEmpty ? null : selectedFilters[filterName]![0],
                  onChanged: (selected) {
                    setState(() {
                      if (selected != null) {
                        selectedFilters[filterName] = [selected];
                      }
                    });
                    updateMainPage();
                  },
                );
              }).toList(),
            )
          else
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: items.map<Widget>((item) {
                bool isSelected = selectedFilters[filterName]!.contains(item['id']);
                return ChoiceChip(
                  label: Text(item['name']),
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        selectedFilters[filterName]!.add(item['id']);
                      } else {
                        selectedFilters[filterName]!.remove(item['id']);
                      }
                    });
                    // Mettre à jour l'état de la page principale
                    updateMainPage();
                  },
                  selectedColor: Colors.blue,
                  labelStyle:
                  TextStyle(color: isSelected ? Colors.white : Colors.black),
                  backgroundColor: Colors.grey[300],
                  elevation: isSelected ? 4 : 0,
                  pressElevation: isSelected ? 8 : 0,
                  shadowColor: isSelected ? Colors.blue : Colors.transparent,
                );
              }).toList(),
            ),
        ],
      ),
    );
  }


  void updateMainPage() {
    setState(() {});
  }
}

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Catalogue(),
    );
  }
}
