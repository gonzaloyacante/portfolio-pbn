//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:portfolio_pbn_api/src/model/gallery_image.dart';
import 'package:json_annotation/json_annotation.dart';

part 'category_gallery_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CategoryGalleryResponse {
  /// Returns a new [CategoryGalleryResponse] instance.
  CategoryGalleryResponse({

    required  this.images,
  });

  @JsonKey(
    
    name: r'images',
    required: true,
    includeIfNull: false,
  )


  final List<GalleryImage> images;





    @override
    bool operator ==(Object other) => identical(this, other) || other is CategoryGalleryResponse &&
      other.images == images;

    @override
    int get hashCode =>
        images.hashCode;

  factory CategoryGalleryResponse.fromJson(Map<String, dynamic> json) => _$CategoryGalleryResponseFromJson(json);

  Map<String, dynamic> toJson() => _$CategoryGalleryResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

