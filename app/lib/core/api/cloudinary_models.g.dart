// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cloudinary_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CloudinarySignResponse _$CloudinarySignResponseFromJson(
  Map<String, dynamic> json,
) => _CloudinarySignResponse(
  apiKey: json['apiKey'] as String,
  cloudName: json['cloudName'] as String,
  timestamp: (json['timestamp'] as num).toInt(),
  signature: json['signature'] as String,
  folder: json['folder'] as String,
);

Map<String, dynamic> _$CloudinarySignResponseToJson(
  _CloudinarySignResponse instance,
) => <String, dynamic>{
  'apiKey': instance.apiKey,
  'cloudName': instance.cloudName,
  'timestamp': instance.timestamp,
  'signature': instance.signature,
  'folder': instance.folder,
};

_CloudinaryUploadResponse _$CloudinaryUploadResponseFromJson(
  Map<String, dynamic> json,
) => _CloudinaryUploadResponse(
  secureUrl: json['secure_url'] as String,
  publicId: json['public_id'] as String,
  width: (json['width'] as num?)?.toInt(),
  height: (json['height'] as num?)?.toInt(),
);

Map<String, dynamic> _$CloudinaryUploadResponseToJson(
  _CloudinaryUploadResponse instance,
) => <String, dynamic>{
  'secure_url': instance.secureUrl,
  'public_id': instance.publicId,
  'width': instance.width,
  'height': instance.height,
};
