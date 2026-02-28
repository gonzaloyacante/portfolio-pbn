import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:portfolio_pbn/core/api/api_client.dart';

import '../data/settings_model.dart';
import '../data/settings_repository.dart';

part 'settings_provider.g.dart';

// ── Repositorio ───────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
SettingsRepository settingsRepository(Ref ref) {
  return SettingsRepository(ref.watch(apiClientProvider));
}

// ── About ─────────────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
Future<AboutSettings> aboutSettings(Ref ref) async {
  return ref.watch(settingsRepositoryProvider).getAbout();
}

// ── Contact ───────────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
Future<ContactSettings> contactSettings(Ref ref) async {
  return ref.watch(settingsRepositoryProvider).getContact();
}

// ── Theme ─────────────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
Future<ThemeSettings> themeSettings(Ref ref) async {
  return ref.watch(settingsRepositoryProvider).getTheme();
}

// ── Site ──────────────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
Future<SiteSettings> siteSettings(Ref ref) async {
  return ref.watch(settingsRepositoryProvider).getSite();
}

// ── Home ─────────────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
Future<HomeSettings> homeSettings(Ref ref) async {
  return ref.watch(settingsRepositoryProvider).getHome();
}

// ── Social Links ──────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
Future<List<SocialLink>> socialLinks(Ref ref) async {
  return ref.watch(settingsRepositoryProvider).getSocialLinks();
}
