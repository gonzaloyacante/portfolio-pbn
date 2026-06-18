//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'add_gallery_images_request_images_inner.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AddGalleryImagesRequestImagesInner {
  /// Returns a new [AddGalleryImagesRequestImagesInner] instance.
  AddGalleryImagesRequestImagesInner({

    required  this.url,

    required  this.publicId,

     this.width,

     this.height,
  });

  @JsonKey(
    
    name: r'url',
    required: true,
    includeIfNull: false,
  )


  final String url;



  @JsonKey(
    
    name: r'publicId',
    required: true,
    includeIfNull: false,
  )


  final String publicId;



  @JsonKey(
    
    name: r'width',
    required: false,
    includeIfNull: false,
  )


  final num? width;



  @JsonKey(
    
    name: r'height',
    required: false,
    includeIfNull: false,
  )


  final num? height;





    @override
    bool operator ==(Object other) => identical(this, other) || other is AddGalleryImagesRequestImagesInner &&
      other.url == url &&
      other.publicId == publicId &&
      other.width == width &&
      other.height == height;

    @override
    int get hashCode =>
        url.hashCode +
        publicId.hashCode +
        width.hashCode +
        height.hashCode;

  factory AddGalleryImagesRequestImagesInner.fromJson(Map<String, dynamic> json) => _$AddGalleryImagesRequestImagesInnerFromJson(json);

  Map<String, dynamic> toJson() => _$AddGalleryImagesRequestImagesInnerToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

