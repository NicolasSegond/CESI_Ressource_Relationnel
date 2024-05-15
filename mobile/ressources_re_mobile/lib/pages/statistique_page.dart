import 'package:flutter/material.dart';

void main() {
  runApp(Statistique());
}

class Statistique extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0), // Ajouter le Padding ici
      child: Scaffold(
        body: Center(
          child: Text(
            'Hello, World!',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}