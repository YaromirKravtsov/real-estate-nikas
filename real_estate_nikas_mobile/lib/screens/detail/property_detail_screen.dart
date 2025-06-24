import 'dart:convert';
import 'package:flutter/material.dart';
import '../../data/models/property_response.dart';
import '../../data/models/property_view_request.dart';
import '../../data/services/property_service.dart';

class PropertyDetailScreen extends StatelessWidget {
  final PropertyResponse property;

  const PropertyDetailScreen({super.key, required this.property});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(property.name)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(),
            const SizedBox(height: 16),
            _buildDetails(),
            const SizedBox(height: 16),
            _buildDescription(),
            const SizedBox(height: 16),
            _buildAgentContactForm(context),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(property.name, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        Text('${property.address}, ${property.city}'),
        const SizedBox(height: 16),
        SizedBox(
          height: 200,
          child: PageView(
            children: property.images.map((img) {
              return ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(img.imageUrl, fit: BoxFit.cover),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildDetails() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _iconDetail(Icons.bed, '${property.bedrooms}'),
        _iconDetail(Icons.bathtub, '${property.bathrooms}'),
        _iconDetail(Icons.calendar_today, '${property.yearBuilt}'),
      ],
    );
  }

  Widget _iconDetail(IconData icon, String value) {
    return Column(
      children: [
        Icon(icon),
        Text(value),
      ],
    );
  }

  Widget _buildDescription() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('${property.price} \$', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text('Опис', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text(property.description),
      ],
    );
  }

  Widget _buildAgentContactForm(BuildContext context) {
    final nameController = TextEditingController();
    final emailController = TextEditingController();
    final phoneController = TextEditingController();
    final messageController = TextEditingController();

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                const CircleAvatar(
                    backgroundImage: NetworkImage('https://randomuser.me/api/portraits/women/1.jpg')),
                const SizedBox(width: 12),
                Text('${property.agent.firstName} ${property.agent.lastName}'),
              ],
            ),
            const SizedBox(height: 16),
            TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Ваше імʼя')),
            TextField(controller: phoneController, decoration: const InputDecoration(labelText: 'Телефон')),
            TextField(controller: emailController, decoration: const InputDecoration(labelText: 'Електронна пошта')),
            TextField(controller: messageController, decoration: const InputDecoration(labelText: 'Добрий день, я зацікавлений в...')),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () async {
                final name = nameController.text.trim();
                final email = emailController.text.trim();
                final phone = phoneController.text.trim();
                final message = messageController.text.trim();

                if (name.isEmpty || email.isEmpty || phone.isEmpty || message.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Будь ласка, заповніть усі поля')),
                );
                return;
                }

                final request = PropertyViewRequest(
                name: name,
                email: email,
                phone: phone,
                message: message,
                propertyId: property.id,
                );

                try {
                  await PropertyService.submitPropertyView(request);
                  ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Заявку успішно надіслано!')),
                  );
                  nameController.clear();
                  emailController.clear();
                  phoneController.clear();
                  messageController.clear();
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Помилка при відправці: $e')),
                  );
                }
              },
              icon: const Icon(Icons.arrow_forward),
              label: const Text('Відправити заявку'),
            ),
          ],
        ),
      ),
    );
  }
}
