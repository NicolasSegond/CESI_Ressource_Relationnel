import 'package:flutter/material.dart';
import 'package:ressources_re_mobile/classes/Ressource.dart';
import 'package:ressources_re_mobile/utilities/authentification.dart';
import 'package:ressources_re_mobile/utilities/customFetch.dart';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';
import 'dart:convert';

class ModalOptions extends StatelessWidget {
  final int? currentUser;
  final Ressource? ressource;

  ModalOptions({required this.currentUser, required this.ressource});

   // Fonction pour effectuer la requête et afficher une alerte en fonction du résultat
  void addToFavorites(BuildContext context) async {
    Map<String, dynamic> response = await customFetchPost({
      'url': ApiConfig.apiUrl + '/api/progressions',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
      }, 
      'body': jsonEncode({
        'TypeProgression' : 'api/type_progressions/1',
        'Utilisateur' : 'api/utilisateurs/' + currentUser.toString(),
        'Ressource' : 'api/ressources/' + ressource!.id.toString()
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

  void addToMiseDeCote(BuildContext context) async{
Map<String, dynamic> response = await customFetchPost({
      'url': ApiConfig.apiUrl + '/api/progressions',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
      }, 
      'body': jsonEncode({
        'TypeProgression' : 'api/type_progressions/2',
        'Utilisateur' : 'api/utilisateurs/' + currentUser.toString(),
        'Ressource' : 'api/ressources/' + ressource!.id.toString()
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
                ],
              ),
            );
          },
        );
      },
    );
  }
}
