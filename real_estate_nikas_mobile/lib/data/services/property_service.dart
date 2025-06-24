import 'package:http/http.dart' as http;
import 'dart:convert';

import '../models/property_response.dart';
import '../models/search_property_dto.dart';
import '../models/search_response.dart';
import '../models/property_view_request.dart';

class PropertyService {
  static const String baseSearchUrl = 'http://127.0.0.1:5001/properties/search';
  static const String baseUrl = 'http://127.0.0.1:5001';

  static Future<SearchResponse<PropertyResponse>> searchProperties(SearchPropertyDto dto) async {
    final uri = Uri.parse(baseSearchUrl).replace(queryParameters: dto.toQueryParameters());
    print('🔍 Sending GET request to: $uri');

    final response = await http.get(uri);

    print('📦 Status code: ${response.statusCode}');
    print('📦 Response body: ${response.body}');

    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);
      return SearchResponse<PropertyResponse>.fromJson(
        jsonData,
            (item) => PropertyResponse.fromJson(item),
      );
    } else {
      throw Exception('Failed to load properties');
    }
  }

  static Future<PropertyResponse> getPropertyById(int id) async {
    final uri = Uri.parse('$baseUrl/properties/by-id/$id');
    print('📄 Sending GET request to: $uri');

    final response = await http.get(uri);

    print('📥 Status code: ${response.statusCode}');
    print('📥 Response body: ${response.body}');

    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);
      return PropertyResponse.fromJson(jsonData);
    } else {
      throw Exception('Failed to load property by ID');
    }
  }

  static Future<void> submitPropertyView(PropertyViewRequest request) async {
    final uri = Uri.parse('$baseUrl/property-views/view');
    print('📧 Sending POST request to: $uri');

    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: json.encode(request.toJson()),
    );

    print('📤 Status code: ${response.statusCode}');
    print('📤 Response body: ${response.body}');

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Failed to submit property view');
    }
  }
}
