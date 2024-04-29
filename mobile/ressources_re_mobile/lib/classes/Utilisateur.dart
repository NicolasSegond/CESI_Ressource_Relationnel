// ignore_for_file: file_names

import 'package:ressources_re_mobile/classes/Commentaire.dart';
import 'package:ressources_re_mobile/classes/Progression.dart';
import 'package:ressources_re_mobile/classes/Ressource.dart';
import 'package:ressources_re_mobile/classes/VoirRessource.dart';

class Utilisateur {
  int? id;
  String? email;
  String? nom;
  String? prenom;
  List<String> roles = [];
  String? password;
  int? code;
  bool? verif;
  List<Ressource> proprietaireRessource = [];
  List<Commentaire> commentaires = [];
  List<Progression> progressions = [];
  List<VoirRessource> voirRessources = [];

  Utilisateur();

  int? getId() {
    return id;
  }

  String? getEmail() {
    return email;
  }

  void setEmail(String email) {
    this.email = email;
  }

  String? getNom() {
    return nom;
  }

  void setNom(String? nom) {
    this.nom = nom;
  }

  String? getPrenom() {
    return prenom;
  }

  void setPrenom(String? prenom) {
    this.prenom = prenom;
  }

  String getUserIdentifier() {
    return email ?? '';
  }

  List<String> getRoles() {
    List<String> roles = this.roles;
    roles.add('ROLE_USER');
    return roles.toSet().toList();
  }

  void setRoles(List<String> roles) {
    this.roles = roles;
  }

  String getPassword() {
    return password ?? '';
  }

  void setPassword(String password) {
    this.password = password;
  }

  int? getCode() {
    return code;
  }

  void setCode(int? code) {
    this.code = code;
  }

  bool? getVerif() {
    return verif;
  }

  void setVerif(bool? verif) {
    this.verif = verif;
  }

  void eraseCredentials() {}

  List<Ressource> getProprietaireRessource() {
    return proprietaireRessource;
  }

  void addProprietaireRessource(Ressource proprietaireRessource) {
    if (!this.proprietaireRessource.contains(proprietaireRessource)) {
      this.proprietaireRessource.add(proprietaireRessource);
      proprietaireRessource.setProprietaire(this);
    }
  }

  void removeProprietaireRessource(Ressource proprietaireRessource) {
    if (this.proprietaireRessource.remove(proprietaireRessource)) {
      if (proprietaireRessource.getProprietaire() == this) {
        proprietaireRessource.setProprietaire(null);
      }
    }
  }

  List<Commentaire> getCommentaires() {
    return commentaires;
  }

  void addCommentaire(Commentaire commentaire) {
    if (!this.commentaires.contains(commentaire)) {
      this.commentaires.add(commentaire);
      commentaire.setUtilisateur(this);
    }
  }

  void removeCommentaire(Commentaire commentaire) {
    if (this.commentaires.remove(commentaire)) {
      if (commentaire.getUtilisateur() == this) {
        commentaire.setUtilisateur(null);
      }
    }
  }

  List<Progression> getProgressions() {
    return progressions;
  }

  void addProgression(Progression progression) {
    if (!this.progressions.contains(progression)) {
      this.progressions.add(progression);
      progression.setUtilisateur(this);
    }
  }

  void removeProgression(Progression progression) {
    if (this.progressions.remove(progression)) {
      if (progression.getUtilisateur() == this) {
        progression.setUtilisateur(null);
      }
    }
  }

  List<VoirRessource> getVoirRessources() {
    return voirRessources;
  }

  void addVoirRessource(VoirRessource voirRessource) {
    if (!this.voirRessources.contains(voirRessource)) {
      this.voirRessources.add(voirRessource);
      voirRessource.setUtilisateur(this);
    }
  }

  void removeVoirRessource(VoirRessource voirRessource) {
    if (this.voirRessources.remove(voirRessource)) {
      if (voirRessource.getUtilisateur() == this) {
        voirRessource.setUtilisateur(null);
      }
    }
  }

  Utilisateur.fromJson(Map<String, dynamic> json)
  {
    id = json['id'];
    email = json['email'];
    nom = json['nom'];
    prenom = json['prenom'];
    roles = json['roles'] != null ? List<String>.from(json['roles']) : [];
    code = json['code'];
    verif = json['verif'];
  }

  
}
