class PropertyViewRequest {
  final String name;
  final String email;
  final String phone;
  final String message;
  final int propertyId;

  PropertyViewRequest({
    required this.name,
    required this.email,
    required this.phone,
    required this.message,
    required this.propertyId,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'phone': phone,
      'message': message,
      'propertyId': propertyId,
    };
  }
}
