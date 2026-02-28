import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../config/app_constants.dart';
import '../config/env_config.dart';
import '../debug/server_url_provider.dart';
import 'api_exceptions.dart';
import 'api_interceptors.dart';
import 'auth_interceptor.dart';

// ── Provider ──────────────────────────────────────────────────────────────────

/// Singleton global del cliente HTTP.
/// En modo debug, reconstruye el cliente cuando cambia [serverUrlProvider].
/// En release, siempre usa [EnvConfig.apiBaseUrl].
final apiClientProvider = Provider<ApiClient>((ref) {
  final baseUrl = kDebugMode
      ? ref.watch<ServerUrlState>(serverUrlProvider).resolvedUrl
      : EnvConfig.apiBaseUrl;
  return ApiClient(ref, baseUrl: baseUrl);
});

// ── ApiClient ─────────────────────────────────────────────────────────────────

/// Cliente HTTP centralizado basado en Dio.
/// NUNCA instanciar Dio directamente fuera de esta clase.
class ApiClient {
  ApiClient(this._ref, {String? baseUrl})
    : _baseUrl = baseUrl ?? EnvConfig.apiBaseUrl {
    _dio = _buildDio();
    _addInterceptors();
  }

  final Ref _ref;
  final String _baseUrl;
  late final Dio _dio;

  Dio get dio => _dio;
  String get baseUrl => _baseUrl;

  // ── Construcción ─────────────────────────────────────────────────────────

  Dio _buildDio() {
    return Dio(
      BaseOptions(
        baseUrl: _baseUrl,
        connectTimeout: AppConstants.connectTimeout,
        receiveTimeout: AppConstants.receiveTimeout,
        sendTimeout: AppConstants.connectTimeout,
        contentType: 'application/json',
        responseType: ResponseType.json,
        validateStatus: (status) => status != null && status < 500,
      ),
    );
  }

  void _addInterceptors() {
    _dio.interceptors.addAll([
      ConnectivityInterceptor(),
      LoggingInterceptor(),
      AuthInterceptor(ref: _ref, dio: _dio),
      RetryInterceptor(dio: _dio),
    ]);
  }

  // ── HTTP Methods ──────────────────────────────────────────────────────────

  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParams,
    Options? options,
  }) async {
    try {
      final response = await _dio.get<dynamic>(
        path,
        queryParameters: queryParams,
        options: options,
      );
      return _handleResponse<T>(response);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<T> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParams,
    Options? options,
  }) async {
    try {
      final response = await _dio.post<dynamic>(
        path,
        data: data,
        queryParameters: queryParams,
        options: options,
      );
      return _handleResponse<T>(response);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<T> put<T>(String path, {dynamic data, Options? options}) async {
    try {
      final response = await _dio.put<dynamic>(
        path,
        data: data,
        options: options,
      );
      return _handleResponse<T>(response);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<T> patch<T>(String path, {dynamic data, Options? options}) async {
    try {
      final response = await _dio.patch<dynamic>(
        path,
        data: data,
        options: options,
      );
      return _handleResponse<T>(response);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<T> delete<T>(String path, {dynamic data, Options? options}) async {
    try {
      final response = await _dio.delete<dynamic>(
        path,
        data: data,
        options: options,
      );
      return _handleResponse<T>(response);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  Future<T> upload<T>(
    String path,
    FormData formData, {
    void Function(int, int)? onProgress,
  }) async {
    try {
      final response = await _dio.post<dynamic>(
        path,
        data: formData,
        onSendProgress: onProgress,
        options: Options(contentType: 'multipart/form-data'),
      );
      return _handleResponse<T>(response);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  // ── DioException → Domain Exception ──────────────────────────────────────

  /// Convierte un [DioException] (generado por handler.reject en los interceptores)
  /// en la excepción de dominio correspondiente.
  Exception _handleDioError(DioException e) {
    // Si el interceptor ya envolvió una excepción de dominio, la re-lanzamos.
    if (e.error is Exception) return e.error as Exception;

    // Si hay respuesta, convertimos por código de estado.
    final status = e.response?.statusCode;
    if (status != null) {
      final msg = _extractError(e.response?.data);
      return switch (status) {
        400 => ValidationException(message: msg),
        401 => UnauthorizedException(message: msg),
        403 => ForbiddenException(message: msg),
        404 => NotFoundException(message: msg),
        409 => ConflictException(message: msg),
        429 => RateLimitException(message: msg),
        _ => HttpException(statusCode: status, message: msg),
      };
    }

    // Error de red / sin respuesta.
    return NetworkException(message: e.message ?? 'Error de red');
  }

  // ── Response Handler ──────────────────────────────────────────────────────

  T _handleResponse<T>(Response<dynamic> response) {
    if (response.statusCode == null) {
      throw const NetworkException();
    }

    final status = response.statusCode!;
    final body = response.data;

    if (status >= 200 && status < 300) {
      return body as T;
    }

    // Extraer mensaje de error del body si viene en formato { success, error }
    final errorMessage = _extractError(body);

    return switch (status) {
      400 => throw ValidationException(message: errorMessage),
      401 => throw UnauthorizedException(message: errorMessage),
      403 => throw ForbiddenException(message: errorMessage),
      404 => throw NotFoundException(message: errorMessage),
      409 => throw ConflictException(message: errorMessage),
      429 => throw RateLimitException(message: errorMessage),
      _ => throw HttpException(statusCode: status, message: errorMessage),
    };
  }

  String _extractError(dynamic body) {
    if (body is Map<String, dynamic>) {
      return (body['error'] as String?) ??
          (body['message'] as String?) ??
          'Error inesperado';
    }
    return 'Error inesperado';
  }
}
