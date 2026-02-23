// ignore_for_file: use_null_aware_elements

import 'package:portfolio_pbn/core/api/api_client.dart';

import 'settings_model.dart';

class SettingsRepository {
  SettingsRepository(this._client);

  final ApiClient _client;

  // ── About ─────────────────────────────────────────────────────────────────

  Future<AboutSettings> getAbout() async {
    final resp = await _client.get<Map<String, dynamic>>(
      '/api/admin/settings/about',
    );
    return AboutSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  Future<AboutSettings> updateAbout(Map<String, dynamic> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      '/api/admin/settings/about',
      data: data,
    );
    return AboutSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  // ── Contact ───────────────────────────────────────────────────────────────

  Future<ContactSettings> getContact() async {
    final resp = await _client.get<Map<String, dynamic>>(
      '/api/admin/settings/contact',
    );
    return ContactSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  Future<ContactSettings> updateContact(Map<String, dynamic> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      '/api/admin/settings/contact',
      data: data,
    );
    return ContactSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  // ── Theme ─────────────────────────────────────────────────────────────────

  Future<ThemeSettings> getTheme() async {
    final resp = await _client.get<Map<String, dynamic>>(
      '/api/admin/settings/theme',
    );
    return ThemeSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  Future<ThemeSettings> updateTheme(Map<String, dynamic> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      '/api/admin/settings/theme',
      data: data,
    );
    return ThemeSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  // ── Site ──────────────────────────────────────────────────────────────────

  Future<SiteSettings> getSite() async {
    final resp = await _client.get<Map<String, dynamic>>(
      '/api/admin/settings/site',
    );
    return SiteSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  Future<SiteSettings> updateSite(Map<String, dynamic> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      '/api/admin/settings/site',
      data: data,
    );
    return SiteSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  // ── Social Links ──────────────────────────────────────────────────────────

  Future<List<SocialLink>> getSocialLinks() async {
    final resp = await _client.get<Map<String, dynamic>>(
      '/api/admin/settings/social',
    );
    final list = resp['data'] as List<dynamic>;
    return list
        .map((e) => SocialLink.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<SocialLink> upsertSocialLink(Map<String, dynamic> data) async {
    final resp = await _client.post<Map<String, dynamic>>(
      '/api/admin/settings/social',
      data: data,
    );
    return SocialLink.fromJson(resp['data'] as Map<String, dynamic>);
  }
}
