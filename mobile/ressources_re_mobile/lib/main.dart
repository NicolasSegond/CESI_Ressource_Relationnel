import 'package:flutter/material.dart';
import 'package:floating_bottom_navigation_bar/floating_bottom_navigation_bar.dart';
import 'package:ressources_re_mobile/pages/catalogue_page.dart';
import 'package:ressources_re_mobile/pages/inscription_page.dart';
import 'package:ressources_re_mobile/pages/test.dart';
import 'package:ressources_re_mobile/pages/connexion_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Catalogue',
      theme: ThemeData(
        primaryColor: Colors.white, // Fond blanc
        primaryIconTheme: IconThemeData(color: Colors.black), // Icônes en noir
      ),
      routes: {
        '/': (context) => const MyMainPage(title: "Catalogue"),
        '/inscription': (context) => const MyMainPage(title: "Inscription"),
        '/connexion': (context) => const MyMainPage(title: "Connexion"),
        '/test': (context) => const MyMainPage(title: "Test"),
      },
      initialRoute: '/',
    );
  }
}

class MyMainPage extends StatefulWidget {
  const MyMainPage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyMainPage> createState() => _MyMainPageState();
}

class _MyMainPageState extends State<MyMainPage> {
  int _index = 0;

  void setCurrentIndex(int index) {
    setState(() {
      _index = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text("GSB extranet"),
      ),
      body: [
        Catalogue(),
        SignUp(),
        Login(),
        FilterPage(),
      ][_index],
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.white,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        iconSize: 32,
        elevation: 10,
        onTap: setCurrentIndex,
        currentIndex: _index,
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.login), label: 'Catalogue'),
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Inscription'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Connexion'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Test'),
        ],
      ),
    );
  }
}
