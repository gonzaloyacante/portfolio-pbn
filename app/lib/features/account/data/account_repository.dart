import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';

class AccountRepository {
  final ApiClient _client;

  const AccountRepository(this._client);

  /// Cambia la contraseña del usuario autenticado.
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.authMe,
      data: {'currentPassword': currentPassword, 'newPassword': newPassword},
    );
    final success = resp['success'] as bool? ?? false;
    if (!success) {
      throw Exception(resp['error']?.toString() ?? 'Error al cambiar contraseña');
    }
  }

  /// Actualiza el nombre del usuario autenticado.
  Future<void> updateProfile({required String name}) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.authMe,
      data: {'name': name},
    );
    final success = resp['success'] as bool? ?? false;
    if (!success) {
      throw Exception(resp['error']?.toString() ?? 'Error al actualizar perfil');
    }
  }
}
