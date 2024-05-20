import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:floating_bottom_navigation_bar/floating_bottom_navigation_bar.dart';
import 'package:ressources_re_mobile/pages/catalogue_page.dart';
import 'package:ressources_re_mobile/pages/inscription_page.dart';
import 'package:ressources_re_mobile/pages/favoris_page.dart';
import 'package:ressources_re_mobile/pages/connexion_page.dart';
import 'package:ressources_re_mobile/pages/statistique_page.dart';
import 'utilities/authentification.dart';

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
  bool _showStatButton = false;

  @override
  void initState() {
    super.initState();
    _index = widget.initialIndex;
  }

  void setCurrentIndex(int index) {
    setState(() {
      _index = index;
      print(_index);
    });
  }

  void updateStatButtonVisibility(bool showButton) {
    setState(() {
      _showStatButton = showButton;
    });
  }

 @override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      backgroundColor: Colors.white,
      title: Text("Ressources Relationnelles"),
    ),
    body: IndexedStack(
      index: _index,
      children: [
        Catalogue(),
        SignUp(),
        Login(
          onLoginSuccess: () {
            _checkUserRole(updateStatButtonVisibility);
            _index = 0;
          },
        ),
        FavorisPage(),
        DashboardAdmin() ,
      ],
    ),
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
        BottomNavigationBarItem(icon: Icon(Icons.analytics), label: 'Statistique'),
      ],
    ),
  );
}


  void _checkUserRole(Function(bool) updateStatButtonVisibility) async {
    try {
      final token = await getTokenDisconnected();
      
      if (token != null) {
        final tokenValue = await token;
        final userId = await getIdUser(tokenValue);
        final roles = await getRolesUser(userId);
        
        if (roles.contains("ROLE_ADMIN") || roles.contains("ROLE_MODO")) {
          updateStatButtonVisibility(true);
        } else {
          updateStatButtonVisibility(false);
        }
      } else {
        print("Le token est null.");
      }
    } catch (error) {
      print("Erreur lors de la récupération des rôles de l'utilisateur : $error");
    }
  }
}
