import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/api_client.dart';
import '../api/endpoints.dart';
import '../utils/app_logger.dart';

// ── UploadService ─────────────────────────────────────────────────────────────

/// Servicio para subir imágenes a Cloudinary via el backend.
///
/// Usa el endpoint autenticado `/api/admin/upload` con JWT Flutter.
/// La imagen se comprime a calidad 85% antes de ser enviada por el widget.
class UploadService {
  const UploadService(this._client);

  final ApiClient _client;

  // ── Upload ─────────────────────────────────────────────────────────────────

  /// Sube [file] a Cloudinary y devuelve la URL pública resultante.
  ///
  /// [folder] agrupa las imágenes en Cloudinary (por defecto: 'portfolio').
  Future<String> uploadImage(
    File file, {
    String folder = 'portfolio',
    void Function(int sent, int total)? onProgress,
  }) async {
    AppLogger.info('UploadService: uploading ${file.path}');

    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(
        file.path,
        filename: file.path.split('/').last,
      ),
      'folder': folder,
    });

    final response = await _client.upload<Map<String, dynamic>>(
      Endpoints.adminUpload,
      formData,
      onProgress: onProgress,
    );

    final url = response['url'] as String?;
    if (url == null || url.isEmpty) {
      throw Exception('El servidor no devolvió una URL de imagen');
    }

    AppLogger.info('UploadService: upload successful → $url');
    return url;
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  /// Elimina la imagen con [publicId] de Cloudinary.
  Future<void> deleteImage(String publicId) async {
    AppLogger.info('UploadService: deleting $publicId');
    await _client.delete<void>(
      Endpoints.adminUpload,
      data: {'publicId': publicId},
    );
    AppLogger.info('UploadService: delete successful');
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

/// Instancia singleton del servicio de subida de imágenes.
final uploadServiceProvider = Provider<UploadService>(
  (ref) => UploadService(ref.watch(apiClientProvider)),
);
