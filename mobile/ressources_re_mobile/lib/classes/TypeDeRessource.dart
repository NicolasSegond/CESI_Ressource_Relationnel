// ignore_for_file: file_names

import 'Ressource.dart';

class TypeDeRessource {
  int? id;
  String? libelle;
  List<Ressource> ressource = [];

  TypeDeRessource();

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
    return ressource;
  }

  void addRessource(Ressource ressource) {
    if (!this.ressource.contains(ressource)) {
      this.ressource.add(ressource);
      ressource.setTypeDeRessource(this);
    }
  }

  void removeRessource(Ressource ressource) {
    if (this.ressource.remove(ressource)) {
      if (ressource.getTypeDeRessource() == this) {
        ressource.setTypeDeRessource(null);
      }
    }
  }

  TypeDeRessource.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    libelle = json['libelle'];
  }
}
