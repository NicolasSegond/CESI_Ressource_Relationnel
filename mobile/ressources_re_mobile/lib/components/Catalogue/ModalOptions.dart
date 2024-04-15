import 'package:flutter/material.dart';

class ModalOptions extends StatelessWidget {
  final String currentUser; // Ajouter currentUser comme paramètre
  final String ressourceProprietaire; // Ajouter ressourceProprietaire comme paramètre

  ModalOptions({required this.currentUser, required this.ressourceProprietaire}); // Initialiser currentUser


  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: const Icon(
        Icons.more_vert,
        color: Color(0xff000000),
        size: 24,
      ),
      onPressed: () {
        // Afficher le bottom sheet avec les options supplémentaires
        showModalBottomSheet(
          context: context,
          builder: (BuildContext context) {
            return Container(
              padding: EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if(currentUser == ressourceProprietaire)
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.3),
                          spreadRadius: 2,
                          blurRadius: 5,
                          offset: Offset(0, 2), // changes position of shadow
                        ),
                      ],
                    ),
                    child: TextButton(
                      onPressed: () {
                        Navigator.pop(context); // Fermer le bottom sheet après l'action
                      },
                      style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all<Color>(Colors.transparent), // Fond transparent
                      ),
                      child: Text(
                        'Supprimer la ressource',
                        style: TextStyle(
                          color: Colors.black, // Couleur du texte noir
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
                          offset: Offset(0, 2), // changes position of shadow
                        ),
                      ],
                    ),
                    child: TextButton(
                      onPressed: () {
                        // Autres actions possibles ici
                      },
                      style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all<Color>(Colors.transparent), // Fond transparent
                      ),
                      child: Text(
                        'Ajouter la ressource en favoris',
                        style: TextStyle(
                          color: Colors.black, // Couleur du texte noir
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
                          offset: Offset(0, 2), // changes position of shadow
                        ),
                      ],
                    ),
                    child: TextButton(
                      onPressed: () {
                        // Autres actions possibles ici
                      },
                      style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all<Color>(Colors.transparent), // Fond transparent
                      ),
                      child: Text(
                        'Mettre de côté la ressource',
                        style: TextStyle(
                          color: Colors.black, // Couleur du texte noir
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
