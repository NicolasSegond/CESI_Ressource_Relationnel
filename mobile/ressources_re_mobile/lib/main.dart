import 'package:flutter/material.dart';
import 'package:ressources_re_mobile/pages/connexion_page.dart';
import 'package:ressources_re_mobile/pages/inscription_page.dart';
import 'package:ressources_re_mobile/pages/test.dart';
import 'package:ressources_re_mobile/pages/catalogue_page.dart';

void main() {
  //Passerelle.initListApi();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  int _currentIndex = 0;

  setCurrentIndex(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(
          title: Text([
            "Inscription",
            "Connexion",
            "Login",
            "Catalogue",
            "Test",
          ][_currentIndex]),
        ),
        body: IndexedStack(
          index: _currentIndex,
          children: [
            SignUp(),
            login(), // Utilisation de la page de connexion ici
            Catalogue(),
            FilterPage(),
          ],
        ),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setCurrentIndex(index),
          type: BottomNavigationBarType.fixed,
          selectedItemColor: Colors.blue,
          unselectedItemColor: Colors.grey,
          iconSize: 32,
          elevation: 10,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.login), label: 'Connexion'),
            BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Inscription'),
            BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Catalogue'),
            BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Test'),
          ],
        ),
      ),
    );
  }
}