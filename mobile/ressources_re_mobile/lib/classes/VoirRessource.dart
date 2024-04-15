// ignore_for_file: file_names

import 'package:ressources_re_mobile/classes/Ressource.dart';
import 'package:ressources_re_mobile/classes/Utilisateur.dart';

class VoirRessource {
  int? id;
  Utilisateur? utilisateur;
  Ressource? ressource;

  VoirRessource();

  int? getId() {
    return id;
  }

  Utilisateur? getUtilisateur() {
    return utilisateur;
  }

  void setUtilisateur(Utilisateur? utilisateur) {
    this.utilisateur = utilisateur;
  }

  Ressource? getRessource() {
    return ressource;
  }

  void setRessource(Ressource? ressource) {
    this.ressource = ressource;
  }

  VoirRessource.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    utilisateur = json['utilisateur'];
    ressource = json['ressource'];
  }
}
