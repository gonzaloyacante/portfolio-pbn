import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../config/app_constants.dart';
import '../utils/app_logger.dart';

/// Provider global del [TokenStorage].
final tokenStorageProvider = Provider<TokenStorage>((ref) => TokenStorage());

/// Wrapper tipado sobre flutter_secure_storage.
/// TODOS los tokens se guardan aquí — NUNCA en SharedPreferences.
class TokenStorage {
  TokenStorage()
    : _storage = const FlutterSecureStorage(
        aOptions: AndroidOptions(encryptedSharedPreferences: true),
        iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
      );

  final FlutterSecureStorage _storage;

  // ── Access Token ─────────────────────────────────────────────────────────

  Future<void> saveAccessToken(String token) async {
    await _storage.write(key: AppConstants.kAccessTokenKey, value: token);
  }

  Future<String?> getAccessToken() async {
    return _storage.read(key: AppConstants.kAccessTokenKey);
  }

  Future<void> deleteAccessToken() async {
    await _storage.delete(key: AppConstants.kAccessTokenKey);
  }

  // ── Refresh Token ─────────────────────────────────────────────────────────

  Future<void> saveRefreshToken(String token) async {
    await _storage.write(key: AppConstants.kRefreshTokenKey, value: token);
  }

  Future<String?> getRefreshToken() async {
    return _storage.read(key: AppConstants.kRefreshTokenKey);
  }

  Future<void> deleteRefreshToken() async {
    await _storage.delete(key: AppConstants.kRefreshTokenKey);
  }

  // ── Google OAuth ──────────────────────────────────────────────────────────

  Future<void> saveGoogleAccessToken(String token) async {
    await _storage.write(key: AppConstants.kGoogleAccessTokenKey, value: token);
  }

  Future<String?> getGoogleAccessToken() async {
    return _storage.read(key: AppConstants.kGoogleAccessTokenKey);
  }

  Future<void> deleteGoogleTokens() async {
    await Future.wait([
      _storage.delete(key: AppConstants.kGoogleAccessTokenKey),
      _storage.delete(key: AppConstants.kGoogleRefreshTokenKey),
    ]);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Elimina todos los tokens — usado en logout.
  Future<void> clearAll() async {
    try {
      await Future.wait([
        _storage.delete(key: AppConstants.kAccessTokenKey),
        _storage.delete(key: AppConstants.kRefreshTokenKey),
        _storage.delete(key: AppConstants.kGoogleAccessTokenKey),
        _storage.delete(key: AppConstants.kGoogleRefreshTokenKey),
      ]);
    } catch (e) {
      AppLogger.error('TokenStorage.clearAll failed', e);
    }
  }

  /// Verifica si hay una sesión guardada (tiene refresh token).
  Future<bool> hasSession() async {
    final token = await getRefreshToken();
    return token != null && token.isNotEmpty;
  }
}
