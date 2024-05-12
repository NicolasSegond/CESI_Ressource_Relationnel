// ignore_for_file: file_names

import 'package:ressources_re_mobile/classes/Ressource.dart';

class Fichier {
  int? id;
  Ressource? ressource;
  String? nom;
  int? size;
  DateTime? date;

  Fichier();

  int? getId() {
    return id;
  }

  Ressource? getRessource() {
    return ressource;
  }

  void setRessource(Ressource? ressource) {
    this.ressource = ressource;
  }

  String? getNom() {
    return nom;
  }

  void setNom(String nom) {
    this.nom = nom;
  }

  int? getSize() {
    return size;
  }

  void setSize(int size) {
    this.size = size;
  }

  DateTime? getDate() {
    return date;
  }

  void setDate(DateTime date) {
    this.date = date;
  }

  Fichier.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    nom = json['nom'];
    size = json['size'];
    date = json['date'] != null ? DateTime.parse(json['date']) : null;
    
    // Vérifiez si 'ressource' est null avant de créer l'objet Ressource correspondant
    ressource = json['ressource'] != null ? Ressource.fromJson(json['ressource']) : null;
  }



}
