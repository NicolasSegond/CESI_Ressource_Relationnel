import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:ressources_re_mobile/pages/Gestion/gestion_utilisateurs.dart';
import 'package:ressources_re_mobile/pages/Gestion/gestion_ressources.dart';
import 'package:ressources_re_mobile/pages/Gestion/gestion_categories.dart';
import 'package:ressources_re_mobile/utilities/authentification.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: AdminPage(),
    );
  }
}

class AdminPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<String>>(
      future: () async {
        final token = await getToken();
        final id = await getIdUser(token!);
        return getRolesUser(id);
      }(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return CircularProgressIndicator();
        } else if (snapshot.hasError) {
          return Text('Une erreur s\'est produite : ${snapshot.error}');
        } else {
          final userRoles = snapshot.data;
          final isModo = userRoles != null && userRoles.contains('ROLE_MODO');
          if (isModo) {
            return Scaffold(
              appBar: AppBar(
                title: Text("Administration"),
              ),
              body: Padding(
                padding: const EdgeInsets.all(20.0),
                child: GestureDetector(
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => GestionRessources()));
                  },
                  child: Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.orange,
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: <Widget>[
                          Icon(
                            Icons.folder,
                            size: 50.0,
                            color: Colors.white,
                          ),
                          SizedBox(height: 10.0),
                          Text(
                            'Gestion des ressources',
                            style: TextStyle(color: Colors.white, fontSize: 18.0),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            );
          }
          else {
            return Scaffold(
              appBar: AppBar(
                title: Text("Administration"),
              ),
              body: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          Navigator.push(context, MaterialPageRoute(builder: (context) => GestionRessources()));
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.orange,
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Icon(
                                Icons.folder,
                                size: 50.0,
                                color: Colors.white,
                              ),
                              SizedBox(height: 10.0),
                              Text(
                                'Gestion des ressources',
                                style: TextStyle(color: Colors.white, fontSize: 18.0),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 20.0),
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          Navigator.push(context, MaterialPageRoute(builder: (context) => GestionUtilisateur()));
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.blue,
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Icon(
                                Icons.people,
                                size: 50.0,
                                color: Colors.white,
                              ),
                              SizedBox(height: 10.0),
                              Text(
                                'Gestion des utilisateurs',
                                style: TextStyle(color: Colors.white, fontSize: 18.0),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 20.0),
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          Navigator.push(context, MaterialPageRoute(builder: (context) => GestionCategories()));
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.green,
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Icon(
                                Icons.category,
                                size: 50.0,
                                color: Colors.white,
                              ),
                              SizedBox(height: 10.0),
                              Text(
                                'Gestion des catégories',
                                style: TextStyle(color: Colors.white, fontSize: 18.0),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }
        }
      },
    );
  }
}
