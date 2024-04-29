import 'package:flutter/material.dart';

class LessButton extends StatelessWidget {
  final int currentPage; // Modifié pour être de type int
  final Function fetchAlbum; // Modifié pour être de type Function
  final Function updatePage; // Ajouté pour être de type Function

  LessButton({required this.currentPage, required this.fetchAlbum, required this.updatePage});

  @override
  Widget build(BuildContext context) { // Changé la signature pour correspondre à une méthode build()
    return Align(
      alignment: Alignment.bottomCenter,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(0, 0, 0, 10),
        child: ElevatedButton(
          onPressed: () {
            updatePage(currentPage - 1); // Augmenter le numéro de page
            fetchAlbum(); // Appeler fetchAlbum avec la nouvelle page
          },
          style: ButtonStyle(
            backgroundColor: MaterialStateProperty.all<Color>(
              Color(0xFF03989e), // Couleur #03989e
            ),
          ),
          child: Text(
            'Précédent',
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
    );
  }
}