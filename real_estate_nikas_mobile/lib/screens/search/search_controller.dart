import 'package:flutter/material.dart';
import '../../data/models/property_response.dart';
import '../../data/models/search_property_dto.dart';
import '../../data/services/property_service.dart';

class SearchController {
  final cityController = TextEditingController();
  final priceFromController = TextEditingController();
  final priceToController = TextEditingController();
  final areaController = TextEditingController();

  int currentPage = 1;
  int total = 0;
  int limit = 5;
  bool isLoading = false;
  List<PropertyResponse> properties = [];

  final ValueNotifier<void> notifier = ValueNotifier(null);

  void dispose() {
    cityController.dispose();
    priceFromController.dispose();
    priceToController.dispose();
    areaController.dispose();
    notifier.dispose();
  }

  Future<void> search() async {
    print('🔍 Starting search...');
    isLoading = true;
    notifier.value = null;

    final dto = SearchPropertyDto(
      city: cityController.text.isNotEmpty ? cityController.text : null,
      priceFrom: int.tryParse(priceFromController.text),
      priceTo: int.tryParse(priceToController.text),
      page: currentPage,
      limit: limit,
    );

    print('📤 Sending DTO: ${dto.toQueryParameters()}');

    try {
      final result = await PropertyService.searchProperties(dto);
      print('✅ Response received. Total: ${result.total}, Fetched: ${result.data.length}');

      total = result.total;
      properties = result.data;

      for (var i = 0; i < properties.length; i++) {
        print('🏠 Property $i: ${properties[i].name}');
      }

    } catch (e) {
      print('❌ Error during search: $e');
      properties = [];
    } finally {
      isLoading = false;
      notifier.value = null;
      notifier.notifyListeners();
      print('🔁 Notifier updated, isLoading = $isLoading');
    }
  }

  void goToPage(int page) {
    currentPage = page;
    search();
  }
}
