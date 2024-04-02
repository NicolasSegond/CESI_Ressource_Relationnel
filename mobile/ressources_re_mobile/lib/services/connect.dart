import 'package:http/http.dart' as http;

class Connect {
  static Future<void> login(String email, String password) async {
    // URL de votre API de connexion
    String url = 'http://127.0.0.1:8000/api/login';

    // Corps de la requête contenant le courrier électronique et le mot de passe
    Map<String, String> body = {
      'email': email,
      'password': password,
    };

    // Envoi de la requête POST
    var response = await http.post(
      Uri.parse(url),
      body: body,
    );

    // Vérification du code de statut de la réponse
    if (response.statusCode == 200) {
      // Connexion réussie
      print('Connexion réussie');
      // Vous pouvez effectuer des actions supplémentaires ici, comme naviguer vers une nouvelle page
    } else {
      // Erreur lors de la connexion
      print('Erreur lors de la connexion');
      // Vous pouvez afficher un message d'erreur à l'utilisateur ou effectuer d'autres actions en fonction de la réponse de votre API
    }
  }
}
