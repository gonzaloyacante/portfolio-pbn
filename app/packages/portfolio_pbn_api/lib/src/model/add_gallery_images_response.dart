//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:portfolio_pbn_api/src/model/gallery_image.dart';
import 'package:json_annotation/json_annotation.dart';

part 'add_gallery_images_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AddGalleryImagesResponse {
  /// Returns a new [AddGalleryImagesResponse] instance.
  AddGalleryImagesResponse({

    required  this.images,
  });

  @JsonKey(
    
    name: r'images',
    required: true,
    includeIfNull: false,
  )


  final List<GalleryImage> images;





    @override
    bool operator ==(Object other) => identical(this, other) || other is AddGalleryImagesResponse &&
      other.images == images;

    @override
    int get hashCode =>
        images.hashCode;

  factory AddGalleryImagesResponse.fromJson(Map<String, dynamic> json) => _$AddGalleryImagesResponseFromJson(json);

  Map<String, dynamic> toJson() => _$AddGalleryImagesResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

