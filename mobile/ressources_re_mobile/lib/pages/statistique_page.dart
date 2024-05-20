import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:fl_chart/fl_chart.dart';

import 'package:provider/provider.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:flutter_date_range_picker/flutter_date_range_picker.dart';
import 'package:ressources_re_mobile/utilities/apiConfig.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => DashboardProvider(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: DashboardAdmin(),
    );
  }
}

class DashboardProvider with ChangeNotifier {
  bool loading = false;
  int? totalRessources;
  int? totalRessourcesNonValider;
  int? totalUtilisateurs;
  Map<String, dynamic>? dataStatistique;
  List<dynamic> dataRessourceByVue = [];
  DateTimeRange selectedDateRange = DateTimeRange(
    start: DateTime.now().subtract(const Duration(days: 30)), // Définir une plage de dates de 30 jours avant la date actuelle
    end: DateTime.now(), // Date actuelle
  );

  Future<void> fetchData() async {
    setLoading(true);
    try {
      // Construire les URLs avec les paramètres nécessaires
      String vueUrl = '${ApiConfig.apiUrl}/api/ressources?page=1&order%5BnombreVue%5D=desc&dateCreation%5Bbefore%5D=${_formatDate(selectedDateRange.end)}&dateCreation%5Bafter%5D=${_formatDate(selectedDateRange.start)}';
      String nonValiderUrl = '${ApiConfig.apiUrl}/api/ressources?statut=2&dateCreation%5Bbefore%5D=${_formatDate(selectedDateRange.end)}&dateCreation%5Bafter%5D=${_formatDate(selectedDateRange.start)}';
      String ressourceParMoisUrl = '${ApiConfig.apiUrl}/api/dashboard_admin/ressourcesByMonth?dateCreation%5Bbefore%5D=${_formatDate(selectedDateRange.end)}&dateCreation%5Bafter%5D=${_formatDate(selectedDateRange.start)}';

      // Log des URLs
      print('URL de la vue : $vueUrl');
      print('URL des ressources non validées : $nonValiderUrl');
      print('URL des ressources par mois : $ressourceParMoisUrl');

      // Fetch data from APIs
      var vueResponse = await http.get(Uri.parse(vueUrl));
      var nonValiderResponse = await http.get(Uri.parse(nonValiderUrl));
      var ressourceParMoisResponse = await http.get(Uri.parse(ressourceParMoisUrl));
      var utilisateurResponse = await http.get(Uri.parse('${ApiConfig.apiUrl}/api/utilisateurs'));

      // Log des réponses
     // print('Réponse de la vue : ${vueResponse.body}');
     // print('Réponse des ressources non validées : ${nonValiderResponse.body}');
     // print('Réponse des ressources par mois : ${ressourceParMoisResponse.body}');
   //   print('Réponse des utilisateurs : ${utilisateurResponse.body}');

      // Parse JSON responses
      var vueData = json.decode(vueResponse.body);
      var nonValiderData = json.decode(nonValiderResponse.body);
      var ressourceParMoisData = json.decode(ressourceParMoisResponse.body);
      var utilisateurData = json.decode(utilisateurResponse.body);

      // Log des données parsées
    //  print('Données de la vue : $vueData');
   //   print('Données des ressources non validées : $nonValiderData');
    //  print('Données des ressources par mois : $ressourceParMoisData');
   //   print('Données des utilisateurs : $utilisateurData');

      // Assigner les données récupérées
      dataRessourceByVue = vueData['hydra:member'];
      totalRessources = vueData['hydra:totalItems'];
      totalRessourcesNonValider = nonValiderData['hydra:totalItems'];
      totalUtilisateurs = utilisateurData['hydra:totalItems'];
      dataStatistique = ressourceParMoisData;
      print (dataStatistique);

    } catch (error) {
      print('Erreur lors de la récupération des données : $error');
    } finally {
      setLoading(false);
    }
  }

  void setLoading(bool value) {
    loading = value;
    notifyListeners();
  }

  String _formatDate(DateTime date) {
    return "${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}";
  }
}

class DashboardAdmin extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final dashboardProvider = Provider.of<DashboardProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard Admin'),
      ),
      body: dashboardProvider.loading
          ? Center(child: SpinKitCircle(color: Colors.blue))
          : SingleChildScrollView(
              child: Column(
                children: [
                  FilterSection(),
                  StatSection(),
                  DataTableSection(),
                ],
              ),
            ),
    );
  }
}


class FilterSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final dashboardProvider = Provider.of<DashboardProvider>(context);

    return Column(
      children: [
        ElevatedButton(
          onPressed: () async {
            final newRange = await showDialog<DateRange>(
              context: context,
              builder: (BuildContext context) {
              return AlertDialog(
                content: SizedBox(
                  height: MediaQuery.of(context).size.height * 0.4, // Augmentez la hauteur de la boîte de dialogue (60% de la hauteur de l'écran)
                  child: SingleChildScrollView(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          height: MediaQuery.of(context).size.height * 0.4, // Augmentez la hauteur du DateRangePickerWidget (50% de la hauteur de l'écran)
                          child: DateRangePickerWidget(
                            doubleMonth: false,
                            maximumDateRangeLength: 750,
                            minimumDateRangeLength: 1,
                            initialDateRange: DateRange(
                              DateTime.now(), // Utilisez DateTime.now() comme date par défaut
                              DateTime.now(),
                            ),
                            disabledDates: [DateTime(2023, 11, 20)],
                            initialDisplayedDate: DateTime.now(),
                            onDateRangeChanged: (newRange) {
                              Navigator.of(context).pop(newRange);
                            },
                          ),
                        ),
                        SizedBox(height: 8), // Ajout d'une marge inférieure pour éviter le dépassement de capacité
                      ],
                    ),
                  ),
                ),
              );





              },
            );
            if (newRange != null) {
              dashboardProvider.selectedDateRange = DateTimeRange(start: newRange.start, end: newRange.end);
              await dashboardProvider.fetchData();
            }
          },
          child: Text('Sélectionnez une plage de dates'),
        ),

        // Ajoutez d'autres filtres ici
      ],
    );
  }
}
class MonthDataTable extends StatelessWidget {
  final List<dynamic> ressourcesByMonth;

  MonthDataTable({required this.ressourcesByMonth});
  
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(8.0),
      padding: EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: DataTable(
        columns: [
          DataColumn(label: Text('Mois')),
          DataColumn(label: Text('Nombre de ressources')),
        ],
        rows: ressourcesByMonth.map<DataRow>((monthData) {
          // Cast monthData to Map<String, dynamic>
          Map<String, dynamic> data = monthData as Map<String, dynamic>;
          return DataRow(
            cells: [
              DataCell(
                Text(
                  data['moisCreation'],
                ),
              ),
              DataCell(
                Text(
                  data['count'].toString(),
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }
}

class StatSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final dashboardProvider = Provider.of<DashboardProvider>(context);

    return Column(
      children: [
        // Stat Widgets for total resources, non-validated resources, users, etc.
        StatCard(
          title: 'Nombre de ressources',
          value: dashboardProvider.totalRessources.toString(),
        ),
        StatCard(
          title: 'Nombre de ressources non validées',
          value: dashboardProvider.totalRessourcesNonValider.toString(),
        ),
        PieChartSection(dataStatistique: dashboardProvider.dataStatistique),
        if (dashboardProvider.dataStatistique != null && dashboardProvider.dataStatistique!['ressources'] != null)
          MonthDataTable(ressourcesByMonth: dashboardProvider.dataStatistique!['ressources']),
      ],
    );
  }
}

class StatCard extends StatelessWidget {
  final String title;
  final String value;

  StatCard({required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(title),
        trailing: Text(value),
      ),
    );
  }
}

class PieChartSection extends StatelessWidget {
  final Map<String, dynamic>? dataStatistique;

  PieChartSection({this.dataStatistique});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // User Pie Chart
        PieChartWidget(
          data: [
            dataStatistique?['verifier'] ?? 0,
            dataStatistique?['non_verifier'] ?? 0,
            dataStatistique?['bannis'] ?? 0,
          ],
          labels: ['Utilisateurs vérifiés', 'Utilisateurs non vérifiés', 'Utilisateurs bannis'],
        ),
        // Resource Pie Chart
        PieChartWidget(
          data: [
            dataStatistique?['ressource_valide'] ?? 0,
            dataStatistique?['ressource_en_attente'] ?? 0,
            dataStatistique?['ressource_refuse'] ?? 0,
          ],
          labels: ['Ressources valides', 'Ressources en attente', 'Ressources refusées'],
        ),
        
      ],
    );
  }
}

class PieChartWidget extends StatelessWidget {
  final List<int> data;
  final List<String> labels;

  PieChartWidget({required this.data, required this.labels});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(8.0),
      padding: EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(
            width: 300, // Largeur spécifique du PieChartWidget
            height: 200,
            child: PieChart(
              PieChartData(
                sections: List.generate(
                  data.length,
                  (i) {
                    final valueString = data[i].toString();
                    final intValue = int.tryParse(valueString.split('.')[0]) ?? 0;

                    return PieChartSectionData(
                      value: intValue.toDouble(),
                      title: '${intValue}',
                      color: i == 0 ? Colors.blue : i == 1 ? Colors.red : Colors.yellow,
                      radius: 40,
                      titleStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    );
                  },
                ),
                sectionsSpace: 0,
                centerSpaceRadius: 40,
                // Retirez la configuration suivante pour désactiver le toucher
                pieTouchData: PieTouchData(enabled: false),
              ),
            ),
          ),
          SizedBox(height: 8), // Marge entre le graphique et la légende
          Padding(
            padding: const EdgeInsets.only(left: 8.0),
            child: Wrap(
              spacing: 8.0, // Espacement horizontal entre les éléments de la légende
              runSpacing: 4.0, // Espacement vertical entre les lignes de la légende
              children: List.generate(labels.length, (index) {
                return Row(
                  mainAxisSize: MainAxisSize.min, // Pour éviter que chaque élément de la légende ne s'étende sur toute la largeur
                  children: [
                    Container(
                      width: 16,
                      height: 16,
                      color: index == 0 ? Colors.blue : index == 1 ? Colors.red : Colors.yellow,
                    ),
                    SizedBox(width: 4),
                    Text(
                      labels[index],
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(width: 16),
                  ],
                );
              }),
            ),
          ),
        ],
      ),
    );
  }
}

class DataTableSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final dashboardProvider = Provider.of<DashboardProvider>(context);

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: SingleChildScrollView(
        child: Container(
          margin: EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey),
            borderRadius: BorderRadius.circular(8.0),
          ),
          child: DataTable(
            columnSpacing: 10,
            dataRowHeight: 56,
            columns: [
              DataColumn(label: Text('Titre')),
              DataColumn(label: Text('Date de création')),
              DataColumn(label: Text('Nombre de vue')),
              DataColumn(label: Text('Propriétaire')),
            ],
            rows: dashboardProvider.dataRessourceByVue
                .map(
                  (ressource) => DataRow(
                    cells: [
                      DataCell(
                        SizedBox(
                          width: 50, // Largeur fixe pour le titre
                          child: Text(
                            ressource['titre'],
                            style: TextStyle(fontSize: 14), // Optionnel : définissez la taille de la police
                          ),
                        ),
                      ),
                      DataCell(Text(_formatDate(ressource['dateCreation']))),
                      DataCell(Text(ressource['nombreVue'].toString())),
                      DataCell(Text('${ressource['proprietaire']['nom']} ${ressource['proprietaire']['prenom']}')),
                    ],
                  ),
                )
                .toList(),
          ),
        ),
      ),
    );
  }

  String _formatDate(String dateStr) {
    DateTime date = DateTime.parse(dateStr);
    return "${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}";
  }
}




