import 'dart:async';
import 'dart:convert';
import 'dart:html';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ressources_re_mobile/classes/Commentaire.dart';
import 'package:ressources_re_mobile/classes/HydraView.dart';
import 'package:ressources_re_mobile/classes/Ressource.dart';
import 'package:ressources_re_mobile/utilities/authentification.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';
import 'package:ressources_re_mobile/utilities/customFetch.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';


class Ressources_page extends StatefulWidget {
  final Ressource? uneRessource;
  const Ressources_page({Key? key, required this.uneRessource}) : super(key: key);

  @override
  _Ressources_pageState createState() => _Ressources_pageState();
}

class _Ressources_pageState extends State<Ressources_page> {
  final TextEditingController _commentaireController = TextEditingController();
  List<Commentaire> commentaires = [];
  HydraView hydraView = HydraView(id: '', first: '', last: '');
  bool isAddingComment = false;
  int maxLength = 499; // Maximum de caractères autorisé
  int remainingCharacters = 499; // Nombre de caractères restants
  Timer? debounceTimer;
  final storage = FlutterSecureStorage();
  bool tokenExists = false;
  int indexPage = 1;
  bool hasNextPage = false;
  // Méthode pour mettre à jour le nombre de caractères restants
  void updateMaxLength(String value) {
    setState(() {
      remainingCharacters = maxLength - value.length; // Mettre à jour le nombre de caractères restants
    });
  }

  @override
  void initState() {
    super.initState();
    fetchCommentaires();
    indexPage = 1;
    checkTokenExists();
  }

  @override
  void dispose() {
    _commentaireController.dispose();
    super.dispose();
  }

  Future<void> checkTokenExists() async {
    String? token = await storage.read(key: 'token');
    setState(() {
      tokenExists = token != null;
    });
  }
  Future<void> fetchCommentaires() async {
    final response = await customFetch({
      'url': 'http://127.0.0.1:8000/api/commentaires/${widget.uneRessource!.getId()}/ressources?page=${indexPage}&order%5Bdate%5D=desc',
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
      }
    },connecter: false);
    if (response['error'] == '') { 
      final dynamic result = json.decode(response['data']);
      final List<dynamic> members = result['hydra:member'];
      hydraView = HydraView.fromJson(result['hydra:view']);
      
      setState(() { // Mettez à jour l'état du widget avec setState
        commentaires = members.map((e) => Commentaire.fromJson(e)).toList();
        // Vérifiez si la longueur de la liste des commentaires est supérieure à zéro pour activer ou désactiver le bouton Page suivante
        if (members.isNotEmpty) {
          hasNextPage = true;
        } else {
          hasNextPage = false;
        }
      });
    } else {
      throw Exception('Réponse vide');
    }
  }

  void _addComment() async {
    if (_commentaireController.text.trim().length < 30) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Le commentaire doit contenir au moins 30 caractères')),
        );
      return;
    }

    setState(() {
      isAddingComment = true;
    });

    String commentaireContenu = _commentaireController.text;
    int userId = 0; 
    try {
      final Map<String, dynamic>? tokens = await getToken();

      if (tokens != null) {
        userId = await getIdUser(tokens);
      } else {
        throw Exception('Tokens non disponibles');
      }
    } catch (e) {
      print("Erreur lors de la récupération de l'ID utilisateur: $e");
    }

    Map<String, dynamic> requestBody = {
      "id": 0,
      "contenu": commentaireContenu,
      "utilisateur": "/api/utilisateurs/$userId",
      "ressource": "/api/ressources/${widget.uneRessource?.getId()}",
      "date": DateTime.now().toIso8601String(),
    };

    var response = await http.post(
      Uri.parse('http://127.0.0.1:8000/api/commentaires'),
      headers: <String, String>{
        'Content-Type': 'application/ld+json',
      },
      body: jsonEncode(requestBody),
    );

    if (response.statusCode == 201) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Commentaire ajouté avec succès')),
      );
      _commentaireController.clear(); // Effacer le texte de l'input après l'ajout du commentaire
      fetchCommentaires(); // Rafraîchir la liste des commentaires après l'ajout
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur lors de l\'ajout du commentaire')),
      );
    }

    setState(() {
      isAddingComment = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Ressources for Album ${widget.uneRessource!.getId()}'),
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
                    image: NetworkImage("http://127.0.0.1:8000/images/book/" + (widget.uneRessource?.getMiniature() ?? '')),
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
                                      (widget.uneRessource?.getTitre() ?? ''),
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
                                      (widget.uneRessource?.getDateCreation() ?? ""),
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
                                      (widget.uneRessource?.getDateModification() ?? "") + " ",
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
                                child: HtmlWidget(widget.uneRessource?.getContenu() ?? ""),
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
                                                  (widget.uneRessource?.getProprietaire()?.getNom() ?? "") +
                                                      " " +
                                                      (widget.uneRessource?.getProprietaire()?.getPrenom() ?? "") +
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
                                                SizedBox(width: 8),
                                                Text(
                                                  "Nombre de vues: ${widget.uneRessource?.getNombreVue() ?? 0}",
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
                                    // Utilisez un Column à la place de ListView.builder
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.stretch,
                                      children: commentaires.map((commentaire) => Card(
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
                                      )).toList(),
                                    ),
                                  ],
                                ),
                              ),
                              Padding(
                                padding: EdgeInsets.fromLTRB(0, 16, 0, 0),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    ElevatedButton(
                                      onPressed: () {
                                        // Décrémenter indexPage et recharger les commentaires
                                        setState(() {
                                          if (indexPage > 1) {
                                            indexPage--;
                                            fetchCommentaires();
                                          }
                                        });
                                      },
                                      child: Text("Page précédente"),
                                    ),
                                    Text(
                                      indexPage.toString(),
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                        color: Color.fromRGBO(3, 152, 158, 1),
                                      ),
                                    ),
                                    ElevatedButton(
                                    onPressed: hasNextPage ? () {
                                      // Incrémenter indexPage et recharger les commentaires
                                      setState(() {
                                        indexPage++;
                                        fetchCommentaires();
                                      });
                                    } : null, // Désactiver le bouton si hasNextPage est false
                                    child: Text("Page suivante"),
                                  ),
                                  ],
                                ),
                              ),
                            Padding(
                              padding: EdgeInsets.fromLTRB(0, 16, 0, 0),
                              child: Visibility(
                                visible: tokenExists, // Afficher seulement si tokenExists est vrai
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
                                      onChanged: (value) {
                                        updateMaxLength(value);
                                        if (debounceTimer != null) {
                                          debounceTimer!.cancel();
                                        }
                                        debounceTimer = Timer(Duration(seconds: 10), () {
                                          // Ajouter le commentaire après un délai de 10 secondes
                                        });
                                      },
                                      decoration: InputDecoration(
                                        hintText: "Votre commentaire",
                                        border: OutlineInputBorder(),
                                        counterText: "$remainingCharacters/499",
                                      ),
                                      maxLength: 499,
                                      maxLines: null,
                                    ),
                                    SizedBox(height: 8),
                                    ElevatedButton(
                                      onPressed: isAddingComment ? null : _addComment,
                                      child: Text("Ajouter"),
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