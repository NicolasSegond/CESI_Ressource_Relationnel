// ignore_for_file: file_names

import 'package:ressources_re_mobile/classes/Ressource.dart';
import 'package:ressources_re_mobile/classes/Utilisateur.dart';
import 'package:intl/intl.dart'; // Importation du package intl pour utiliser DateFormat

class Commentaire {
  int? id;
  String? contenu;
  Ressource? ressource;
  Utilisateur? utilisateur;
  DateTime? date;
  
  int? getId() {
    return id;
  }

  String? getContenu() {
    return contenu;
  }

  void setContenu(String contenu) {
    this.contenu = contenu;
  }

  Ressource? getRessource() {
    return ressource;
  }

  void setRessource(Ressource? ressource) {
    this.ressource = ressource;
  }

  Utilisateur? getUtilisateur() {
    return utilisateur;
  }

  void setUtilisateur(Utilisateur? utilisateur) {
    this.utilisateur = utilisateur;
  }

String? getDate() {
  if (date != null) {
    return DateFormat('yyyy-MM-dd HH:mm').format(date!); // Formatage de la date sans les secondes
  } else {
    return null;
  }
}
  void setDate(DateTime date) {
    this.date = date;
  }

  Commentaire.fromJson(Map<String, dynamic> json)
  {
    id = json['id'];
    contenu = json['contenu'];
    date = DateTime.parse(json['date']);
    utilisateur = Utilisateur.fromJson(json['utilisateur']);
  }
}
