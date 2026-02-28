import 'package:flutter/foundation.dart';
import 'package:logger/logger.dart';

// ── Modelo de entrada de log ──────────────────────────────────────────────────

enum LogLevel { debug, info, warn, error }

/// Entrada individual del log en memoria.
/// Acumulada en [AppLogger._recentLogs] para el in-app log viewer.
class LogEntry {
  const LogEntry({
    required this.level,
    required this.message,
    required this.timestamp,
    this.error,
    this.stackTrace,
  });

  final LogLevel level;
  final String message;
  final DateTime timestamp;
  final dynamic error;
  final StackTrace? stackTrace;

  String get levelLabel => switch (level) {
    LogLevel.debug => 'DEBUG',
    LogLevel.info => 'INFO',
    LogLevel.warn => 'WARN',
    LogLevel.error => 'ERROR',
  };

  String get emoji => switch (level) {
    LogLevel.debug => '🐛',
    LogLevel.info => '✅',
    LogLevel.warn => '⚠️',
    LogLevel.error => '❌',
  };
}

// ── AppLogger ─────────────────────────────────────────────────────────────────

/// Wrapper sobre el package `logger`.
/// PROHIBIDO usar [print] en cualquier parte de la app.
/// Usar siempre: AppLogger.debug / .info / .warn / .error
///
/// En modo debug, los logs también se almacenan en [recentLogs] para
/// ser visualizados en el in-app Debug Panel.
class AppLogger {
  AppLogger._();

  /// Máximo de entradas en el buffer en memoria.
  static const int _maxLogs = 500;

  static final List<LogEntry> _recentLogs = [];

  /// Stream de logs para listeners reactivos (el in-app viewer).
  static final List<VoidCallback> _listeners = [];

  static final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 2,
      errorMethodCount: 8,
      lineLength: 120,
      colors: true,
      printEmojis: true,
      dateTimeFormat: DateTimeFormat.onlyTimeAndSinceStart,
    ),
    // En release, desactivar la salida de consola para no exponer logs
    output: kReleaseMode ? null : ConsoleOutput(),
    level: kReleaseMode ? Level.warning : Level.trace,
  );

  // ── Acceso al buffer ────────────────────────────────────────────────────

  /// Copia inmutable de los logs recientes (más recientes al final).
  static List<LogEntry> get recentLogs => List.unmodifiable(_recentLogs);

  /// Registrar un listener para cambios en el buffer de logs.
  static void addListener(VoidCallback listener) {
    _listeners.add(listener);
  }

  /// Eliminar un listener.
  static void removeListener(VoidCallback listener) {
    _listeners.remove(listener);
  }

  /// Limpiar todos los logs del buffer en memoria.
  static void clearLogs() {
    _recentLogs.clear();
    _notifyListeners();
  }

  // ── Métodos de log ──────────────────────────────────────────────────────

  static void debug(dynamic message, [dynamic error, StackTrace? stackTrace]) {
    _logger.d(message, error: error, stackTrace: stackTrace);
    _store(LogLevel.debug, message, error, stackTrace);
  }

  static void info(dynamic message, [dynamic error, StackTrace? stackTrace]) {
    _logger.i(message, error: error, stackTrace: stackTrace);
    _store(LogLevel.info, message, error, stackTrace);
  }

  static void warn(dynamic message, [dynamic error, StackTrace? stackTrace]) {
    _logger.w(message, error: error, stackTrace: stackTrace);
    _store(LogLevel.warn, message, error, stackTrace);
  }

  static void error(dynamic message, [dynamic error, StackTrace? stackTrace]) {
    _logger.e(message, error: error, stackTrace: stackTrace);
    _store(LogLevel.error, message, error, stackTrace);
  }

  // ── Internos ────────────────────────────────────────────────────────────

  static void _store(
    LogLevel level,
    dynamic message,
    dynamic error,
    StackTrace? stackTrace,
  ) {
    // Solo almacenar en debug + profile (nunca en release por rendimiento)
    if (kReleaseMode) return;

    _recentLogs.add(
      LogEntry(
        level: level,
        message: message?.toString() ?? '',
        timestamp: DateTime.now(),
        error: error,
        stackTrace: stackTrace,
      ),
    );

    // Circuito: eliminar entradas antiguas si excede el máximo
    if (_recentLogs.length > _maxLogs) {
      _recentLogs.removeRange(0, _recentLogs.length - _maxLogs);
    }

    _notifyListeners();
  }

  static void _notifyListeners() {
    for (final cb in _listeners) {
      cb();
    }
  }
}
