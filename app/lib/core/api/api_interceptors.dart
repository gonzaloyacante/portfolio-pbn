import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:dio/dio.dart';

import '../config/app_constants.dart';
import '../utils/app_logger.dart';
import 'api_exceptions.dart';

// ── LoggingInterceptor ────────────────────────────────────────────────────────

/// Registra cada request/response/error en [AppLogger].
/// En producción registra solo errores para no exponer datos sensibles.
class LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    AppLogger.debug('[HTTP] → ${options.method} ${options.uri}');
    return handler.next(options);
  }

  @override
  void onResponse(
    Response<dynamic> response,
    ResponseInterceptorHandler handler,
  ) {
    AppLogger.debug(
      '[HTTP] ← ${response.statusCode} ${response.requestOptions.uri}',
    );
    return handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    AppLogger.error(
      '[HTTP] ✗ ${err.response?.statusCode ?? "no-response"} '
      '${err.requestOptions.uri}: ${err.message}',
      err,
    );
    return handler.next(err);
  }
}

// ── ConnectivityInterceptor ───────────────────────────────────────────────────

/// Rechaza la petición con [NetworkException] si no hay conectividad.
/// Evita esperar el timeout de Dio cuando sabemos que no hay red.
class ConnectivityInterceptor extends Interceptor {
  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final results = await Connectivity().checkConnectivity();
    final isOffline = results.every((r) => r == ConnectivityResult.none);

    if (isOffline) {
      AppLogger.warn('[HTTP] Request blocked: no network connectivity');
      return handler.reject(
        DioException(
          requestOptions: options,
          type: DioExceptionType.connectionError,
          error: const NetworkException(message: 'No hay conexión a internet'),
        ),
      );
    }

    return handler.next(options);
  }
}

// ── RetryInterceptor ──────────────────────────────────────────────────────────

/// Reintenta peticiones fallidas en caso de error de red o 503.
/// Usa backoff exponencial: 1s, 2s, 4s (máximo [AppConstants.maxRetries]).
class RetryInterceptor extends Interceptor {
  RetryInterceptor({required this.dio});

  final Dio dio;

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final options = err.requestOptions;
    final attempt = (options.extra['retryAttempt'] as int?) ?? 0;

    final shouldRetry = _shouldRetry(err) && attempt < AppConstants.maxRetries;

    if (!shouldRetry) {
      return handler.next(err);
    }

    final delay = Duration(seconds: 1 << attempt); // 1s, 2s, 4s
    AppLogger.info(
      '[Retry] Attempt ${attempt + 1}/${AppConstants.maxRetries} '
      'for ${options.uri} in ${delay.inSeconds}s',
    );

    await Future<void>.delayed(delay);

    options.extra['retryAttempt'] = attempt + 1;

    try {
      final response = await dio.fetch<dynamic>(options);
      return handler.resolve(response);
    } on DioException catch (e) {
      return handler.next(e);
    }
  }

  static bool _shouldRetry(DioException err) {
    if (err.error is NetworkException) return true;
    final status = err.response?.statusCode;
    return status == 503 || status == 502 || status == 504;
  }
}
