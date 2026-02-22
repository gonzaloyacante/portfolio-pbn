import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../auth/token_storage.dart';
import '../config/env_config.dart';
import '../router/route_names.dart';
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

  // ── onError ────────────────────────────────────────────────────────────────

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final statusCode = err.response?.statusCode;
    final path = err.requestOptions.path;

    // Solo manejamos 401 en rutas NO-refresh.
    if (statusCode != 401 || _isRefreshEndpoint(path)) {
      return handler.next(err);
    }

    AppLogger.info('AuthInterceptor: 401 on $path → attempting token refresh');

    if (_isRefreshing) {
      // Encolar la petición mientras el refresh está en curso.
      final completer = _PendingRequest(err.requestOptions);
      _pendingQueue.add(completer);
      try {
        final response = await completer.future;
        return handler.resolve(response);
      } catch (e) {
        return handler.next(err);
      }
    }

    _isRefreshing = true;

    try {
      await _doRefresh();

      // Reintentar la petición original con el nuevo token.
      final response = await _retry(err.requestOptions);

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

      return handler.resolve(response);
    } on UnauthorizedException catch (_) {
      AppLogger.warn('AuthInterceptor: refresh failed → clearing session');
      await _clearSessionAndRedirect();
      _rejectPending(err);
      return handler.next(err);
    } catch (e) {
      AppLogger.error('AuthInterceptor: unexpected refresh error', e);
      _rejectPending(err);
      return handler.next(err);
    } finally {
      _isRefreshing = false;
    }
  }

  // ── Private Helpers ────────────────────────────────────────────────────────

  Future<void> _doRefresh() async {
    final storage = ref.read(tokenStorageProvider);
    final refreshToken = await storage.getRefreshToken();

    if (refreshToken == null) {
      throw const UnauthorizedException(message: 'No refresh token available');
    }

    final response = await _refreshDio.post<Map<String, dynamic>>(
      Endpoints.authRefresh,
      data: {'refreshToken': refreshToken},
    );

    final body = response.data;
    if (body == null) {
      throw const UnauthorizedException(message: 'Empty refresh response');
    }

    final newAccess = body['accessToken'] as String?;
    final newRefresh = body['refreshToken'] as String?;

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

    // Navegar al login desde fuera del árbol de widgets usando GoRouter.
    // Se usa el nombre de la ruta para no depender de context.
    AppLogger.info('AuthInterceptor: redirecting to ${RouteNames.login}');
    // La redirección real la maneja el guard del router al detectar
    // que ya no hay sesión activa. Forzamos un rebuild invalidando el auth.
    // (El authProvider escucha tokenStorage, así que se actualizará solo.)
  }

  void _rejectPending(DioException err) {
    for (final pending in _pendingQueue) {
      pending.completeError(err);
    }
    _pendingQueue.clear();
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
