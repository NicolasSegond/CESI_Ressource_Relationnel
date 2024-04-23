import 'package:flutter/material.dart';
import 'package:ressources_re_mobile/classes/Ressource.dart';
import 'package:ressources_re_mobile/classes/Commentaire.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ressources_re_mobile/utilities/authentification.dart'; // Import du fichier d'authentification

import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';

class Ressources_page extends StatelessWidget {
  final Ressource? uneRessource;

  final TextEditingController _commentaireController = TextEditingController();

  Ressources_page({Key? key, required this.uneRessource}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Ressources for Album ${uneRessource!.getId()}'),
      ),
      backgroundColor: Color(0xffffffff),
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.max,
          children: [
            SizedBox(
              height: MediaQuery.of(context).size.height,
              width: MediaQuery.of(context).size.width,
              child: Stack(
                alignment: Alignment.topLeft,
                children: [
                  Image(
                    image: NetworkImage("http://127.0.0.1:8000/images/book/" + (uneRessource?.getMiniature() ?? '')),
                    height: 220,
                    width: MediaQuery.of(context).size.width,
                    fit: BoxFit.cover,
                  ),
                  Align(
                    alignment: Alignment.bottomCenter,
                    child: Container(
                      margin: EdgeInsets.all(0),
                      padding: EdgeInsets.all(0),
                      width: MediaQuery.of(context).size.width,
                      height: MediaQuery.of(context).size.height * 0.75,
                      decoration: BoxDecoration(
                        color: Color(0xffffffff),
                        shape: BoxShape.rectangle,
                        borderRadius: BorderRadius.circular(16.0),
                        border: Border.all(color: Color(0x4d9e9e9e), width: 1),
                      ),
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: SingleChildScrollView(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.start,
                                crossAxisAlignment: CrossAxisAlignment.center,
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Expanded(
                                    flex: 1,
                                    child: Text(
                                      (uneRessource?.getTitre() ?? ''),
                                      textAlign: TextAlign.start,
                                      overflow: TextOverflow.clip,
                                      style: TextStyle(
                                        fontWeight: FontWeight.w700,
                                        fontStyle: FontStyle.normal,
                                        fontSize: 20,
                                        color: Color(0xff000000),
                                      ),
                                    ),
                                  ),
                                  RatingBar.builder(
                                    initialRating: 1,
                                    unratedColor: Color(0xff9e9e9e),
                                    itemBuilder: (context, index) => Icon(
                                      Icons.star,
                                      color: Color(0xffffc107),
                                    ),
                                    itemCount: 1,
                                    itemSize: 22,
                                    direction: Axis.horizontal,
                                    allowHalfRating: false,
                                    onRatingUpdate: (value) {},
                                  ),
                                ],
                              ),
                              Row(
                                children: [
                                  Padding(
                                    padding: EdgeInsets.fromLTRB(0, 16, 8, 0),
                                    child: Text(
                                      (uneRessource?.getDateCreation() ?? ""),
                                      textAlign: TextAlign.start,
                                      overflow: TextOverflow.clip,
                                      style: TextStyle(
                                        fontWeight: FontWeight.w700,
                                        fontStyle: FontStyle.normal,
                                        fontSize: 14,
                                        color: Color.fromRGBO(3, 152, 158, 1),
                                      ),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsets.fromLTRB(0, 16, 0, 0),
                                    child: Text(
                                      (uneRessource?.getDateModification() ?? "") + " ",
                                      textAlign: TextAlign.start,
                                      overflow: TextOverflow.clip,
                                      style: TextStyle(
                                        fontWeight: FontWeight.w700,
                                        fontStyle: FontStyle.normal,
                                        fontSize: 14,
                                        color: Color.fromRGBO(3, 152, 158, 1),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              Padding(
                                padding: EdgeInsets.fromLTRB(0, 16, 0, 0),
                                child: HtmlWidget(uneRessource?.getContenu() ?? ""),
                              ),
                              Padding(
                                padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  mainAxisSize: MainAxisSize.max,
                                  children: [
                                    Expanded(
                                      flex: 1,
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.start,
                                        crossAxisAlignment: CrossAxisAlignment.center,
                                        mainAxisSize: MainAxisSize.max,
                                        children: [
                                          Padding(
                                            padding: EdgeInsets.fromLTRB(0, 16, 0, 0),
                                            child: Row(
                                              children: [
                                                Icon(
                                                  Icons.person,
                                                  color: Color.fromRGBO(3, 152, 158, 1),
                                                ),
                                                SizedBox(width: 8),
                                                Text(
                                                  (uneRessource?.getProprietaire()?.getNom() ?? "") +
                                                      " " +
                                                      (uneRessource?.getProprietaire()?.getPrenom() ?? "") +
                                                      " ",
                                                  textAlign: TextAlign.start,
                                                  overflow: TextOverflow.clip,
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.w700,
                                                    fontStyle: FontStyle.normal,
                                                    fontSize: 14,
                                                    color: Color.fromRGBO(3, 152, 158, 1),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Expanded(
                                      flex: 1,
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        crossAxisAlignment: CrossAxisAlignment.center,
                                        mainAxisSize: MainAxisSize.max,
                                        children: [
                                          Padding(
                                            padding: EdgeInsets.fromLTRB(0, 16, 0, 0),
                                            child: Row(
                                              children: [
                                                Icon(
                                                  Icons.visibility,
                                                  color: Color.fromRGBO(3, 152, 158, 1),
                                                ),
                                                SizedBox(width

: 8),
                                                Text(
                                                  "Nombre de vues: ${uneRessource?.getNombreVue() ?? 0}",
                                                  textAlign: TextAlign.start,
                                                  overflow: TextOverflow.clip,
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.w700,
                                                    fontStyle: FontStyle.normal,
                                                    fontSize: 14,
                                                    color: Color.fromRGBO(3, 152, 158, 1),
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
                              Padding(
                                padding: EdgeInsets.fromLTRB(0, 16, 0, 0),
                                child: SingleChildScrollView(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "Commentaires",
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                          color: Color.fromRGBO(3, 152, 158, 1),
                                        ),
                                      ),
                                      SizedBox(height: 8),
                                      ListView.builder(
                                        shrinkWrap: true,
                                        physics: NeverScrollableScrollPhysics(),
                                        itemCount: uneRessource?.getCommentaires().length ?? 0,
                                        itemBuilder: (context, index) {
                                          Commentaire commentaire = uneRessource!.getCommentaires()[index];
                                          return Card(
                                            elevation: 2,
                                            margin: EdgeInsets.symmetric(vertical: 4),
                                            child: Padding(
                                              padding: EdgeInsets.all(8),
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    "${commentaire.getUtilisateur()?.getNom() ?? ''} ${commentaire.getUtilisateur()?.getPrenom() ?? ''}",
                                                    style: TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 16,
                                                      color: Colors.black,
                                                    ),
                                                  ),
                                                  SizedBox(height: 4),
                                                  Text(
                                                    commentaire.getContenu() ?? "",
                                                    style: TextStyle(
                                                      fontSize: 14,
                                                    ),
                                                  ),
                                                  SizedBox(height: 4),
                                                  Text(
                                                    "${commentaire.getDate()?.toString() ?? ''}",
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          );
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              Padding(
                                padding: EdgeInsets.fromLTRB(0, 16, 0, 0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      "Ajouter un commentaire",
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                        color: Color.fromRGBO(3, 152, 158, 1),
                                      ),
                                    ),
                                    SizedBox(height: 8),
                                    TextField(
                                      controller: _commentaireController,
                                      decoration: InputDecoration(
                                        hintText: "Votre commentaire",
                                        border: OutlineInputBorder(),
                                      ),
                                      maxLines: null,
                                    ),
                                    SizedBox(height: 8),
                                    ElevatedButton(
                                      onPressed: () async {
                                        // Capture du contenu du commentaire saisi par l'utilisateur
                                        String commentaireContenu = _commentaireController.text;

                                        // Obtention de l'ID de l'utilisateur connecté
                                        int userId = 0; // Initialisation de userId avec une valeur par défaut
                                        try {
                                          // Obtenez les tokens d'authentification
                                          final Map<String, dynamic>? tokens = await getToken();

                                          if (tokens != null) {
                                            // Si les tokens sont disponibles, obtenez l'ID de l'utilisateur
                                            userId = await getIdUser(tokens);
                                          } else {
                                            throw Exception('Tokens non disponibles');
                                          }
                                        } catch (e) {
                                          print("Erreur lors de la récupération de l'ID utilisateur: $e");
                                          // Gérez l'erreur selon vos besoins
                                        }

                                        // Construction de l'URL de l'utilisateur
                                        String utilisateurUrl = 'http://127.0.0.1:8000/api/utilisateurs/$userId';

                                        // Construction du corps de la requête
                                        Map<String, dynamic> requestBody = {
                                          "contenu": commentaireContenu,
                                          "utilisateur": utilisateurUrl,
                                          "date": DateTime.now().toIso8601String(),
                                        };

                                        // Envoi de la requête HTTP POST
                                        var response = await http.post(
                                          Uri.parse('http://127.0.0.1:8000/api/commentaires'),
                                          headers: <String, String>{
                                            'Content-Type': 'application/json; charset=UTF-8',
                                          },
                                          body: jsonEncode(requestBody),
                                        );

                                        // Traitement de la réponse de la requête
                                        if (response.statusCode == 201) {
                                          // Si la création du commentaire réussit
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            SnackBar(content: Text('Commentaire ajouté avec succès')),
                                          );
                                        } else {
                                          // Si la création du commentaire échoue
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            SnackBar(content: Text('Erreur lors de l\'ajout du commentaire')),
                                          );
                                        }
                                      },
                                      child: Text("Ajouter"),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
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