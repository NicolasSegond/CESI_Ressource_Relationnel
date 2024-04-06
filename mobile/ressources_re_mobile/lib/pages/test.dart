import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: FilterPage(),
    );
  }
}

class FilterPage extends StatefulWidget {
  @override
  _FilterPageState createState() => _FilterPageState();
}

class _FilterPageState extends State<FilterPage> {
  List<dynamic> visibilites = [
    {"id": 1, "name": "Public"},
    {"id": 2, "name": "Privé"},
    {"id": 3, "name": "Partage"},
  ];
  List<dynamic> categories = [];
  List<dynamic> relationTypes = [];
  List<dynamic> resourceTypes = [];

  Map<String, List<int>> selectedFilters = {
    'Visibilité': [],
    'Category': [],
    'Relation Type': [],
    'Resource Type': [],
  };

  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    setState(() {
      isLoading = true;
    });

    final response =
        await http.get(Uri.parse('http://127.0.0.1:8000/api/options'));
    if (response.statusCode == 200) {
      Map<String, dynamic> data = json.decode(response.body);
      setState(() {
        categories = data['categories'];
        relationTypes = data['relationTypes'];
        resourceTypes = data['resourceTypes'];
        isLoading = false;
      });
    } else {
      throw Exception('Failed to load data');
    }
  }

  void _openFilterModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            return Padding(
              padding: EdgeInsets.only(left: 20),
              child: Container(
                height: MediaQuery.of(context).size.height * 0.7,
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      _buildFilter('Visibilité', visibilites, setState),
                      _buildFilter('Category', categories, setState),
                      _buildFilter('Relation Type', relationTypes, setState),
                      _buildFilter(
                          'Resource Type', resourceTypes, setState),
                      SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          // Apply selected filters
                          Navigator.pop(context);
                        },
                        child: Text('Apply Filters'),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildFilter(
      String filterName, List<dynamic> items, StateSetter setState) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(8.0, 8.0, 8.0, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            filterName,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
          SizedBox(height: 10),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: items.map<Widget>((item) {
              bool isSelected =
                  selectedFilters[filterName]!.contains(item['id']);
              return ChoiceChip(
                label: Text(item['name']),
                selected: isSelected,
                onSelected: (selected) {
                  setState(() {
                    if (selected) {
                      selectedFilters[filterName]!.add(item['id']);
                    } else {
                      selectedFilters[filterName]!.remove(item['id']);
                    }
                  });
                  // Update main page state
                  updateMainPage();
                },
                selectedColor: Colors.blue,
                labelStyle:
                    TextStyle(color: isSelected ? Colors.white : Colors.black),
                backgroundColor: Colors.grey[300],
                elevation: isSelected ? 4 : 0,
                pressElevation: isSelected ? 8 : 0,
                shadowColor: isSelected ? Colors.blue : Colors.transparent,
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  void updateMainPage() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Filters Demo'),
      ),
      body: isLoading
          ? Center(
              child: CircularProgressIndicator(),
            )
          : Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      _openFilterModal(context);
                    },
                    child: Text('Open Filters'),
                  ),
                  SizedBox(height: 20),
                  Text('Selected Filters:'),
                  SizedBox(height: 10),
                  Text('Visibilité: ${selectedFilters['Visibilité']}'),
                  Text('Category: ${selectedFilters['Category']}'),
                  Text(
                      'Relation Type: ${selectedFilters['Relation Type']}'),
                  Text(
                      'Resource Type: ${selectedFilters['Resource Type']}'),
                ],
              ),
            ),
    );
  }
}


