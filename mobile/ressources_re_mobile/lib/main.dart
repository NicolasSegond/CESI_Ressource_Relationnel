import 'package:ressources_re_mobile/pages/catalogue_page.dart';
import 'package:ressources_re_mobile/pages/inscription_page.dart';
import 'package:ressources_re_mobile/pages/favoris_page.dart';
import 'package:ressources_re_mobile/pages/connexion_page.dart';
import 'package:ressources_re_mobile/pages/profile_page.dart';
import 'package:ressources_re_mobile/pages/administration_page.dart';
import 'package:ressources_re_mobile/pages/statistique_page.dart';
import 'utilities/authentification.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => DashboardProvider(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Catalogue',
      theme: ThemeData(
        primaryColor: Colors.white,
        primaryIconTheme: IconThemeData(color: Colors.black),
      ),
      routes: {
        '/': (context) => const MyMainPage(title: "Catalogue", initialIndex: 0),
        '/inscription': (context) => const MyMainPage(title: "Inscription", initialIndex: 1),
        '/connexion': (context) => const MyMainPage(title: "Connexion", initialIndex: 2),
        '/favoris': (context) => const MyMainPage(title: "Mes favoris", initialIndex: 3),
        '/stat': (context) => const MyMainPage(title: "Statistique", initialIndex: 4),
        '/admin': (context) => const MyMainPage(title: 'Administration', initialIndex: 5),
        '/profil': (context) => const ProfilPage(), // Modifié pour accéder directement à ProfilPage
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
  bool _showCreateButton = false;
  bool _showDashboardButton = false;
  bool _isUserConnected = false;

  @override
  void initState() {
    super.initState();
    _index = widget.initialIndex;
    _checkUserRole(updateButtonVisibility);
    _checkUserConnectionStatus();
  }

  void setCurrentIndex(int index) {
    setState(() {
      _index = index;
      print(_index);
    });
  }

  void updateButtonVisibility(bool showCreateButton, bool showDashboardButton) {
    setState(() {
      _showCreateButton = showCreateButton;
      _showDashboardButton = showDashboardButton;
    });
  }

  void _checkUserConnectionStatus() async {
    final token = await getTokenDisconnected();
    setState(() {
      _isUserConnected = token != null;
    });
  }

  void _logout() async {
    storage.delete(key: 'token');
    setState(() {
      _isUserConnected = false;
      _showCreateButton = false;
      _showDashboardButton = false;
      setCurrentIndex(0);
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = _isUserConnected
        ? [
            Catalogue(),
            FavorisPage(),
            FavorisPage(),
            if (_showDashboardButton) DashboardAdmin(),
            if (_showDashboardButton) AdminPage(),
          ]
        : [
            Catalogue(),
            SignUp(),
            Login(
              onLoginSuccess: () {
                _checkUserRole(updateButtonVisibility);
                _checkUserConnectionStatus();
                setCurrentIndex(0);
              },
            ),
          ];

    final List<BottomNavigationBarItem> items = _isUserConnected
        ? [
            BottomNavigationBarItem(icon: Icon(Icons.library_books), label: 'Catalogue'),
            BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Mes favoris'),
            BottomNavigationBarItem(icon: Icon(Icons.create), label: 'Création'),
            if (_showDashboardButton) BottomNavigationBarItem(icon: Icon(Icons.analytics), label: 'Statistique'),
            if (_showDashboardButton) BottomNavigationBarItem(icon: Icon(Icons.admin_panel_settings), label: 'Administration'),
          ]
        : [
            BottomNavigationBarItem(icon: Icon(Icons.library_books), label: 'Catalogue'),
            BottomNavigationBarItem(icon: Icon(Icons.person_add), label: 'Inscription'),
            BottomNavigationBarItem(icon: Icon(Icons.login), label: 'Connexion'),
          ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: Text("Ressources Relationnelles"),
        actions: [
          if (_isUserConnected)
            IconButton(
              icon: Icon(Icons.person),
              onPressed: () {
                Navigator.pushNamed(context, '/profil');
              },
            ),
            if (_isUserConnected)
            IconButton(
              icon: Icon(Icons.logout),
              onPressed: _logout,
            ),
        ],
      ),
      body: pages[_index],
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.white,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        iconSize: 32,
        elevation: 10,
        onTap: setCurrentIndex,
        currentIndex: _index,
        items: items,
      ),
    );
  }
}

void _checkUserRole(Function(bool, bool) updateButtonVisibility) async {
  try {
    final token = await getTokenDisconnected();

    if (token != null) {
      final tokenValue = await token;
      final userId = await getIdUser(tokenValue);
      final roles = await getRolesUser(userId);

      bool showCreateButton = false;
      bool showDashboardButton = false;

      if (roles.contains("ROLE_ADMIN")) {
        showCreateButton = true;
        showDashboardButton = true;
      } else if (roles.contains("ROLE_MODO")) {
        showCreateButton = true;
        showDashboardButton = true;  // Inclure le bouton dashboard pour les modérateurs aussi
      }

      updateButtonVisibility(showCreateButton, showDashboardButton);
    } else {
      print("Le token est null.");
    }
  } catch (error) {
    print("Erreur lors de la récupération des rôles de l'utilisateur : $error");
  }
}
