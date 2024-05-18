import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: GestionRessources(),
    );
  }
}

class GestionRessources extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Administration"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
      ),
    );
  }
}