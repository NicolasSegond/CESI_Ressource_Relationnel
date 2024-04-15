// ignore_for_file: file_names

import 'package:ressources_re_mobile/classes/Ressource.dart';

class TypeRelation {
  int? id;
  String? libelle;
  List<Ressource> ressources = [];

  TypeRelation();

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
    }
  }

  void removeRessource(Ressource ressource) {
    ressources.remove(ressource);
  }

  TypeRelation.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    libelle = json['libelle'];
  }
}
