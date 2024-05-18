import 'package:flutter/material.dart';
import 'package:floating_bottom_navigation_bar/floating_bottom_navigation_bar.dart';
import 'package:ressources_re_mobile/pages/catalogue_page.dart';
import 'package:ressources_re_mobile/pages/inscription_page.dart';
import 'package:ressources_re_mobile/pages/favoris_page.dart';
import 'package:ressources_re_mobile/pages/connexion_page.dart';
import 'package:ressources_re_mobile/pages/administration_page.dart';

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
        '/': (context) => const MyMainPage(title: "Catalogue", initialIndex: 0),
        '/inscription': (context) => const MyMainPage(title: "Inscription", initialIndex: 1),
        '/connexion': (context) => const MyMainPage(title: "Connexion", initialIndex: 2),
        '/favoris': (context) => const MyMainPage(title: "Mes favoris", initialIndex: 3),
        '/admin': (context) => const MyMainPage(title: 'Administration', initialIndex: 4),
      },
      initialRoute: '/',
    );
  }
}

class MyMainPage extends StatefulWidget {
  const MyMainPage({Key? key, required this.title, required this.initialIndex}) : super(key: key);

  final String title;
  final int initialIndex;

  @override
  State<MyMainPage> createState() => _MyMainPageState();
}

class _MyMainPageState extends State<MyMainPage> {
  late int _index;

  @override
  void initState() {
    super.initState();
    _index = widget.initialIndex;
  }

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
        title: Text("Ressources Relationnelles"),
      ),
      body: [
        Catalogue(),
        SignUp(),
        Login(),
        FavorisPage(),
        AdminPage()
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
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Mes favoris'),
          BottomNavigationBarItem(icon: Icon(Icons.admin_panel_settings), label: 'Administration'),
        ],
      ),
    );
  }
}
