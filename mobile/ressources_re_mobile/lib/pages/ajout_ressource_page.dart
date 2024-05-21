import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_quill/flutter_quill.dart' as quill;
import 'package:http/http.dart' as http;
import 'package:multi_select_flutter/multi_select_flutter.dart';
import 'package:path/path.dart' as path;
import 'package:image_picker/image_picker.dart';
import 'package:quill_html_converter/quill_html_converter.dart';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';

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
  Category? selectedCategory;
  File? imageFile;
  Uint8List? webImage;
  bool isPrivate = false;
  List<RelationType> relationTypes = [];
  List<RelationType> selectedRelationTypes = [];
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
      var url = Uri.parse('${ApiConfig.apiUrl}/api/options');
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

      fileName = pickedFile.name;
      print("Nom de l'image: $fileName");
    } else {
      print('Aucune image sélectionnée.');
    }
  }

  Future<void> _uploadImage(int idRessource) async {
    if (imageFile != null) {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${ApiConfig.apiUrl}/api/uploads'),
      );

      request.fields['idRessource'] = idRessource.toString();

      if (kIsWeb) {
        var response = await http.get(Uri.parse(imageFile!.path));

        if (response.statusCode == 200) {
          var imageData = response.bodyBytes;

          var multipartFile = http.MultipartFile.fromBytes(
            'miniature[]',
            imageData,
            filename: fileName,
          );

          request.files.add(multipartFile);
        } else {
          print('Failed to fetch image data: ${response.statusCode}');
          return;
        }
      } else {
        request.files.add(await http.MultipartFile.fromPath(
          'miniature[]',
          imageFile!.path,
        ));
      }

      var response2 = await request.send();

      if (response2.statusCode == 201) {
        print('File uploaded successfully');
      } else {
        print('File upload failed with status: ${response2.statusCode}');
      }
    }
  }

  void _handleSubmit() async {
    // Vérification des champs obligatoires
    if (titreController.text.isEmpty ||
        descriptionController.text.isEmpty ||
        selectedCategory == null ||
        selectedResourceType == null ||
        selectedRelationTypes.isEmpty ||
        _controller.document.toPlainText().trim().isEmpty) {
      _showAlert('Tous les champs doivent être remplis.');
      return;
    }

    final uri = Uri.parse('${ApiConfig.apiUrl}/api/ressources');
    final headers = {'Content-Type': 'application/json'};

    List<String> formattedTypeRelations = selectedRelationTypes
        .map((relationType) => '/api/type_relations/${relationType.id}')
        .toList();

    print("Submitting resource...");
    print(imageFile != null ? path.basename(imageFile!.path) : null);
    print('---------------------------------------------------------------------------------------------------------------------------------');
    print(_controller.document.toDelta().toHtml());
    print('---------------------------------------------------------------------------------------------------------------------------------');

    Map<String, dynamic> body = {
      'titre': titreController.text,
      'contenu': _controller.document.toDelta().toHtml(),
      'dateCreation': DateTime.now().toIso8601String(),
      'dateModification': DateTime.now().toIso8601String(),
      'nombreVue': 0,
      'proprietaire': '/api/utilisateurs/2',
      'statut': '/api/statuts/2',
      'visibilite': isPrivate ? '/api/visibilites/1' : '/api/visibilites/2',
      'categorie': selectedCategory != null
          ? '/api/categories/${selectedCategory?.id}'
          : null,
      'valide': false,
      'typeDeRessource': selectedResourceType != null
          ? '/api/type_de_ressources/${selectedResourceType?.id}'
          : null,
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
        Map<String, dynamic> responseData = json.decode(response.body);
        int id = responseData['id'];
        await _uploadImage(id);
      }
    } else {
      print('Erreur lors de la soumission: ${response.statusCode}');
      print('Réponse du serveur: ${response.body}');
    }
  }

  void _showAlert(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Erreur'),
          content: Text(message),
          actions: <Widget>[
            TextButton(
              child: Text('OK'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    quill.QuillSimpleToolbarConfigurations toolbarConfig =
        quill.QuillSimpleToolbarConfigurations(
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
      placeholder: 'Commencez à écrire ici...',
      scrollable: true,
      padding: const EdgeInsets.all(10),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ajouter Ressource'),
        backgroundColor: Colors.teal,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15.0),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    if (imageFile == null)
                      const Text('Aucune image sélectionnée.')
                    else
                      const Text('Image sélectionnée.'),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: _pickImage,
                      child: const Text('Choisir une Miniature'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.teal,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            SwitchListTile(
              title: const Text('Privé'),
              value: isPrivate,
              onChanged: (bool value) {
                setState(() {
                  isPrivate = value;
                });
              },
            ),
            const SizedBox(height: 16),
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15.0),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    TextField(
                      controller: titreController,
                      decoration: InputDecoration(
                        labelText: 'Titre de la ressource',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: descriptionController,
                      decoration: InputDecoration(
                        labelText: 'Description',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                      ),
                      maxLines: 3,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            if (categories.isNotEmpty)
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15.0),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: DropdownButton<Category>(
                    value: selectedCategory,
                    hint: const Text("Choisir une catégorie"),
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
                    isExpanded: true,
                  ),
                ),
              ),
            const SizedBox(height: 16),
            if (relationTypes.isNotEmpty)
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15.0),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: MultiSelectDialogField<RelationType>(
                    items: relationTypes
                        .map((relationType) =>
                            MultiSelectItem<RelationType>(relationType, relationType.name))
                        .toList(),
                    title: const Text("Types de relation"),
                    selectedItemsTextStyle: const TextStyle(color: Colors.blue),
                    onConfirm: (values) {
                      setState(() {
                        selectedRelationTypes = values as List<RelationType>;
                      });
                    },
                    buttonText: const Text("Choisir les types de relation"),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: Colors.teal,
                        width: 2,
                      ),
                    ),
                  ),
                ),
              ),
            const SizedBox(height: 16),
            if (resourceTypes.isNotEmpty)
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15.0),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: DropdownButton<ResourceType>(
                    value: selectedResourceType,
                    hint: const Text("Choisir le type de ressource"),
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
                    isExpanded: true,
                  ),
                ),
              ),
            const SizedBox(height: 16),
            quill.QuillToolbar.simple(configurations: toolbarConfig),
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15.0),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: quill.QuillEditor(
                  key: UniqueKey(),
                  focusNode: _focusNode,
                  scrollController: _scrollController,
                  configurations: editorConfig,
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _handleSubmit,
              child: const Text('Soumettre'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.teal,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                textStyle: const TextStyle(fontSize: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
