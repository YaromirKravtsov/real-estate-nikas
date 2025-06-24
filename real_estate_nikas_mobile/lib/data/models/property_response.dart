class PropertyImage {
  final int id;
  final int propertyId;
  final String imageUrl;
  final bool isMain;
  final String fullUrl;

  PropertyImage({
    required this.id,
    required this.propertyId,
    required this.imageUrl,
    required this.isMain,
    required this.fullUrl,
  });

  factory PropertyImage.fromJson(Map<String, dynamic> json) {
    return PropertyImage(
      id: json['id'] ?? 0,
      propertyId: json['propertyId'] ?? 0,
      imageUrl: json['imageUrl'] ?? '',
      isMain: json['isMain'] ?? false,
      fullUrl: json['fullUrl'] ?? '',
    );
  }
}

class PropertyAgent {
  final int id;
  final String firstName;
  final String lastName;

  PropertyAgent({
    required this.id,
    required this.firstName,
    required this.lastName,
  });

  factory PropertyAgent.fromJson(Map<String, dynamic> json) {
    return PropertyAgent(
      id: json['id'],
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
    );
  }
}

class PropertyResponse {
  final int id;
  final String name;
  final double price;
  final String address;
  final String city;
  final String listingType;
  final String propertyType;
  final int bedrooms;
  final int bathrooms;
  final int yearBuilt;
  final String description;
  final bool isSubmission;
  final int agentId;
  final List<PropertyImage> images;
  final PropertyAgent agent;

  PropertyResponse({
    required this.id,
    required this.name,
    required this.price,
    required this.address,
    required this.city,
    required this.listingType,
    required this.propertyType,
    required this.bedrooms,
    required this.bathrooms,
    required this.yearBuilt,
    required this.description,
    required this.isSubmission,
    required this.agentId,
    required this.images,
    required this.agent,
  });

  factory PropertyResponse.fromJson(Map<String, dynamic> json) {
    return PropertyResponse(
      id: json['id'],
      name: json['title'] ?? '',
      price: double.tryParse(json['price'].toString().split('.').first) ?? 0,
      address: json['address'] ?? '',
      city: json['city'] ?? '',
      listingType: json['listingType'] ?? '',
      propertyType: json['propertyType'] ?? '',
      bedrooms: json['bedrooms'] ?? 0,
      bathrooms: json['bathrooms'] ?? 0,
      yearBuilt: json['yearBuilt'] ?? 0,
      description: json['description'] ?? '',
      isSubmission: json['is_submission'] ?? false,
      agentId: json['agentId'] ?? 0,
      images: (json['images'] as List<dynamic>?)
          ?.map((img) => PropertyImage.fromJson(img))
          .toList() ??
          [],
      agent: json['agent'] != null
          ? PropertyAgent.fromJson(json['agent'])
          : PropertyAgent(id: 0, firstName: '', lastName: ''),
    );
  }
}
