// ignore_for_file: use_null_aware_elements

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints.dart';

import 'settings_model.dart';

class SettingsRepository {
  SettingsRepository(this._client);

  final ApiClient _client;

  // ── About ─────────────────────────────────────────────────────────────────

  Future<AboutSettings> getAbout() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.settingsSection('about'),
    );
    return AboutSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  Future<AboutSettings> updateAbout(Map<String, dynamic> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.settingsSection('about'),
      data: data,
    );
    return AboutSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  // ── Contact ───────────────────────────────────────────────────────────────

  Future<ContactSettings> getContact() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.settingsSection('contact'),
    );
    return ContactSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  Future<ContactSettings> updateContact(Map<String, dynamic> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.settingsSection('contact'),
      data: data,
    );
    return ContactSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  // ── Theme ─────────────────────────────────────────────────────────────────

  Future<ThemeSettings> getTheme() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.settingsSection('theme'),
    );
    return ThemeSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  Future<ThemeSettings> updateTheme(Map<String, dynamic> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.settingsSection('theme'),
      data: data,
    );
    return ThemeSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  // ── Site ──────────────────────────────────────────────────────────────────

  Future<SiteSettings> getSite() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.settingsSection('site'),
    );
    return SiteSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  Future<SiteSettings> updateSite(Map<String, dynamic> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.settingsSection('site'),
      data: data,
    );
    return SiteSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  // ── Home ──────────────────────────────────────────────────────────────────

  Future<HomeSettings> getHome() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.settingsSection('home'),
    );
    return HomeSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  Future<HomeSettings> updateHome(Map<String, dynamic> data) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.settingsSection('home'),
      data: data,
    );
    return HomeSettings.fromJson(resp['data'] as Map<String, dynamic>);
  }

  // ── Social Links ──────────────────────────────────────────────────────────

  Future<List<SocialLink>> getSocialLinks() async {
    final resp = await _client.get<Map<String, dynamic>>(Endpoints.socialLinks);
    final list = resp['data'] as List<dynamic>;
    return list
        .map((e) => SocialLink.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<SocialLink> upsertSocialLink(Map<String, dynamic> data) async {
    final resp = await _client.post<Map<String, dynamic>>(
      Endpoints.socialLinks,
      data: data,
    );
    return SocialLink.fromJson(resp['data'] as Map<String, dynamic>);
  }
}
