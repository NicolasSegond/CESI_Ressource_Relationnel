// ignore_for_file: file_names

import 'package:ressources_re_mobile/classes/Ressource.dart';

class Visibilite {
  int? id;
  String? libelle;
  List<Ressource> ressources = [];

  Visibilite();

  int? getId() {
    return id;
  }

  String? getLibelle() {
    return libelle;
  }

  void setLibelle(String libelle) {
    this.libelle = libelle;
  }

  List<Ressource> getRessource() {
    return ressources;
  }

  void addRessource(Ressource ressource) {
    if (!ressources.contains(ressource)) {
      ressources.add(ressource);
      ressource.setVisibilite(this);
    }
  }

  void removeRessource(Ressource ressource) {
    if (ressources.remove(ressource)) {
      if (ressource.getVisibilite() == this) {
        ressource.setVisibilite(null);
      }
    }
  }

  Visibilite.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    libelle = json['libelle'];
  }
}
