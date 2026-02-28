import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../utils/app_logger.dart';

// ── Modelos ──────────────────────────────────────────────────────────────────

/// Configuraciones de servidor disponibles en modo debug.
enum ServerPreset {
  local(label: 'LOCAL', description: 'Servidor local de desarrollo', emoji: '💻'),
  staging(label: 'STAGING', description: 'dev.paolabolivar.es (develop)', emoji: '🧪'),
  production(label: 'PROD', description: 'paolabolivar.es (main)', emoji: '🚀'),
  custom(label: 'CUSTOM', description: 'URL personalizada', emoji: '✏️');

  const ServerPreset({required this.label, required this.description, required this.emoji});

  final String label;
  final String description;
  final String emoji;

  /// URL base para cada preset (Android emulator usa 10.0.2.2 para localhost).
  String resolveUrl({String? customUrl}) {
    switch (this) {
      case ServerPreset.local:
        // En emulador Android el localhost del host es 10.0.2.2.
        // En simulador iOS y dispositivo físico, se usa la URL del .env.
        return defaultTargetPlatform == TargetPlatform.android ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
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
    return ServerUrlState(preset: preset ?? this.preset, customUrl: customUrl ?? this.customUrl);
  }
}

// ── Notifier ──────────────────────────────────────────────────────────────────

const _kPresetKey = 'debug_server_preset';
const _kCustomUrlKey = 'debug_server_custom_url';

/// Notifier idiomático Riverpod 3.x.
/// Inicia con staging como estado por defecto y carga prefs en segundo plano.
class ServerUrlNotifier extends Notifier<ServerUrlState> {
  SharedPreferences? _prefs;

  @override
  ServerUrlState build() {
    _loadAsync();
    return const ServerUrlState(preset: ServerPreset.staging, customUrl: '');
  }

  Future<void> _loadAsync() async {
    try {
      _prefs = await SharedPreferences.getInstance();
      final presetName = _prefs!.getString(_kPresetKey);
      final customUrl = _prefs!.getString(_kCustomUrlKey) ?? '';
      final preset = ServerPreset.values.firstWhere((p) => p.name == presetName, orElse: () => ServerPreset.staging);
      AppLogger.debug('[ServerUrl] Cargado: preset=${preset.name}, url=${preset.resolveUrl(customUrl: customUrl)}');
      state = ServerUrlState(preset: preset, customUrl: customUrl);
    } catch (e) {
      AppLogger.warn('[ServerUrl] Error cargando prefs: $e');
    }
  }

  Future<void> setPreset(ServerPreset preset) async {
    state = state.copyWith(preset: preset);
    try {
      _prefs ??= await SharedPreferences.getInstance();
      await _prefs!.setString(_kPresetKey, preset.name);
    } catch (_) {}
    AppLogger.info('[ServerUrl] Cambiado a ${preset.label}: ${state.resolvedUrl}');
  }

  Future<void> setCustomUrl(String url) async {
    state = state.copyWith(preset: ServerPreset.custom, customUrl: url);
    try {
      _prefs ??= await SharedPreferences.getInstance();
      await _prefs!.setString(_kCustomUrlKey, url);
      await _prefs!.setString(_kPresetKey, ServerPreset.custom.name);
    } catch (_) {}
    AppLogger.info('[ServerUrl] Custom URL: $url');
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

/// URL activa según el preset seleccionado (solo en kDebugMode).
/// En release, siempre devuelve staging como no-op.
final serverUrlProvider = NotifierProvider<ServerUrlNotifier, ServerUrlState>(ServerUrlNotifier.new);
