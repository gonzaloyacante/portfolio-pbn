import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:portfolio_pbn/core/api/api_client.dart';

import '../data/settings_model.dart';
import '../data/settings_repository.dart';

part 'settings_provider.g.dart';

// ── Repositorio ───────────────────────────────────────────────────────────────

@riverpod
SettingsRepository settingsRepository(Ref ref) {
  return SettingsRepository(ref.watch(apiClientProvider));
}

// ── About ─────────────────────────────────────────────────────────────────────

@riverpod
Future<AboutSettings> aboutSettings(Ref ref) async {
  return ref.watch(settingsRepositoryProvider).getAbout();
}

// ── Contact ───────────────────────────────────────────────────────────────────

@riverpod
Future<ContactSettings> contactSettings(Ref ref) async {
  return ref.watch(settingsRepositoryProvider).getContact();
}

// ── Theme ─────────────────────────────────────────────────────────────────────

@riverpod
Future<ThemeSettings> themeSettings(Ref ref) async {
  return ref.watch(settingsRepositoryProvider).getTheme();
}

// ── Site ──────────────────────────────────────────────────────────────────────

@riverpod
Future<SiteSettings> siteSettings(Ref ref) async {
  return ref.watch(settingsRepositoryProvider).getSite();
}

// ── Social Links ──────────────────────────────────────────────────────────────

@riverpod
Future<List<SocialLink>> socialLinks(Ref ref) async {
  return ref.watch(settingsRepositoryProvider).getSocialLinks();
}
