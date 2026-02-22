import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../config/app_constants.dart';
import '../config/env_config.dart';
import 'api_exceptions.dart';
import 'api_interceptors.dart';
import 'auth_interceptor.dart';

// ── Provider ──────────────────────────────────────────────────────────────────

/// Singleton global del cliente HTTP.
final apiClientProvider = Provider<ApiClient>((ref) => ApiClient(ref));

// ── ApiClient ─────────────────────────────────────────────────────────────────

/// Cliente HTTP centralizado basado en Dio.
/// NUNCA instanciar Dio directamente fuera de esta clase.
class ApiClient {
  ApiClient(this._ref) {
    _dio = _buildDio();
    _addInterceptors();
  }

  final Ref _ref;
  late final Dio _dio;

  Dio get dio => _dio;

  // ── Construcción ─────────────────────────────────────────────────────────

  Dio _buildDio() {
    return Dio(
      BaseOptions(
        baseUrl: EnvConfig.apiBaseUrl,
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
    final response = await _dio.get<dynamic>(
      path,
      queryParameters: queryParams,
      options: options,
    );
    return _handleResponse<T>(response);
  }

  Future<T> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParams,
    Options? options,
  }) async {
    final response = await _dio.post<dynamic>(
      path,
      data: data,
      queryParameters: queryParams,
      options: options,
    );
    return _handleResponse<T>(response);
  }

  Future<T> put<T>(
    String path, {
    dynamic data,
    Options? options,
  }) async {
    final response = await _dio.put<dynamic>(
      path,
      data: data,
      options: options,
    );
    return _handleResponse<T>(response);
  }

  Future<T> patch<T>(
    String path, {
    dynamic data,
    Options? options,
  }) async {
    final response = await _dio.patch<dynamic>(
      path,
      data: data,
      options: options,
    );
    return _handleResponse<T>(response);
  }

  Future<T> delete<T>(
    String path, {
    dynamic data,
    Options? options,
  }) async {
    final response = await _dio.delete<dynamic>(
      path,
      data: data,
      options: options,
    );
    return _handleResponse<T>(response);
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  Future<T> upload<T>(
    String path,
    FormData formData, {
    void Function(int, int)? onProgress,
  }) async {
    final response = await _dio.post<dynamic>(
      path,
      data: formData,
      onSendProgress: onProgress,
      options: Options(contentType: 'multipart/form-data'),
    );
    return _handleResponse<T>(response);
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
