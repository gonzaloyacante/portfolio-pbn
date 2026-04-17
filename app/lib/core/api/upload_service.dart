import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/api_client.dart';
import '../api/api_exceptions.dart';
import '../api/cloudinary_models.dart';
import '../api/endpoints.dart';
import '../utils/app_logger.dart';

// ── UploadService ─────────────────────────────────────────────────────────────

/// Servicio para subir imágenes directamente a Cloudinary usando firma del servidor.
///
/// Flujo:
///   1. POST /api/admin/upload/sign → recibe {apiKey, cloudName, timestamp, signature, folder}
///   2. POST https://api.cloudinary.com/v1_1/{cloud}/image/upload directamente
///      (sin pasar por Vercel → sin límite de 4.5 MB → imágenes de cualquier tamaño)
///   3. Computa thumbnailUrl y lqipUrl localmente con las mismas transformaciones del servidor
class UploadService {
  UploadService(this._client);

  final ApiClient _client;

  /// Dio sin interceptores ni base URL para llamar directo a Cloudinary.
  late final Dio _cloudinaryDio = Dio(
    BaseOptions(
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(minutes: 10),
      sendTimeout: const Duration(minutes: 15),
    ),
  );

  // ── Upload ─────────────────────────────────────────────────────────────────

  /// Sube [file] y devuelve solo la URL pública de Cloudinary.
  Future<String> uploadImage(
    File file, {
    String folder = 'portfolio',
    void Function(int sent, int total)? onProgress,
  }) async {
    final result = await uploadImageFull(
      file,
      folder: folder,
      onProgress: onProgress,
    );
    return result.url;
  }

  /// Sube [file] directo a Cloudinary y devuelve todos los metadatos.
  ///
  /// - [url]: URL original en calidad máxima (sin transformaciones).
  /// - [thumbnailUrl]: URL optimizada (800×600, c_fill, q_auto, f_auto).
  /// - [lqipUrl]: Placeholder borroso de 30px para carga progresiva.
  /// - [publicId]: ID de Cloudinary para eliminar o asociar al backend.
  /// - [width]/[height]: Dimensiones originales para masonry layout.
  Future<
    ({
      String url,
      String thumbnailUrl,
      String lqipUrl,
      String publicId,
      int? width,
      int? height,
    })
  >
  uploadImageFull(
    File file, {
    String folder = 'portfolio',
    void Function(int sent, int total)? onProgress,
  }) async {
    AppLogger.info('UploadService: signing upload for ${file.path}');

    // 1 — Obtener firma del servidor
    final signData = await _client.post<Map<String, dynamic>>(
      Endpoints.adminUploadSign,
      data: {'folder': folder},
    );
    final signRes = CloudinarySignResponse.fromJson(signData);

    final apiKey = signRes.apiKey;
    final cloudName = signRes.cloudName;
    final timestamp = signRes.timestamp;
    final signature = signRes.signature;
    final fullFolder = signRes.folder;

    if (apiKey.isEmpty || cloudName.isEmpty || signature.isEmpty) {
      throw const ParseException(message: 'Firma de Cloudinary inválida');
    }

    // 2 — Subir directamente a Cloudinary (sin pasar por Vercel)
    AppLogger.info(
      'UploadService: uploading directly to Cloudinary ($cloudName)',
    );

    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(
        file.path,
        filename: file.path.split('/').last,
      ),
      'api_key': apiKey,
      'timestamp': timestamp.toString(),
      'signature': signature,
      'folder': fullFolder,
    });

    final uploadUrl = 'https://api.cloudinary.com/v1_1/$cloudName/image/upload';

    late final CloudinaryUploadResponse clRes;
    try {
      final response = await _cloudinaryDio.post<Map<String, dynamic>>(
        uploadUrl,
        data: formData,
        onSendProgress: onProgress,
      );
      clRes = CloudinaryUploadResponse.fromJson(response.data ?? {});
    } on DioException catch (e) {
      String? errMsg;
      final data = e.response?.data;
      if (data is Map) {
        final error = data['error'];
        if (error is Map) errMsg = error['message']?.toString();
      }
      errMsg ??= e.message ?? 'Error desconocido';
      AppLogger.error('UploadService: Cloudinary error → $errMsg');
      throw ServerException(message: 'Error de Cloudinary: $errMsg');
    }

    // 3 — Parsear respuesta de Cloudinary
    final url = clRes.secureUrl;
    final publicId = clRes.publicId;
    final width = clRes.width;
    final height = clRes.height;

    if (url.isEmpty) {
      throw const ParseException(message: 'Cloudinary no devolvió una URL');
    }

    // 4 — Computar URLs de transformación (igual que cloudinary.ts en el servidor)
    final thumbnailUrl = _toThumbnailUrl(url);
    final lqipUrl = _toLqipUrl(url);

    AppLogger.info(
      'UploadService: upload successful → $url (${width}x$height)',
    );
    return (
      url: url,
      thumbnailUrl: thumbnailUrl,
      lqipUrl: lqipUrl,
      publicId: publicId,
      width: width,
      height: height,
    );
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  /// Elimina la imagen con [publicId] de Cloudinary vía el backend.
  Future<void> deleteImage(String publicId) async {
    AppLogger.info('UploadService: deleting $publicId');
    await _client.delete<void>(
      Endpoints.adminUpload,
      data: {'publicId': publicId},
    );
    AppLogger.info('UploadService: delete successful');
  }

  // ── URL Transforms ─────────────────────────────────────────────────────────

  /// Réplica de `generateThumbnailUrl` de cloudinary.ts:
  /// c_fill, g_auto, w_800, h_600, q_auto, f_auto
  String _toThumbnailUrl(String url) {
    if (!url.contains('res.cloudinary.com')) return url;
    return url.replaceFirst(
      '/image/upload/',
      '/image/upload/c_fill,g_auto,w_800,h_600,q_auto,f_auto/',
    );
  }

  /// Réplica de `generateLqipUrl` de cloudinary.ts:
  /// w_30, q_5, e_blur:800, f_jpg
  String _toLqipUrl(String url) {
    if (!url.contains('res.cloudinary.com')) return url;
    return url.replaceFirst(
      '/image/upload/',
      '/image/upload/w_30,q_5,e_blur:800,f_jpg/',
    );
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

/// Instancia singleton del servicio de subida de imágenes.
final uploadServiceProvider = Provider<UploadService>(
  (ref) => UploadService(ref.watch(apiClientProvider)),
);
