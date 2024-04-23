import 'package:flutter/material.dart';
import 'package:ressources_re_mobile/classes/Ressource.dart';
import 'package:ressources_re_mobile/classes/Utilisateur.dart';
import 'package:ressources_re_mobile/classes/Commentaire.dart';


import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';

class Ressources_page extends StatelessWidget {
  final Ressource? uneRessource;
  const Ressources_page({Key? key, required this.uneRessource}) : super(key: key);

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
                  ///***If you have exported images you must have to copy those images in assets/images directory.
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
                                        color: Color(0xffffc107)),
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
                                    padding: EdgeInsets.fromLTRB(0, 16, 8, 0), // Ajustez les valeurs de padding selon vos besoins
                                    child: Text(
                                      (uneRessource?.getDateCreation() ?? ""),
                                      textAlign: TextAlign.start,
                                      overflow: TextOverflow.clip,
                                      style: TextStyle(
                                        fontWeight: FontWeight.w700,
                                        fontStyle: FontStyle.normal,
                                        fontSize: 14,
                                        color:Color.fromRGBO(3, 152, 158, 1),
                                      ),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsets.fromLTRB(0, 16, 0, 0), // Ajustez les valeurs de padding selon vos besoins
                                    child: Text(
                                      (uneRessource?.getDateModification() ?? "")+" ",
                                      textAlign: TextAlign.start,
                                      overflow: TextOverflow.clip,
                                      style: TextStyle(
                                        fontWeight: FontWeight.w700,
                                        fontStyle: FontStyle.normal,
                                        fontSize: 14,
                                        color:Color.fromRGBO(3, 152, 158, 1),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              
                            Padding(
                                padding: EdgeInsets.fromLTRB(0, 16, 0, 0),
                                child: HtmlWidget(uneRessource?.getContenu()?? ""),
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
                                          padding: EdgeInsets.fromLTRB(0, 16, 0, 0), // Ajustez les valeurs de padding selon vos besoins
                                          child: Row(
                                            children: [
                                              Icon(
                                                Icons.person, // Choisissez l'icône souhaitée ici
                                                color: Color.fromRGBO(3, 152, 158, 1), // Couleur de l'icône
                                              ),
                                              SizedBox(width: 8), // Espacement entre l'icône et le texte
                                              Text(
                                                (uneRessource?.getProprietaire()?.getNom() ?? "") +" "+ (uneRessource?.getProprietaire()?.getPrenom() ?? "") + " ",
                                                textAlign: TextAlign.start,
                                                overflow: TextOverflow.clip,
                                                style: TextStyle(
                                                  fontWeight: FontWeight.w700,
                                                  fontStyle: FontStyle.normal,
                                                  fontSize: 14,
                                                  color:Color.fromRGBO(3, 152, 158, 1),
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
                                          padding: EdgeInsets.fromLTRB(0, 16, 0, 0), // Ajustez les valeurs de padding selon vos besoins
                                          child: Row(
                                            children: [
                                              Icon(
                                                Icons.visibility, // Icône pour le nombre de vues
                                                color: Color.fromRGBO(3, 152, 158, 1), // Couleur de l'icône
                                              ),
                                              SizedBox(width: 8), // Espacement entre l'icône et le texte
                                              Text(
                                                "Nombre de vues: ${uneRessource?.getNombreVue() ?? 0}", // Affichage du nombre de vues
                                                textAlign: TextAlign.start,
                                                overflow: TextOverflow.clip,
                                                style: TextStyle(
                                                  fontWeight: FontWeight.w700,
                                                  fontStyle: FontStyle.normal,
                                                  fontSize: 14,
                                                  color:Color.fromRGBO(3, 152, 158, 1),
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
                                      SizedBox(height: 8), // Espacement entre le titre et les commentaires
                                      ListView.builder(
                                        shrinkWrap: true, // Pour éviter les problèmes de débordement dans une colonne
                                        physics: NeverScrollableScrollPhysics(), // Pour désactiver le défilement de la ListView à l'intérieur de SingleChildScrollView
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
                                                    "${commentaire.getUtilisateur()?.getNom() ?? ''} ${commentaire.getUtilisateur()?.getPrenom() ?? ''}", // Nom et prénom de l'utilisateur
                                                    style: TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 16,
                                                      color: Colors.black,
                                                    ),
                                                  ),
                                                  SizedBox(height: 4),
                                                  Text(
                                                    commentaire.getContenu() ?? "", // Contenu du commentaire
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
                                    SizedBox(height: 8), // Espacement entre le titre et le formulaire
                                    TextField(
                                      decoration: InputDecoration(
                                        hintText: "Votre commentaire",
                                        border: OutlineInputBorder(),
                                      ),
                                      maxLines: null, // Pour permettre plusieurs lignes
                                      // onChanged: (value) {
                                      //   // Ici, vous pouvez mettre à jour l'état de votre widget avec la valeur du commentaire
                                      // },
                                    ),
                                    SizedBox(height: 8), // Espacement entre le champ de texte et le bouton
                                    ElevatedButton(
                                      onPressed: () {
                                        // Logique pour soumettre le commentaire ici
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
