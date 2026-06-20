// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'gallery_image.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GalleryImage _$GalleryImageFromJson(Map<String, dynamic> json) =>
    $checkedCreate('GalleryImage', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'id',
          'url',
          'publicId',
          'order',
          'categoryId',
          'width',
          'height',
          'isFeatured',
        ],
      );
      final val = GalleryImage(
        id: $checkedConvert('id', (v) => v as String),
        url: $checkedConvert('url', (v) => v as String),
        publicId: $checkedConvert('publicId', (v) => v as String?),
        order: $checkedConvert('order', (v) => v as num),
        categoryId: $checkedConvert('categoryId', (v) => v as String),
        width: $checkedConvert('width', (v) => v as num?),
        height: $checkedConvert('height', (v) => v as num?),
        isFeatured: $checkedConvert('isFeatured', (v) => v as bool),
      );
      return val;
    });

Map<String, dynamic> _$GalleryImageToJson(GalleryImage instance) =>
    <String, dynamic>{
      'id': instance.id,
      'url': instance.url,
      'publicId': instance.publicId,
      'order': instance.order,
      'categoryId': instance.categoryId,
      'width': instance.width,
      'height': instance.height,
      'isFeatured': instance.isFeatured,
    };
