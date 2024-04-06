import 'Ressource.dart';

class Statut {
  int? id;

  String? nomStatut;

  List<Ressource> ressource = [];

  Statut();

  int? getId() {
    return id;
  }

  String? getNomStatut() {
    return nomStatut;
  }

  void setNomStatut(String nomStatut) {
    this.nomStatut = nomStatut;
  }

  List<Ressource> getRessource() {
    return ressource;
  }

  void addRessource(Ressource ressource) {
    if (!this.ressource.contains(ressource)) {
      this.ressource.add(ressource);
      ressource.setStatut(this);
    }
  }

  void removeRessource(Ressource ressource) {
    if (this.ressource.remove(ressource)) {
      if (ressource.getStatut() == this) {
        ressource.setStatut(null);
      }
    }
  }

  Statut.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    nomStatut = json['nomStatut'];
  }
}
