// ignore_for_file: use_null_aware_elements

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints.dart';

import 'settings_model.dart';

class SettingsRepository {
  SettingsRepository(this._client);

  final ApiClient _client;

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Extrae el campo `data` como [Map] y lanza si `success` es false o si
  /// `data` es null (evita _CastError silencioso en respuestas de error).
  Map<String, dynamic> _dataMap(Map<String, dynamic> resp) {
    final success = resp['success'] as bool? ?? false;
    final data = resp['data'];
    if (!success || data == null) {
      throw Exception(resp['error']?.toString() ?? 'Error de servidor');
    }
    return data as Map<String, dynamic>;
  }

  /// Extrae el campo `data` como [List] con las mismas garantías que [_dataMap].
  List<dynamic> _dataList(Map<String, dynamic> resp) {
    final success = resp['success'] as bool? ?? false;
    final data = resp['data'];
    if (!success || data == null) {
      throw Exception(resp['error']?.toString() ?? 'Error de servidor');
    }
    return data as List<dynamic>;
  }

  // ── About ─────────────────────────────────────────────────────────────────

  Future<AboutSettings> getAbout() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.settingsSection('about'),
    );
    return AboutSettings.fromJson(_dataMap(resp));
  }

  Future<AboutSettings> updateAbout(Map<String, Object?> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.settingsSection('about'),
      data: data,
    );
    return AboutSettings.fromJson(_dataMap(resp));
  }

  // ── Contact ───────────────────────────────────────────────────────────────

  Future<ContactSettings> getContact() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.settingsSection('contact'),
    );
    return ContactSettings.fromJson(_dataMap(resp));
  }

  Future<ContactSettings> updateContact(Map<String, Object?> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.settingsSection('contact'),
      data: data,
    );
    return ContactSettings.fromJson(_dataMap(resp));
  }

  // ── Theme ─────────────────────────────────────────────────────────────────

  Future<ThemeSettings> getTheme() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.settingsSection('theme'),
    );
    return ThemeSettings.fromJson(_dataMap(resp));
  }

  Future<ThemeSettings> updateTheme(Map<String, Object?> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.settingsSection('theme'),
      data: data,
    );
    return ThemeSettings.fromJson(_dataMap(resp));
  }

  // ── Site ──────────────────────────────────────────────────────────────────

  Future<SiteSettings> getSite() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.settingsSection('site'),
    );
    return SiteSettings.fromJson(_dataMap(resp));
  }

  Future<SiteSettings> updateSite(Map<String, Object?> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.settingsSection('site'),
      data: data,
    );
    return SiteSettings.fromJson(_dataMap(resp));
  }

  // ── Home ──────────────────────────────────────────────────────────────────

  Future<HomeSettings> getHome() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.settingsSection('home'),
    );
    return HomeSettings.fromJson(_dataMap(resp));
  }

  Future<HomeSettings> updateHome(Map<String, Object?> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.settingsSection('home'),
      data: data,
    );
    return HomeSettings.fromJson(_dataMap(resp));
  }

  // ── Category Display Settings ───────────────────────────────────────────────

  Future<CategoryDisplaySettings> getCategorySettings() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.settingsSection('category'),
    );
    return CategoryDisplaySettings.fromJson(_dataMap(resp));
  }

  Future<CategoryDisplaySettings> updateCategorySettings(
    Map<String, Object?> data,
  ) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.settingsSection('category'),
      data: data,
    );
    return CategoryDisplaySettings.fromJson(_dataMap(resp));
  }

  // ── Social Links ──────────────────────────────────────────────────────────

  Future<List<SocialLink>> getSocialLinks() async {
    final resp = await _client.get<Map<String, dynamic>>(Endpoints.socialLinks);
    final list = _dataList(resp);
    return list
        .map((e) => SocialLink.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<SocialLink> upsertSocialLink(Map<String, Object?> data) async {
    final resp = await _client.post<Map<String, dynamic>>(
      Endpoints.socialLinks,
      data: data,
    );
    return SocialLink.fromJson(_dataMap(resp));
  }
}
