// ignore_for_file: file_names

import 'package:ressources_re_mobile/classes/Progression.dart';

class TypeProgression {
  int? id;
  String? libelle;
  List<Progression> progressions = [];

  TypeProgression();

  int? getId() {
    return id;
  }

  String? getLibelle() {
    return libelle;
  }

  void setLibelle(String libelle) {
    this.libelle = libelle;
  }

  List<Progression> getProgressions() {
    return progressions;
  }

  void addProgression(Progression progression) {
    if (!this.progressions.contains(progression)) {
      this.progressions.add(progression);
      progression.setTypeProgression(this);
    }
  }

  void removeProgression(Progression progression) {
    if (this.progressions.remove(progression)) {
      if (progression.getTypeProgression() == this) {
        progression.setTypeProgression(null);
      }
    }
  }

  TypeProgression.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    libelle = json['libelle'];
  }
}
