/// Excepciones tipadas para toda la capa de red.
/// NUNCA usar excepciones genéricas de Dart fuera de core/api.
library;

// ── Base ──────────────────────────────────────────────────────────────────────

sealed class AppException implements Exception {
  const AppException({required this.message});
  final String message;

  @override
  String toString() => '${runtimeType.toString()}: $message';
}

// ── Red ───────────────────────────────────────────────────────────────────────

/// Sin conexión a internet o error de red de bajo nivel.
final class NetworkException extends AppException {
  const NetworkException({super.message = 'Sin conexión a internet'});
}

/// Timeout al conectar o recibir respuesta.
final class TimeoutException extends AppException {
  const TimeoutException({super.message = 'La solicitud tardó demasiado'});
}

// ── HTTP ──────────────────────────────────────────────────────────────────────

/// Respuesta HTTP con error (4xx / 5xx).
final class HttpException extends AppException {
  const HttpException({
    required this.statusCode,
    super.message = 'Error HTTP',
    this.errors,
  });

  final int statusCode;
  final Map<String, dynamic>? errors;

  bool get isClientError => statusCode >= 400 && statusCode < 500;
  bool get isServerError => statusCode >= 500;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/// Credenciales inválidas o usuario no encontrado.
final class UnauthorizedException extends AppException {
  const UnauthorizedException({super.message = 'No autorizado'});
}

/// El access token expiró. El interceptor debe intentar renovarlo.
final class TokenExpiredException extends AppException {
  const TokenExpiredException({super.message = 'Sesión expirada'});
}

/// El refresh token fue revocado o expiró — debe volver al login.
final class SessionExpiredException extends AppException {
  const SessionExpiredException({
    super.message = 'La sesión ha caducado. Inicia sesión de nuevo.',
  });
}

/// El usuario no tiene permisos para esta operación.
final class ForbiddenException extends AppException {
  const ForbiddenException({super.message = 'Sin permisos'});
}

// ── Negocio ───────────────────────────────────────────────────────────────────

/// Recurso no encontrado (404).
final class NotFoundException extends AppException {
  const NotFoundException({super.message = 'Recurso no encontrado'});
}

/// Conflicto (409) — entidad duplicada o estado inválido.
final class ConflictException extends AppException {
  const ConflictException({super.message = 'Conflicto con el estado actual'});
}

/// Validación del servidor falló (422).
final class ValidationException extends AppException {
  const ValidationException({
    super.message = 'Datos inválidos',
    this.fieldErrors = const {},
  });

  final Map<String, String> fieldErrors;
}

/// Error de límite de velocidad (429).
final class RateLimitException extends AppException {
  const RateLimitException({
    super.message = 'Demasiadas solicitudes. Espera un momento.',
  });
}

// ── Servidor ──────────────────────────────────────────────────────────────────

/// Error interno del servidor (500).
final class ServerException extends AppException {
  const ServerException({super.message = 'Error interno del servidor'});
}

// ── Local ─────────────────────────────────────────────────────────────────────

/// Error al leer/escribir datos locales (BD, SecureStorage, prefs).
final class StorageException extends AppException {
  const StorageException({super.message = 'Error al acceder a datos locales'});
}

/// Error de parseo o deserialización.
final class ParseException extends AppException {
  const ParseException({super.message = 'Error al procesar la respuesta'});
}
