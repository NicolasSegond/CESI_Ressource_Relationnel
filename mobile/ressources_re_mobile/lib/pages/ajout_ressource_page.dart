import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_quill/flutter_quill.dart' as quill;
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'package:multi_select_flutter/multi_select_flutter.dart';
import 'package:path/path.dart' as path;
import 'package:ressources_re_mobile/utilities/authentification.dart';
import 'package:image_picker/image_picker.dart';


class Category {
  final int id;
  final String name;

  Category({required this.id, required this.name});
}

class RelationType {
  final int id;
  final String name;

  RelationType({required this.id, required this.name});
}

class ResourceType {
  final int id;
  final String name;

  ResourceType({required this.id, required this.name});
}

class AjoutRessourcePage extends StatefulWidget {
  @override
  _AjoutRessourcePageState createState() => _AjoutRessourcePageState();
}

class _AjoutRessourcePageState extends State<AjoutRessourcePage> {
  late quill.QuillController _controller;
  late FocusNode _focusNode;
  TextEditingController titreController = TextEditingController();
  late ScrollController _scrollController;
  TextEditingController descriptionController = TextEditingController();
  List<Category> categories = [];
  Category? selectedCategory; // Une seule catégorie peut être sélectionnée
  File? imageFile;
  Uint8List? webImage; // Pour stocker l'image sélectionnée sur le web
  bool isPrivate = false;
  List<RelationType> relationTypes = [];
  List<RelationType> selectedRelationTypes = []; // Permettre plusieurs types de relations
  List<ResourceType> resourceTypes = [];
  ResourceType? selectedResourceType;
  final picker = ImagePicker();
  String fileName = "";

  @override
  void initState() {
    super.initState();
    _controller = quill.QuillController.basic();
    _focusNode = FocusNode();
    _scrollController = ScrollController();
    fetchDataFromAPI();
  }

  Future<void> fetchDataFromAPI() async {
    try {
      var url = Uri.parse('http://192.168.0.13:8000/api/options');
      var response = await http.get(url);
      if (response.statusCode == 200) {
        var jsonData = jsonDecode(response.body);
        var tempCategories = (jsonData['categories'] as List)
            .map((data) => Category(id: data['id'], name: data['name']))
            .toList();
        var tempRelationTypes = (jsonData['relationTypes'] as List)
            .map((data) => RelationType(id: data['id'], name: data['name']))
            .toList();
        var tempResourceTypes = (jsonData['resourceTypes'] as List)
            .map((data) => ResourceType(id: data['id'], name: data['name']))
            .toList();

        setState(() {
          categories = tempCategories;
          relationTypes = tempRelationTypes;
          resourceTypes = tempResourceTypes;
        });
      } else {
        print('Request failed with status: ${response.statusCode}.');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    _scrollController.dispose();
    titreController.dispose();
    descriptionController.dispose();
    super.dispose();
  }


Future<void> _pickImage() async {
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        imageFile = File(pickedFile.path);
        print(imageFile);
      });

      // Récupération du nom du fichier
      fileName = pickedFile.name;
      print("Nom de l'image: $fileName");
    } else {
      print('Aucune image sélectionnée.');
    }
  }



  Future<void> _uploadImage() async {
  if (imageFile != null) {
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('http://192.168.0.13:8000/api/uploads'),
    );

    // Ajouter le paramètre 'idRessource' à la requête
    request.fields['idRessource'] = '166';

    // Vérifier si l'application s'exécute sur le web
    if (kIsWeb) {
      // Récupérer les données de l'image depuis l'URL blob
      var response = await http.get(Uri.parse(imageFile!.path));

      if (response.statusCode == 200) {
        // Convertir les données de l'image en bytes
        var imageData = response.bodyBytes;

        // Créer un MultipartFile à partir des données de l'image
        var multipartFile = http.MultipartFile.fromBytes(
          'miniature[]',
          imageData,
          filename: fileName, // Nom de fichier fictif
        );

        // Ajouter le MultipartFile à la requête
        request.files.add(multipartFile);
      } else {
        print('Failed to fetch image data: ${response.statusCode}');
        return;
      }
    } else {
      // Si l'application s'exécute sur un appareil mobile, utiliser le chemin local du fichier
      request.files.add(await http.MultipartFile.fromPath(
        'miniature[]',
        imageFile!.path,
      ));
    }

    var response2 = await request.send();

    if (response2.statusCode == 200) {
      print('File uploaded successfully');
    } else {
      print('File upload failed with status: ${response2.statusCode}');
    }
  }
}




  void _handleSubmit() async {
    final uri = Uri.parse('http://192.168.0.13:8000/api/ressources');
    final headers = {'Content-Type': 'application/json'};

    List<String> formattedTypeRelations = selectedRelationTypes
        .map((relationType) => '/api/type_relations/${relationType.id}')
        .toList();

    print("Submitting resource...");
    print(imageFile != null ? path.basename(imageFile!.path) : null);

    Map<String, dynamic> body = {
      'titre': titreController.text,
      'contenu': _controller.document.toPlainText(),
      'dateCreation': DateTime.now().toIso8601String(),
      'dateModification': DateTime.now().toIso8601String(),
      'nombreVue': 0,  // Exemple de champ avec valeur par défaut
      'proprietaire': '/api/utilisateurs/9',  // ID de l'utilisateur, ajustez selon vos besoins
      'statut': '/api/statuts/2',
      'visibilite': isPrivate ? '/api/visibilites/1' : '/api/visibilites/2',  // Exemple de condition
      'categorie': selectedCategory != null  ? '/api/categories/${selectedCategory?.id}' : null, 
      'valide': false,
      'typeDeRessource': selectedResourceType != null ? '/api/type_de_ressources/${selectedResourceType?.id}' : null,
      'typeRelations': formattedTypeRelations,
      'miniature': imageFile != null ? fileName : null,
    };

    final response = await http.post(
      uri,
      headers: headers,
      body: json.encode(body),
    );

    if (response.statusCode == 201) {
      print('Ressource ajoutée avec succès');
      print(imageFile);
      if (imageFile != null) {
        await _uploadImage();
      }
    } else {
      print('Erreur lors de la soumission: ${response.statusCode}');
      print('Réponse du serveur: ${response.body}');
    }
  }

  @override
  Widget build(BuildContext context) {
    quill.QuillSimpleToolbarConfigurations toolbarConfig = quill.QuillSimpleToolbarConfigurations(
      controller: _controller,
      showBoldButton: true,
      showItalicButton: true,
      showUnderLineButton: true,
      showStrikeThrough: true,
      showColorButton: true,
      showBackgroundColorButton: true,
      showClearFormat: true,
      toolbarIconAlignment: WrapAlignment.center,
      toolbarIconCrossAlignment: WrapCrossAlignment.center,
      toolbarSectionSpacing: 8.0,
    );

    quill.QuillEditorConfigurations editorConfig = quill.QuillEditorConfigurations(
      controller: _controller,
      placeholder: 'Commencez à écrire ici...', // Ajoutez d'autres configurations si nécessaire
      scrollable: true,
      padding: const EdgeInsets.all(10), // Utilisez const ici pour optimiser
    );

    return Scaffold(
      appBar: AppBar(title: const Text('Ajouter Ressource')),
      body: SingleChildScrollView(
        child: Column(
          children: [
            TextField(
              controller: titreController,
              decoration: const InputDecoration(labelText: 'Titre de la ressource'),
            ),
            TextField(
              controller: descriptionController,
              decoration: const InputDecoration(labelText: 'Description'),
              maxLines: 3,
            ),
            imageFile == null
                ? Text('Aucune image sélectionnée.')
                : Text('image sélectionnée.'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _pickImage,
              child: const Text('Choisir une Miniature'),
            ),
            if (categories.isNotEmpty)
              DropdownButton<Category>(
                value: selectedCategory,
                hint: Text("Choisir une catégorie"),
                onChanged: (newValue) {
                  setState(() {
                    selectedCategory = newValue;
                  });
                },
                items: categories.map((Category category) {
                  return DropdownMenuItem<Category>(
                    value: category,
                    child: Text(category.name),
                  );
                }).toList(),
              ),
            if (relationTypes.isNotEmpty)
              MultiSelectDialogField<RelationType>(
                items: relationTypes.map((relationType) => MultiSelectItem<RelationType>(relationType, relationType.name)).toList(),
                title: Text("Types de relation"),
                selectedItemsTextStyle: TextStyle(color: Colors.blue),
                onConfirm: (values) {
                  selectedRelationTypes = values as List<RelationType>;
                },
                buttonText: Text("Choisir les types de relation"),
              ),
            if (resourceTypes.isNotEmpty)
              DropdownButton<ResourceType>(
                value: selectedResourceType,
                hint: Text("Choisir le type de ressource"),
                onChanged: (newValue) {
                  setState(() {
                    selectedResourceType = newValue;
                  });
                },
                items: resourceTypes.map((ResourceType type) {
                  return DropdownMenuItem<ResourceType>(
                    value: type,
                    child: Text(type.name),
                  );
                }).toList(),
              ),
            quill.QuillToolbar.simple(configurations: toolbarConfig),
            Container(
              padding: const EdgeInsets.all(8),
              child: quill.QuillEditor(
                key: UniqueKey(),
                focusNode: _focusNode,
                scrollController: _scrollController,
                configurations: editorConfig,
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _handleSubmit,
              child: const Text('Soumettre'),
            ),
          ],
        ),
      ),
    );
  }
}
