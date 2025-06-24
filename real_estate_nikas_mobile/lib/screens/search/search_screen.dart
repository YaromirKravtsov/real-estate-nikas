import 'package:flutter/material.dart';
import '../detail/property_detail_screen.dart';
import 'search_controller.dart' as custom;

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final custom.SearchController controller = custom.SearchController();

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      controller.search();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Оголошення')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildFilters(),
            const SizedBox(height: 16),
            Expanded(
              child: ValueListenableBuilder(
                valueListenable: controller.notifier,
                builder: (_, __, ___) {
                  if (controller.isLoading) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  return Column(
                    children: [
                      _buildTableHeader(),
                      Expanded(child: _buildTable()),
                      _buildPagination(),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilters() {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: controller.cityController,
            decoration: const InputDecoration(labelText: 'Місто'),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: TextField(
            controller: controller.priceFromController,
            decoration: const InputDecoration(labelText: 'Ціна від'),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: TextField(
            controller: controller.priceToController,
            decoration: const InputDecoration(labelText: 'Ціна до'),
          ),
        ),
        const SizedBox(width: 8),
        ElevatedButton(
          onPressed: controller.search,
          child: const Text('Шукати'),
        ),
      ],
    );
  }

  Widget _buildTableHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: const [
          Expanded(
            child: Text('Назва', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          Expanded(
            child: Text('Ціна', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          Expanded(
            child: Text('Кількість спалень', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          Expanded(
            child: Text('Адреса', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildTable() {
    return ListView.builder(
      itemCount: controller.properties.length,
      itemBuilder: (_, index) {
        final p = controller.properties[index];
        return InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => PropertyDetailScreen(property: p),
              ),
            );
          },
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(8),
              child: Row(
                children: [
                  Expanded(child: Text(p.name)),
                  Expanded(child: Text('${p.price}\$')),
                  Expanded(child: Text('${p.bedrooms}')),
                  Expanded(child: Text(p.address)),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildPagination() {
    final totalPages = (controller.total / controller.limit).ceil();
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(totalPages, (i) {
        final page = i + 1;
        final isCurrent = page == controller.currentPage;
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: ElevatedButton(
            onPressed: () => controller.goToPage(page),
            style: ElevatedButton.styleFrom(
              backgroundColor: isCurrent ? Colors.black : null,
            ),
            child: Text('$page'),
          ),
        );
      }),
    );
  }
}
