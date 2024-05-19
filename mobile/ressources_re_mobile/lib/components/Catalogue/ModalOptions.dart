import 'package:flutter/material.dart';
import 'package:ressources_re_mobile/classes/Ressource.dart';
import 'package:ressources_re_mobile/classes/Utilisateur.dart';
import 'package:ressources_re_mobile/utilities/authentification.dart';
import 'package:ressources_re_mobile/utilities/customFetch.dart';
import 'package:ressources_re_mobile/pages/catalogue_page.dart';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';
import 'dart:convert';

class ModalOptions extends StatelessWidget {
  final int? currentUser;
  final Ressource? ressource;
  final Function() onShareOrUnshare;

  ModalOptions(
      {required this.onShareOrUnshare,
      required this.currentUser,
      required this.ressource});

  // Fonction pour effectuer la requête et afficher une alerte en fonction du résultat
  void addToFavorites(BuildContext context) async {
    Map<String, dynamic> response = await customFetchPost({
      'url': ApiConfig.apiUrl + '/api/progressions',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
      },
      'body': jsonEncode({
        'TypeProgression': 'api/type_progressions/1',
        'Utilisateur': 'api/utilisateurs/' + currentUser.toString(),
        'Ressource': 'api/ressources/' + ressource!.id.toString()
      })
    }, connecter: true);

    if (response['error'] != '') {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erreur : ' + response['error']),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Ajout de la ressource en favoris avec succès'),
        ),
      );
    }
  }

  void addToMiseDeCote(BuildContext context) async {
    Map<String, dynamic> response = await customFetchPost({
      'url': ApiConfig.apiUrl + '/api/progressions',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
      },
      'body': jsonEncode({
        'TypeProgression': 'api/type_progressions/2',
        'Utilisateur': 'api/utilisateurs/' + currentUser.toString(),
        'Ressource': 'api/ressources/' + ressource!.id.toString()
      })
    }, connecter: true);
  

    if (response['error'] != '') {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erreur : ' + response['error']),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Ressource mise de côté avec succès'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: const Icon(
        Icons.more_vert,
        color: Color(0xff000000),
        size: 24,
      ),
      onPressed: () {
        showModalBottomSheet(
          context: context,
          builder: (BuildContext dialogContext) {
            return Container(
              padding: EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (currentUser == ressource?.getProprietaire()?.getId())
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.3),
                            spreadRadius: 2,
                            blurRadius: 5,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: TextButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        style: ButtonStyle(
                          backgroundColor: MaterialStateProperty.all<Color>(
                              Colors.transparent),
                        ),
                        child: Text(
                          'Supprimer la ressource',
                          style: TextStyle(
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ),
                  SizedBox(height: 16),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.3),
                          spreadRadius: 2,
                          blurRadius: 5,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: TextButton(
                      onPressed: () {
                        addToFavorites(context);
                        Navigator.pop(dialogContext);
                      },
                      style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all<Color>(
                            Colors.transparent),
                      ),
                      child: Text(
                        'Ajouter la ressource en favoris',
                        style: TextStyle(
                          color: Colors.black,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.3),
                          spreadRadius: 2,
                          blurRadius: 5,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: TextButton(
                      onPressed: () {
                        addToMiseDeCote(context);
                        Navigator.pop(dialogContext);
                      },
                      style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all<Color>(
                            Colors.transparent),
                      ),
                      child: Text(
                        'Mettre de côté la ressource',
                        style: TextStyle(
                          color: Colors.black,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                  if (currentUser == ressource?.getProprietaire()?.getId())
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.3),
                            spreadRadius: 2,
                            blurRadius: 5,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: TextButton(
                        onPressed: () {
                          Navigator.pop(dialogContext);
                          _showShareResourceDialog(
                              context); // Call function to show dialog
                        },
                        style: ButtonStyle(
                          backgroundColor: MaterialStateProperty.all<Color>(
                              Colors.transparent),
                        ),
                        child: Text(
                          'Partager la ressource',
                          style: TextStyle(
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showShareResourceDialog(BuildContext context) {
    List<String> selectedPeople = [];
    TextEditingController personController = TextEditingController();

    List<Utilisateur> voirRessources = ressource?.getVoirRessources() ?? [];

    print('Ressources: ' + (ressource?.getVoirRessources()?.toString() ?? ''));

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: Text('Partager la ressource'),
              content: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                        'Choisissez les personnes à partager la ressource avec:'),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: personController,
                      decoration: InputDecoration(
                        labelText: 'Nom de la personne',
                        hintText: 'Entrez le nom de la personne',
                      ),
                    ),
                    SizedBox(height: 10),
                    Text('Personnes sélectionnées:'),
                    SizedBox(height: 5),
                    Wrap(
                      spacing: 8.0,
                      runSpacing: 4.0,
                      children: [
                        for (Utilisateur user in voirRessources)
                          Chip(
                            label: Text(user?.getEmail() ?? 'Email inconnu'),
                            onDeleted: () async {
                              await _supprimerPartager(context, ressource!,
                                  user?.getEmail());
                              onShareOrUnshare();
                              Navigator.of(dialogContext).pop();
                            },
                          ),
                      ],
                    ),
                  ],
                ),
              ),
              actions: <Widget>[
                TextButton(
                  onPressed: () async {
                    String person = personController.text.trim();
                    if (person.isNotEmpty) {
                      List<String> peopleList = [person];

                      // Appeler la fonction pour ajouter les personnes sélectionnées
                      await _ajouterPartager(
                          context, ressource!, peopleList);
                      onShareOrUnshare();
                      Navigator.of(dialogContext).pop();
                    }
                  },
                  child: Text('Ajouter'),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.of(dialogContext).pop();
                  },
                  child: Text('Fermer'),
                ),
              ],
            );
          },
        );
      },
    );
  }
}

Future<void> _supprimerPartager(BuildContext context, Ressource ressource,
    String? userEmail) async {
  Map<String, dynamic> requestBody = {
    'utilisateur_id': userEmail,
  };

  Map<String, dynamic> response = await customFetchDelete({
    'url': ApiConfig.apiUrl + '/api/voir_ressources/${ressource.id}/voir',
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': jsonEncode(requestBody),
  }, connecter: true);

  if (response['error'] != '') {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Erreur : ' + response['error']),
      ),
    );
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Partage de la ressource effectué avec succès'),
      ),
    );
  }
}

Future<void> _ajouterPartager(BuildContext context, Ressource ressource,
    List<String> selectedPeople) async {
  Map<String, dynamic> requestBody = {
    'voirRessource': selectedPeople,
  };

  Map<String, dynamic> response = await customFetchPost({
    'url': ApiConfig.apiUrl + '/api/voir_ressources/${ressource.id}/voir',
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': jsonEncode(requestBody),
  }, connecter: true);

  if (response['error'] != '') {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Erreur : ' + response['error']),
      ),
    );
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Partage de la ressource effectué avec succès'),
      ),
    );
  }
}
