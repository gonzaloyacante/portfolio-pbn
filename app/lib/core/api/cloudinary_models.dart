import 'package:freezed_annotation/freezed_annotation.dart';

part 'cloudinary_models.freezed.dart';
part 'cloudinary_models.g.dart';

// ── CloudinarySignResponse ────────────────────────────────────────────────────

/// Respuesta del endpoint `/api/admin/upload/sign` del backend.
/// Contiene los datos de firma necesarios para subir directamente a Cloudinary.
@freezed
abstract class CloudinarySignResponse with _$CloudinarySignResponse {
  const factory CloudinarySignResponse({
    required String apiKey,
    required String cloudName,
    required int timestamp,
    required String signature,
    required String folder,
  }) = _CloudinarySignResponse;

  factory CloudinarySignResponse.fromJson(Map<String, dynamic> json) =>
      _$CloudinarySignResponseFromJson(json);
}

// ── CloudinaryUploadResponse ─────────────────────────────────────────────────

/// Respuesta directa de la API de Cloudinary tras un upload exitoso.
/// Solo se mapean los campos necesarios para la app.
@freezed
abstract class CloudinaryUploadResponse with _$CloudinaryUploadResponse {
  const factory CloudinaryUploadResponse({
    @JsonKey(name: 'secure_url') required String secureUrl,
    @JsonKey(name: 'public_id') required String publicId,
    int? width,
    int? height,
  }) = _CloudinaryUploadResponse;

  factory CloudinaryUploadResponse.fromJson(Map<String, dynamic> json) =>
      _$CloudinaryUploadResponseFromJson(json);
}
