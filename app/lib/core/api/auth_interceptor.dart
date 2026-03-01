import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../auth/session_signal.dart';
import '../auth/token_storage.dart';
import '../config/env_config.dart';
import '../utils/app_logger.dart';
import 'api_exceptions.dart';
import 'endpoints.dart';

// ── AuthInterceptor ───────────────────────────────────────────────────────────

/// Interceptor de Dio que:
/// 1. Inyecta el Bearer token en cada petición.
/// 2. Detecta 401 → intenta refresh → reintenta la petición original.
/// 3. Si el refresh falla → limpia sesión y redirige al login.
///
/// IMPORTANTE: Usa un [Dio] separado sin interceptores para llamar a
/// /api/admin/auth/refresh, evitando el bucle infinito de 401.
class AuthInterceptor extends Interceptor {
  AuthInterceptor({required this.ref, required this.dio});

  final Ref ref;

  /// Instancia principal de Dio (con todos los interceptores).
  final Dio dio;

  /// Dio limpio solo para el refresh (sin AuthInterceptor → sin bucle).
  late final Dio _refreshDio = _buildRefreshDio();

  bool _isRefreshing = false;
  final List<_PendingRequest> _pendingQueue = [];

  // ── onRequest ──────────────────────────────────────────────────────────────

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Rutas públicas: no necesitan token.
    if (_isPublicEndpoint(options.path)) {
      return handler.next(options);
    }

    final storage = ref.read(tokenStorageProvider);
    final token = await storage.getAccessToken();

    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    return handler.next(options);
  }

  // ── onResponse ────────────────────────────────────────────────────────────
  //
  // IMPORTANTE: el ApiClient usa validateStatus que acepta todos los códigos
  // < 500, por lo que los 401 llegan aquí como "respuestas exitosas" de Dio.
  // Por eso manejamos el refresco en onResponse, no en onError.

  @override
  Future<void> onResponse(
    Response<dynamic> response,
    ResponseInterceptorHandler handler,
  ) async {
    final status = response.statusCode;
    final path = response.requestOptions.path;

    // Solo interceptamos 401 en rutas que no sean la de refresh.
    if (status != 401 || _isRefreshEndpoint(path)) {
      return handler.next(response);
    }

    AppLogger.info('AuthInterceptor: 401 on $path → attempting token refresh');

    if (_isRefreshing) {
      // Encolar la petición mientras el refresh está en curso.
      final completer = _PendingRequest(response.requestOptions);
      _pendingQueue.add(completer);
      try {
        final resolved = await completer.future;
        return handler.next(resolved);
      } catch (_) {
        return handler.reject(_make401Error(response));
      }
    }

    _isRefreshing = true;

    try {
      await _doRefresh();

      // Reintentar la petición original con el nuevo token.
      final retried = await _retry(response.requestOptions);

      // Resolver las peticiones encoladas.
      for (final pending in _pendingQueue) {
        try {
          final r = await _retry(pending.options);
          pending.complete(r);
        } catch (e) {
          pending.completeError(e);
        }
      }
      _pendingQueue.clear();

      return handler.next(retried);
    } on UnauthorizedException catch (_) {
      AppLogger.warn('AuthInterceptor: refresh failed → clearing session');
      await _clearSessionAndRedirect();
      final err = _make401Error(response);
      _rejectPendingWithError(err);
      return handler.reject(err);
    } catch (e) {
      AppLogger.error('AuthInterceptor: unexpected refresh error', e);
      final err = _make401Error(response);
      _rejectPendingWithError(err);
      return handler.reject(err);
    } finally {
      _isRefreshing = false;
    }
  }

  // ── onError ────────────────────────────────────────────────────────────────
  // Maneja errores de red, 500+, timeouts, etc.
  // Los 401 llegan por onResponse (ver arriba) gracias al validateStatus del cliente.

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    // Pasamos todos los errores sin modificar;
    // el refresco de sesión se gestiona en onResponse.
    return handler.next(err);
  }

  // ── Private Helpers ────────────────────────────────────────────────────────

  Future<void> _doRefresh() async {
    final storage = ref.read(tokenStorageProvider);
    final refreshToken = await storage.getRefreshToken();

    if (refreshToken == null) {
      throw const UnauthorizedException(message: 'No refresh token available');
    }

    late final Map<String, dynamic>? body;
    try {
      final response = await _refreshDio.post<Map<String, dynamic>>(
        Endpoints.authRefresh,
        data: {'refreshToken': refreshToken},
      );
      body = response.data;
    } on DioException catch (e) {
      // El endpoint de refresh devolvió 4xx/5xx o hubo un error de red.
      throw UnauthorizedException(
        message: 'Refresh failed: ${e.response?.statusCode ?? e.message}',
      );
    }
    if (body == null) {
      throw const UnauthorizedException(message: 'Empty refresh response');
    }

    // Backend devuelve { success, data: { accessToken, refreshToken } }
    final data = (body['data'] is Map<String, dynamic>)
        ? body['data'] as Map<String, dynamic>
        : body;

    final newAccess = data['accessToken'] as String?;
    final newRefresh = data['refreshToken'] as String?;

    if (newAccess == null || newRefresh == null) {
      throw const UnauthorizedException(
        message: 'Invalid refresh response tokens',
      );
    }

    await storage.saveAccessToken(newAccess);
    await storage.saveRefreshToken(newRefresh);

    AppLogger.info('AuthInterceptor: tokens refreshed successfully');
  }

  Future<Response<dynamic>> _retry(RequestOptions options) async {
    final storage = ref.read(tokenStorageProvider);
    final token = await storage.getAccessToken();

    final opts = Options(
      method: options.method,
      headers: {
        ...options.headers,
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );

    return dio.request<dynamic>(
      options.path,
      data: options.data,
      queryParameters: options.queryParameters,
      options: opts,
    );
  }

  Future<void> _clearSessionAndRedirect() async {
    final storage = ref.read(tokenStorageProvider);
    await storage.clearAll();

    AppLogger.info('AuthInterceptor: session cleared → signaling session expired');

    // No podemos importar authProvider directamente (dependencia circular):
    //   auth_interceptor → auth_provider → auth_repository → api_client → auth_interceptor
    // En su lugar, incrementamos sessionExpiredSignal, que AuthNotifier escucha
    // y convierte en AuthState.unauthenticated(), lo que hace que el router redirija al login.
    ref.read(sessionExpiredSignal.notifier).increment();
  }

  void _rejectPendingWithError(DioException err) {
    for (final pending in _pendingQueue) {
      pending.completeError(err);
    }
    _pendingQueue.clear();
  }

  DioException _make401Error(Response<dynamic> response) {
    return DioException(
      requestOptions: response.requestOptions,
      response: response,
      type: DioExceptionType.badResponse,
      error: const UnauthorizedException(message: 'Sesión expirada'),
    );
  }

  static bool _isPublicEndpoint(String path) {
    return path == Endpoints.authLogin;
  }

  static bool _isRefreshEndpoint(String path) {
    return path == Endpoints.authRefresh;
  }

  Dio _buildRefreshDio() {
    return Dio(
      BaseOptions(
        baseUrl: EnvConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        headers: {'Content-Type': 'application/json'},
      ),
    );
  }
}

// ── _PendingRequest ───────────────────────────────────────────────────────────

/// Petición encolada mientras el refresh está en curso.
class _PendingRequest {
  _PendingRequest(this.options);

  final RequestOptions options;
  final _completer = Completer<Response<dynamic>>();

  Future<Response<dynamic>> get future => _completer.future;

  void complete(Response<dynamic> response) => _completer.complete(response);

  void completeError(Object error) => _completer.completeError(error);
}
