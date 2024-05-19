// ignore_for_file: file_names

import 'package:ressources_re_mobile/classes/Ressource.dart';
import 'package:ressources_re_mobile/classes/TypeProgression.dart';
import 'package:ressources_re_mobile/classes/Utilisateur.dart';

class Progression {
  int? id;
  TypeProgression? typeProgression;
  Utilisateur? utilisateur;
  Ressource? ressource;

  Progression();

  int? getId() {
    return id;
  }

  TypeProgression? getTypeProgression() {
    return typeProgression;
  }

  void setTypeProgression(TypeProgression? typeProgression) {
    this.typeProgression = typeProgression;
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

  Progression.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    typeProgression = TypeProgression.fromJson(json['TypeProgression']) != null ? TypeProgression.fromJson(json['TypeProgression']) : null;
    utilisateur = Utilisateur.fromJson(json['Utilisateur']);
    ressource = Ressource.fromJson(json['Ressource']);
  }
}
