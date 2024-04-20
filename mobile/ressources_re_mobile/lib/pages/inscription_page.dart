import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SignUp extends StatefulWidget {
  @override
  _SignUpState createState() => _SignUpState();
}

class _SignUpState extends State<SignUp> {
  final TextEditingController _nomController = TextEditingController();
  final TextEditingController _prenomController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xffe6e6e6),
      body: Stack(
        children: [
          Container(
            width: MediaQuery.of(context).size.width,
            height: MediaQuery.of(context).size.height * 0.35,
            decoration: BoxDecoration(
              color: Color.fromRGBO(3, 152, 158, 1),
            ),
          ),
          Container(
            margin: EdgeInsets.fromLTRB(20, 100, 20, 20),
            padding: EdgeInsets.all(16),
            width: MediaQuery.of(context).size.width,
            height: MediaQuery.of(context).size.height,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16.0),
              border: Border.all(color: Color(0x4d9e9e9e), width: 1),
            ),
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  children: <Widget>[
                    Image(
                      image: AssetImage("img/logo.png"),
                      height: 200,
                      width: 200,
                      fit: BoxFit.cover,
                    ),
                    SizedBox(height: 30),
                    _buildTextField("Nom", _nomController),
                    _buildTextField("Prénom", _prenomController),
                    _buildTextField("Email", _emailController),
                    _buildTextField("Mot de Passe", _passwordController, isPassword: true),
                    _buildTextField("Confirmer le Mot de Passe", _confirmPasswordController, isPassword: true),
                    MaterialButton(
                      onPressed: _submitForm,
                      color: Color.fromRGBO(3, 152, 158, 1),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      padding: EdgeInsets.symmetric(vertical: 16),
                      child: Text(
                        "Inscription",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                      minWidth: MediaQuery.of(context).size.width,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, {bool isPassword = false}) {
    return TextFormField(
      controller: controller,
      obscureText: isPassword,
      validator: (value) => _validateField(value, label),
      decoration: InputDecoration(
        labelText: label,
        border: UnderlineInputBorder(),
      ),
    );
  }

  String? _validateField(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return 'Ce champ est obligatoire';
    }
    if (fieldName == "Email" && !value.contains('@')) {
      return 'Entrez un email valide';
    }
    if (fieldName.contains("Mot de Passe")) {
      RegExp regex = RegExp(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{13,}$");
      if (!regex.hasMatch(value)) {
        return 'Le mot de passe doit contenir au moins 13 caractères, dont au moins une majuscule, un chiffre et un caractère spécial';
      }
    }
    if (fieldName == "Confirmer le Mot de Passe" && value != _passwordController.text) {
      return 'Les mots de passe ne correspondent pas';
    }
    return null;
  }

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      // Si tout est valide, on envoie les données
      final Map<String, dynamic> formData = {
        'nom': _nomController.text,
        'prenom': _prenomController.text,
        'email': _emailController.text,
        'password': _passwordController.text,  // Assurez-vous de sécuriser la transmission des mots de passe
        'passwordControl': _confirmPasswordController.text,
        'roles': ["string"],  // You may adjust this as needed
        'code': 0,
        'verif': false
      };
      String body = jsonEncode(formData);
      try {
        var response = await http.post(
          Uri.parse('http://127.0.0.1:8000/api/utilisateurs'),
          headers: <String, String>{
            'Content-Type': 'application/ld+json',
          },
          body: body,
        );
        if (response.statusCode == 201) {
          // Gestion du succès
          showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              title: Text("Succès"),
              content: Text("Inscription réussie, veuillez vérifier votre email pour activer votre compte"),
              actions: <Widget>[
                TextButton(
                  onPressed: () {
                    Navigator.of(ctx).pop();
                  },
                  child: Text("OK"),
                ),
              ],
            ),
          );
        } else {
          // Gestion des erreurs de réponse
          showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              title: Text("Erreur, veuillez réessayer"),
              content: Text("Erreur lors de l'inscription, veuillez réessayer plus tard"),
              actions: <Widget>[
                TextButton(
                  onPressed: () {
                    Navigator.of(ctx).pop();
                  },
                  child: Text("OK"),
                ),
              ],
            ),
          );
        }
      } catch (e) {
        // Gestion des erreurs de réseau ou de parsing
        print(e);  // Pour le debugging
      }
    }
  }

  @override
  void dispose() {
    _nomController.dispose();
    _prenomController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }
}
