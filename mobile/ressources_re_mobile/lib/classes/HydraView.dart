class HydraView {
  late String id;
  late String first;
  late String last;

  HydraView({
    required this.id,
    required this.first,
    required this.last,
  });

  HydraView.fromJson(Map<String, dynamic> json) {
    id = json['@id'];
    first = json['hydra:first'] ?? json['@id'];
    last = json['hydra:last'] ?? json['@id'];
  }
}
