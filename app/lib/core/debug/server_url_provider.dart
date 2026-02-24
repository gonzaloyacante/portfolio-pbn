import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../utils/app_logger.dart';

// ── Modelos ──────────────────────────────────────────────────────────────────

/// Configuraciones de servidor disponibles en modo debug.
enum ServerPreset {
  local(
    label: 'LOCAL',
    description: 'Servidor local de desarrollo',
    emoji: '💻',
  ),
  staging(
    label: 'STAGING',
    description: 'dev.paolabolivar.es (develop)',
    emoji: '🧪',
  ),
  production(label: 'PROD', description: 'paolabolivar.es (main)', emoji: '🚀'),
  custom(label: 'CUSTOM', description: 'URL personalizada', emoji: '✏️');

  const ServerPreset({
    required this.label,
    required this.description,
    required this.emoji,
  });

  final String label;
  final String description;
  final String emoji;

  /// URL base para cada preset (Android emulator usa 10.0.2.2 para localhost).
  String resolveUrl({String? customUrl}) {
    switch (this) {
      case ServerPreset.local:
        // En emulador Android el localhost del host es 10.0.2.2.
        // En simulador iOS y dispositivo físico, se usa la URL del .env.
        return defaultTargetPlatform == TargetPlatform.android
            ? 'http://10.0.2.2:3000'
            : 'http://localhost:3000';
      case ServerPreset.staging:
        return 'https://dev.paolabolivar.es';
      case ServerPreset.production:
        return 'https://paolabolivar.es';
      case ServerPreset.custom:
        return customUrl ?? 'http://localhost:3000';
    }
  }
}

// ── State ─────────────────────────────────────────────────────────────────────

class ServerUrlState {
  const ServerUrlState({required this.preset, required this.customUrl});

  final ServerPreset preset;
  final String customUrl;

  String get resolvedUrl => preset.resolveUrl(customUrl: customUrl);

  ServerUrlState copyWith({ServerPreset? preset, String? customUrl}) {
    return ServerUrlState(
      preset: preset ?? this.preset,
      customUrl: customUrl ?? this.customUrl,
    );
  }
}

// ── Notifier ──────────────────────────────────────────────────────────────────

const _kPresetKey = 'debug_server_preset';
const _kCustomUrlKey = 'debug_server_custom_url';

class ServerUrlNotifier extends StateNotifier<ServerUrlState> {
  ServerUrlNotifier(this._prefs) : super(_loadInitial(_prefs));

  final SharedPreferences _prefs;

  static ServerUrlState _loadInitial(SharedPreferences prefs) {
    final presetName = prefs.getString(_kPresetKey);
    final customUrl = prefs.getString(_kCustomUrlKey) ?? '';
    final preset = ServerPreset.values.firstWhere(
      (p) => p.name == presetName,
      orElse: () => ServerPreset.staging, // default: staging
    );
    AppLogger.debug(
      '[ServerUrl] Cargado: preset=${preset.name}, url=${preset.resolveUrl(customUrl: customUrl)}',
    );
    return ServerUrlState(preset: preset, customUrl: customUrl);
  }

  Future<void> setPreset(ServerPreset preset) async {
    await _prefs.setString(_kPresetKey, preset.name);
    state = state.copyWith(preset: preset);
    AppLogger.info(
      '[ServerUrl] Cambiado a ${preset.label}: ${state.resolvedUrl}',
    );
  }

  Future<void> setCustomUrl(String url) async {
    await _prefs.setString(_kCustomUrlKey, url);
    state = state.copyWith(preset: ServerPreset.custom, customUrl: url);
    await _prefs.setString(_kPresetKey, ServerPreset.custom.name);
    AppLogger.info('[ServerUrl] Custom URL: $url');
  }
}

// ── Providers ─────────────────────────────────────────────────────────────────

/// Provider que lee SharedPreferences de manera asíncrona.
final sharedPreferencesProvider = FutureProvider<SharedPreferences>((ref) {
  return SharedPreferences.getInstance();
});

/// URL activa según el preset seleccionado (solo en kDebugMode).
/// En release, siempre devuelve staging como no-op.
final serverUrlProvider =
    StateNotifierProvider<ServerUrlNotifier, ServerUrlState>((ref) {
      final prefsAsync = ref.watch(sharedPreferencesProvider);
      return prefsAsync.maybeWhen(
        data: (prefs) => ServerUrlNotifier(prefs),
        orElse: () => ServerUrlNotifier(_FakePrefs()),
      );
    });

/// SharedPreferences in-memory (fallback mientras el real carga).
class _FakePrefs implements SharedPreferences {
  final Map<String, Object> _data = {};

  @override
  String? getString(String key) => _data[key] as String?;

  @override
  Future<bool> setString(String key, String value) async {
    _data[key] = value;
    return true;
  }

  // Los demás métodos son no-ops necesarios para implementar la interfaz.
  @override
  dynamic noSuchMethod(Invocation i) => null;
}
