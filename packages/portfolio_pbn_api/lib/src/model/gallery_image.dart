//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'gallery_image.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class GalleryImage {
  /// Returns a new [GalleryImage] instance.
  GalleryImage({

    required  this.id,

    required  this.url,

    required  this.publicId,

    required  this.order,

    required  this.categoryId,

    required  this.width,

    required  this.height,

    required  this.isFeatured,
  });

  @JsonKey(
    
    name: r'id',
    required: true,
    includeIfNull: false,
  )


  final String id;



  @JsonKey(
    
    name: r'url',
    required: true,
    includeIfNull: false,
  )


  final String url;



  @JsonKey(
    
    name: r'publicId',
    required: true,
    includeIfNull: true,
  )


  final String? publicId;



  @JsonKey(
    
    name: r'order',
    required: true,
    includeIfNull: false,
  )


  final num order;



  @JsonKey(
    
    name: r'categoryId',
    required: true,
    includeIfNull: false,
  )


  final String categoryId;



  @JsonKey(
    
    name: r'width',
    required: true,
    includeIfNull: true,
  )


  final num? width;



  @JsonKey(
    
    name: r'height',
    required: true,
    includeIfNull: true,
  )


  final num? height;



  @JsonKey(
    
    name: r'isFeatured',
    required: true,
    includeIfNull: false,
  )


  final bool isFeatured;





    @override
    bool operator ==(Object other) => identical(this, other) || other is GalleryImage &&
      other.id == id &&
      other.url == url &&
      other.publicId == publicId &&
      other.order == order &&
      other.categoryId == categoryId &&
      other.width == width &&
      other.height == height &&
      other.isFeatured == isFeatured;

    @override
    int get hashCode =>
        id.hashCode +
        url.hashCode +
        (publicId == null ? 0 : publicId.hashCode) +
        order.hashCode +
        categoryId.hashCode +
        (width == null ? 0 : width.hashCode) +
        (height == null ? 0 : height.hashCode) +
        isFeatured.hashCode;

  factory GalleryImage.fromJson(Map<String, dynamic> json) => _$GalleryImageFromJson(json);

  Map<String, dynamic> toJson() => _$GalleryImageToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

