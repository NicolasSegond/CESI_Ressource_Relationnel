// ignore_for_file: camel_case_types, library_private_types_in_public_api

import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ressources_re_mobile/classes/Ressource.dart';
import 'package:ressources_re_mobile/classes/HydraView.dart';
import 'package:ressources_re_mobile/components/Catalogue/ModalOptions.dart';
import 'package:ressources_re_mobile/components/Catalogue/MoreButton.dart';

import 'package:ressources_re_mobile/pages/ressource_page.dart';

import 'package:ressources_re_mobile/services/connect.dart';
import 'package:ressources_re_mobile/utilities/authentification.dart';
import 'package:ressources_re_mobile/utilities/customFetch.dart';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';
import 'package:ressources_re_mobile/components/Catalogue/LessButton.dart';


class Catalogue extends StatefulWidget {
  const Catalogue({Key? key}) : super(key: key);

  @override
  _CatalogueState createState() => _CatalogueState();
}

class _CatalogueState extends State<Catalogue> {
  late List<Ressource> albums;
  int currentPage = 1; // Variable pour suivre le numéro de la page actuelle
  int? userId; // Variable pour stocker l'ID de l'utilisateur
  HydraView hydraView = HydraView(id: '', first: '', last: '');

  List<dynamic> visibilites = [
    {"id": 1, "name": "Public"},
    {"id": 2, "name": "Privé"},
    {"id": 3, "name": "Partagé"},
    {"id": 4, "name": "Mes ressources"}
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
    fetchUserId();
    fetchData();
  }

  void updatePage(int newPage) {
    setState(() {
      currentPage = newPage;
    });
  }
  

  String buildUrlWithFilters(Map<String, List<int>> filters) {
    Map<String, List<String>> params = {
      'page': [currentPage.toString()],
      'visibilite':
          filters.containsKey('visibilite') || filters['visibilite'] != '4'
              ? filters['visibilite']!.map((v) => v.toString()).toList()
              : [],
      'categorie[]': filters.containsKey('categorie')
          ? filters['categorie']!.map((v) => v.toString()).toList()
          : [],
      'typeDeRessource[]': filters.containsKey('typeDeRessource')
          ? filters['typeDeRessource']!.map((v) => v.toString()).toList()
          : [],
      'typeRelations[]': filters.containsKey('typeRelations')
          ? filters['typeRelations']!.map((v) => v.toString()).toList()
          : [],
      'statut': ['1'],
      'valide': ['true']
    };

    if (params.containsKey('visibilite') &&
        params['visibilite']!.contains('2')) {
      params['proprietaire'] = [userId.toString()];
    }

    if (params.containsKey('visibilite') &&
        params['visibilite']!.contains('3')) {
      params['voirRessource'] = [userId.toString()];
    }

    if (params.containsKey('visibilite') &&
        params['visibilite']!.contains('4')) {
      params['proprietaire'] = [userId.toString()];
      params['visibilite'] = [];
    }

    return Uri.http(ApiConfig.url, '/api/ressources', params).toString();
  }

  Future<List<Ressource>> fetchAlbum() async {
    String url = buildUrlWithFilters(selectedFilters);
    
    print(url);

    Map<String, dynamic> response = await customFetch({
      'url': url,
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
      }
    }, connecter: false);

      print(response['error']);
    if (response['error'] == '') {
      final dynamic result = json.decode(response['data']);
      final List<dynamic> members = result['hydra:member'];

      hydraView = HydraView.fromJson(result['hydra:view']);

      return members.map((e) => Ressource.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load data');
    }
  }

  Future<void> fetchData() async {
    setState(() {
      isLoading = true;
    });

    Map<String, dynamic> response = await customFetch({
      'url': ApiConfig.apiUrl + '/api/options',
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
      }
    }, connecter: false);

    if (response['error'] != '') {
      throw Exception('Failed to load data: ${response['error']}');
    } else {
      Map<String, dynamic> data = json.decode(response['data']);
      setState(() {
        categories = data['categories'];
        relationTypes = data['relationTypes'];
        resourceTypes = data['resourceTypes'];
        isLoading = false;
      });
    }
  }

  Future<void> fetchUserId() async {
    try {
      print('ça passe');
      // Récupérer les tokens de l'utilisateur
      final tokens = await getTokenDisconnected();

      // Appeler la fonction pour extraire l'ID de l'utilisateur
      if(tokens != null){
        final id = await getIdUser(tokens!);

        // Mettre à jour l'ID de l'utilisateur dans l'état de la page
      setState(() {
        userId = id;
      });
      }
    } catch (e) {
      print('Une erreur s\'est produite lors de la récupération de l\'ID de l\'utilisateur : $e');
    }
  }

  void _openFilterModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            return Padding(
              padding: const EdgeInsets.only(left: 20),
              child: Container(
                height: MediaQuery.of(context).size.height * 0.7,
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      userId != null
                          ? _buildFilter(
                              'Visibilités : ',
                              'visibilite',
                              visibilites,
                              setState,
                            )
                          : Container(),
                      _buildFilter(
                        'Catégories : ',
                        'categorie',
                        categories,
                        setState,
                      ),
                      _buildFilter(
                        'Type de relations : ',
                        'typeRelations',
                        relationTypes,
                        setState,
                      ),
                      _buildFilter(
                        'Type de ressources : ',
                        'typeDeRessource',
                        resourceTypes,
                        setState,
                      ),
                      SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          currentPage = 1;
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
          userId != null
              ? Padding(
                  padding: const EdgeInsets.all(10.0),
                  child: Text(
                    'ID utilisateur : $userId',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                )
              : Container(),
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
          Expanded(
            child: FutureBuilder(
              future: fetchAlbum(),
              builder: (BuildContext context, AsyncSnapshot snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(
                    child: CircularProgressIndicator(),
                  );
                } else if (snapshot.hasError) {
                  return Center(
                    child: Text(snapshot.error.toString()),
                  );
                } else {
                  albums = snapshot.data;
                  return ListView.builder(
                    itemCount: albums.length + 1,
                    itemBuilder: (context, index) {
                      if (index == albums.length) {
                        if (hydraView.id != hydraView.last ||
                            hydraView.id == '') {
                          return Row(
                            children: [
                              if (hydraView.id != hydraView.last ||
                                  hydraView.id == '')
                                Expanded(
                                  child: MoreButton(
                                    currentPage: currentPage,
                                    fetchAlbum: fetchAlbum,
                                    updatePage: updatePage,
                                  ),
                                ),
                              if (index == albums.length - 1 &&
                                  hydraView.first != hydraView.id)
                                Expanded(
                                  child: Padding(
                                    padding: const EdgeInsets.all(10),
                                    child: LessButton(
                                      currentPage: currentPage,
                                      fetchAlbum: fetchAlbum,
                                      updatePage: updatePage,
                                    ),
                                  ),
                                ),
                            ],
                          );
                        }
                      } else if (index == albums.length - 1 &&
                          hydraView.first != hydraView.id) {
                        return Row(
                          children: [
                            Expanded(
                              child: Padding(
                                padding: const EdgeInsets.all(10),
                                child: LessButton(
                                  currentPage: currentPage,
                                  fetchAlbum: fetchAlbum,
                                  updatePage: updatePage,
                                ),
                              ),
                            ),
                          ],
                        );
                      } else {
                        final album = albums[index];
                        return GestureDetector(
                         onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => Ressources_page(uneRessource: album),
                              ),
                            );
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
                                    color: const Color(0x1fffffff),
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
                                            image: NetworkImage(
                                                "http://127.0.0.1:8000/images/book/" +
                                                    album.getMiniature()!),
                                            height: 100,
                                            width: MediaQuery.of(context)
                                                .size
                                                .width,
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                      Align(
                                        alignment: Alignment.bottomCenter,
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.start,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.center,
                                          mainAxisSize: MainAxisSize.max,
                                          children: [
                                            Align(
                                              alignment: const Alignment(0.0, 0.9),
                                              child: Padding(
                                                padding:
                                                    const EdgeInsets.fromLTRB(
                                                        10, 0, 0, 0),
                                                child: ClipRRect(
                                                  borderRadius:
                                                      BorderRadius.circular(15.0),
                                                  child: Image(
                                                    image: const NetworkImage(
                                                        "https://picsum.photos/250?image=9"),
                                                    height: 40,
                                                    width: 40,
                                                    fit: BoxFit.cover,
                                                  ),
                                                ),
                                              ),
                                            ),
                                            Padding(
                                              padding:
                                                  const EdgeInsets.fromLTRB(
                                                      10, 0, 0, 0),
                                              child: Align(
                                                alignment: Alignment(0.0, 0.6),
                                                child: Text(
                                                  album.getProprietaire()!
                                                          .getNom()! +
                                                      ' ' +
                                                      album.getProprietaire()!
                                                          .getPrenom()!,
                                                  textAlign: TextAlign.start,
                                                  overflow: TextOverflow.clip,
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.w600,
                                                    fontStyle: FontStyle.normal,
                                                    fontSize: 14,
                                                    color: const Color(0xff000000),
                                                  ),
                                                ),
                                              ),
                                            ),
                                            Expanded(
                                              flex: 1,
                                              child: Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.end,
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.end,
                                                children: [
                                                  Padding(
                                                    padding:
                                                        const EdgeInsets.fromLTRB(
                                                            0, 5, 5, 0),
                                                    child: Align(
                                                      alignment: const Alignment(
                                                          0.8, -0.8),
                                                      child: ModalOptions(
                                                          currentUser: '8',
                                                          ressourceProprietaire:
                                                              album
                                                                  .getProprietaire()!
                                                                  .getId()!
                                                                  .toString()),
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
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 0, horizontal: 10),
                                      child: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.start,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.center,
                                        mainAxisSize: MainAxisSize.max,
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.fromLTRB(
                                                0, 10, 0, 0),
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
                                              album
                                                  .getDateCreation()
                                                  .toString(),
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
                                              alignment:
                                                  const Alignment(0.0, -0.5),
                                              child: SingleChildScrollView(
                                                scrollDirection:
                                                    Axis.horizontal,
                                                child: Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment.start,
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.center,
                                                  mainAxisSize: MainAxisSize.min,
                                                  children: [
                                                    // Type de relation
                                                    ...album
                                                        .getTypeRelations()!
                                                        .map((chip) {
                                                      return Padding(
                                                        padding:
                                                            const EdgeInsets.only(
                                                                right: 5.0),
                                                        child: Chip(
                                                          labelPadding:
                                                              const EdgeInsets
                                                                  .symmetric(
                                                            vertical: 0,
                                                            horizontal: 4,
                                                          ),
                                                          label: Text(
                                                            chip.getLibelle()!,
                                                          ),
                                                          labelStyle:
                                                              const TextStyle(
                                                            fontSize: 14,
                                                            fontWeight:
                                                                FontWeight.w400,
                                                            fontStyle:
                                                                FontStyle.normal,
                                                            color: const Color(
                                                                0xffffffff),
                                                          ),
                                                          backgroundColor:
                                                              const Color(
                                                                  0xff3a57e8),
                                                          elevation: 0,
                                                          shadowColor:
                                                              const Color(
                                                                  0xff808080),
                                                          shape:
                                                              RoundedRectangleBorder(
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        16.0),
                                                          ),
                                                        ),
                                                      );
                                                    }),
                                                    // Catégorie
                                                    Padding(
                                                      padding:
                                                          const EdgeInsets.only(
                                                              right: 5.0),
                                                      child: Chip(
                                                        labelPadding:
                                                            const EdgeInsets
                                                                .symmetric(
                                                          vertical: 0,
                                                          horizontal: 4,
                                                        ),
                                                        label: Text(
                                                          album
                                                              .getCategorie()!
                                                              .getNom()!,
                                                        ),
                                                        labelStyle:
                                                            const TextStyle(
                                                          fontSize: 14,
                                                          fontWeight:
                                                              FontWeight.w400,
                                                          fontStyle:
                                                              FontStyle.normal,
                                                          color: const Color(
                                                              0xff000000),
                                                        ),
                                                        backgroundColor:
                                                            Color(0xFFFFFFF),
                                                        elevation: 0,
                                                        shadowColor:
                                                            const Color(
                                                                0xff808080),
                                                        shape:
                                                            RoundedRectangleBorder(
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(
                                                                      16.0),
                                                        ),
                                                      ),
                                                    ),
                                                    // Type de ressource
                                                    Padding(
                                                      padding:
                                                          const EdgeInsets.only(
                                                              right: 5.0),
                                                      child: Chip(
                                                        labelPadding:
                                                            const EdgeInsets
                                                                .symmetric(
                                                          vertical: 0,
                                                          horizontal: 4,
                                                        ),
                                                        label: Text(
                                                          album
                                                              .getTypeDeRessource()!
                                                              .getLibelle()!,
                                                        ),
                                                        labelStyle:
                                                            const TextStyle(
                                                          fontSize: 14,
                                                          fontWeight:
                                                              FontWeight.w400,
                                                          fontStyle:
                                                              FontStyle.normal,
                                                          color: const Color(
                                                              0xffffffff),
                                                        ),
                                                        backgroundColor:
                                                            Colors.red[600],
                                                        elevation: 0,
                                                        shadowColor:
                                                            const Color(
                                                                0xff808080),
                                                        shape:
                                                            RoundedRectangleBorder(
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(
                                                                      16.0),
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
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }
                    },
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilter(String title, String filterName, List<dynamic> items,
      StateSetter setState) {
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
                bool isSelected =
                    selectedFilters[filterName]!.contains(item['id']);
                return RadioListTile(
                  title: Text(item['name']),
                  value: item['id'],
                  groupValue: selectedFilters[filterName]!.isEmpty
                      ? null
                      : selectedFilters[filterName]![0],
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
                bool isSelected =
                    selectedFilters[filterName]!.contains(item['id']);
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
                  labelStyle: TextStyle(
                      color: isSelected ? Colors.white : Colors.black),
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