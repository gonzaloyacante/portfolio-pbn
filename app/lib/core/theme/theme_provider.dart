import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../config/app_constants.dart';
import 'app_theme.dart';

// ── Provider ──────────────────────────────────────────────────────────────────

/// Controla el [ThemeMode] de la app y lo persiste en SharedPreferences.
final themeModeProvider = NotifierProvider<ThemeModeNotifier, ThemeMode>(
  ThemeModeNotifier.new,
);

/// Provider que almacena el ThemeMode cargado síncronamente en bootstrap.
/// Evita el flash de tema incorrecto al arrancar la app.
final initialThemeModeProvider = Provider<ThemeMode>((_) => ThemeMode.system);

/// Pre-carga la preferencia de tema desde SharedPreferences.
/// Debe llamarse en bootstrap() ANTES de runApp().
Future<ThemeMode> preloadThemeMode() async {
  final prefs = await SharedPreferences.getInstance();
  final saved = prefs.getString(AppConstants.kThemeModeKey);
  if (saved == null) return ThemeMode.system;
  switch (saved) {
    case 'dark':
      return ThemeMode.dark;
    case 'light':
      return ThemeMode.light;
    default:
      return ThemeMode.system;
  }
}

// ── Notifier ──────────────────────────────────────────────────────────────────

class ThemeModeNotifier extends Notifier<ThemeMode> {
  @override
  ThemeMode build() {
    return ref.read(initialThemeModeProvider);
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    state = mode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConstants.kThemeModeKey, _toString(mode));
  }

  Future<void> toggle(BuildContext context) async {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    await setThemeMode(isDark ? ThemeMode.light : ThemeMode.dark);
  }

  static String _toString(ThemeMode mode) => switch (mode) {
    ThemeMode.light => 'light',
    ThemeMode.dark => 'dark',
    _ => 'system',
  };
}

// ── ThemeData helpers ─────────────────────────────────────────────────────────

/// Mapa modo → [ThemeData] ya construido.
final lightTheme = AppTheme.light;
final darkTheme = AppTheme.dark;
