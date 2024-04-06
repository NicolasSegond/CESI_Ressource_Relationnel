// ignore_for_file: file_names

import 'package:ressources_re_mobile/classes/Ressource.dart';

class Categorie {
  int? id;
  String? nom;
  List<Ressource> ressources = [];

   // Constructeur avec initialisation des attributs
  Categorie({this.id, this.nom});

  // Constructeur par défaut
  Categorie.empty();

  int? getId() {
    return id;
  }

  String? getNom() {
    return nom;
  }

  void setNom(String nom) {
    this.nom = nom;
  }

  List<Ressource> getRessource() {
    return ressources;
  }

  void addRessource(Ressource ressource) {
    if (!this.ressources.contains(ressource)) {
      this.ressources.add(ressource);
      ressource.setCategorie(this);
    }
  }

  void removeRessource(Ressource ressource) {
    if (this.ressources.remove(ressource)) {
      if (ressource.getCategorie() == this) {
        ressource.setCategorie(null);
      }
    }
  }

  Categorie.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    nom = json['nom'];
  }
}
