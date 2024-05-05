import 'package:ressources_re_mobile/classes/Categorie.dart';
import 'package:ressources_re_mobile/classes/Commentaire.dart';
import 'package:ressources_re_mobile/classes/Fichier.dart';
import 'package:ressources_re_mobile/classes/Progression.dart';
import 'package:ressources_re_mobile/classes/Statut.dart';
import 'package:ressources_re_mobile/classes/TypeDeRessource.dart';
import 'package:ressources_re_mobile/classes/TypeRelation.dart';
import 'package:ressources_re_mobile/classes/Utilisateur.dart';
import 'package:ressources_re_mobile/classes/Visibilite.dart';
import 'package:ressources_re_mobile/classes/VoirRessource.dart';
import 'package:intl/intl.dart';

class Ressource {
  int? id;
  String? titre;
  String? miniature;
  String? contenu;
  DateTime? dateCreation;
  DateTime? dateModification;
  int? nombreVue;
  Utilisateur? proprietaire;
  Statut? statut;
  Visibilite? visibilite;
  TypeDeRessource? typeDeRessource;
  List<TypeRelation> typeRelations = [];
  Categorie? categorie;
  List<Commentaire> commentaires = [];
  List<Progression> progressions = [];
  List<VoirRessource> voirRessources = [];
  List<Fichier> fichiers = [];

  Ressource();

  int? getId() {
    return id;
  }

  String? getTitre() {
    return titre;
  }

  void setTitre(String titre) {
    this.titre = titre;
  }

  String? getContenu() {
    return contenu;
  }

  void setContenu(String contenu) {
    this.contenu = contenu;
  }

  String? getDateCreation() {
    if (dateCreation != null) {
      Duration difference = DateTime.now().difference(dateCreation!);
      if (difference.inDays == 0) {
        return 'Créé aujourd\'hui';
      } else if (difference.inDays == 1) {
        return 'Créé hier';
      } else if (difference.inDays < 30) {
        return 'Créé il y a ${difference.inDays} jours';
      } else {
        return 'Créé le ' + DateFormat('dd-MM-yyyy').format(dateCreation!);
      }
    } else {
      return null;
    }
  }

  void setDateCreation(DateTime dateCreation) {
    this.dateCreation = dateCreation;
  }

String? getDateModification() {
  if (dateModification != null) {
    Duration difference = DateTime.now().difference(dateModification!);
    if (difference.inDays == 0) {
      return 'Modifié aujourd\'hui';
    } else if (difference.inDays == 1) {
      return 'Modifié hier';
    } else if (difference.inDays < 30) {
      return 'Modifié il y a ${difference.inDays} jours';
    } else {
      return 'Modifié le ' + DateFormat('dd-MM-yyyy').format(dateModification!);
    }
  } else {
    return null;
  }
}


  void setDateModification(DateTime dateModification) {
    this.dateModification = dateModification;
  }

  int? getNombreVue() {
    return nombreVue;
  }

  void setNombreVue(int nombreVue) {
    this.nombreVue = nombreVue;
  }

  Utilisateur? getProprietaire() {
    return proprietaire;
  }

  void setProprietaire(Utilisateur? proprietaire) {
    this.proprietaire = proprietaire;
  }

  Statut? getStatut() {
    return statut;
  }

  void setStatut(Statut? statut) {
    this.statut = statut;
  }

  Visibilite? getVisibilite() {
    return visibilite;
  }

  void setVisibilite(Visibilite? visibilite) {
    this.visibilite = visibilite;
  }

  TypeDeRessource? getTypeDeRessource() {
    return typeDeRessource;
  }

  void setTypeDeRessource(TypeDeRessource? typeDeRessource) {
    this.typeDeRessource = typeDeRessource;
  }

  List<TypeRelation> getTypeRelations() {
    return typeRelations;
  }

  void addTypeRelation(TypeRelation typeRelation) {
    if (!typeRelations.contains(typeRelation)) {
      typeRelations.add(typeRelation);
      typeRelation.addRessource(this);
    }
  }

  void removeTypeRelation(TypeRelation typeRelation) {
    if (typeRelations.remove(typeRelation)) {
      typeRelation.removeRessource(this);
    }
  }

  Categorie? getCategorie() {
    return categorie;
  }

  void setCategorie(Categorie? categorie) {
    this.categorie = categorie;
  }

  List<Commentaire> getCommentaires() {
    return commentaires;
  }

  void addCommentaire(Commentaire commentaire) {
    if (!commentaires.contains(commentaire)) {
      commentaires.add(commentaire);
      commentaire.setRessource(this);
    }
  }

  void removeCommentaire(Commentaire commentaire) {
    if (commentaires.remove(commentaire)) {
      if (commentaire.getRessource() == this) {
        commentaire.setRessource(null);
      }
    }
  }

  List<Progression> getProgressions() {
    return progressions;
  }

  void addProgression(Progression progression) {
    if (!progressions.contains(progression)) {
      progressions.add(progression);
      progression.setRessource(this);
    }
  }

  void removeProgression(Progression progression) {
    if (progressions.remove(progression)) {
      if (progression.getRessource() == this) {
        progression.setRessource(null);
      }
    }
  }

  List<VoirRessource> getVoirRessources() {
    return voirRessources;
  }

  void addVoirRessource(VoirRessource voirRessource) {
    if (!voirRessources.contains(voirRessource)) {
      voirRessources.add(voirRessource);
      voirRessource.setRessource(this);
    }
  }

  void removeVoirRessource(VoirRessource voirRessource) {
    if (voirRessources.remove(voirRessource)) {
      if (voirRessource.getRessource() == this) {
        voirRessource.setRessource(null);
      }
    }
  }

  List<Fichier> getFichiers() {
    return fichiers;
  }

  void addFichier(Fichier fichier) {
    if (!fichiers.contains(fichier)) {
      fichiers.add(fichier);
      fichier.setRessource(this);
    }
  }

  void removeFichier(Fichier fichier) {
    if (fichiers.remove(fichier)) {
      if (fichier.getRessource() == this) {
        fichier.setRessource(null);
      }
    }
  }

  String? getMiniature() {
    return miniature;
  }

  void setMiniature(String? miniature) {
    this.miniature = miniature;
  }

  Ressource.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    titre = json['titre'];
    miniature = json['miniature'];
    contenu = json['contenu'];
    dateCreation = DateTime.parse(json['dateCreation']);
    dateModification = json['dateModification'] != null ? DateTime.parse(json['dateModification']) : null;
    nombreVue = json['nombreVue'];
    proprietaire = Utilisateur.fromJson(json['proprietaire']);
    statut = json['statut'] != null ? Statut.fromJson(json['statut']) : null;
    visibilite = json['visibilite'] != null ? Visibilite.fromJson(json['visibilite']) : null;
    typeDeRessource = json['typeDeRessource'] != null ? TypeDeRessource.fromJson(json['typeDeRessource']) : null;
    if(json['typeRelations'] != null){
      for (var typeRelation in json['typeRelations']) {
        typeRelations.add(TypeRelation.fromJson(typeRelation));
      }
    } else{
      typeRelations = [];
    }
    categorie = json['categorie'] != null ? Categorie.fromJson(json['categorie']) : null;

    if(json['commentaires'] != null){
      for (var commentaire in json['commentaires']) {
        commentaires.add(Commentaire.fromJson(commentaire));
      }
    } else{
      commentaires = [];
    }
  }
}
