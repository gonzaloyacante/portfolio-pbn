//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:portfolio_pbn_api/src/model/add_gallery_images_request_images_inner.dart';
import 'package:json_annotation/json_annotation.dart';

part 'add_gallery_images_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AddGalleryImagesRequest {
  /// Returns a new [AddGalleryImagesRequest] instance.
  AddGalleryImagesRequest({

    required  this.images,
  });

  @JsonKey(
    
    name: r'images',
    required: true,
    includeIfNull: false,
  )


  final List<AddGalleryImagesRequestImagesInner> images;





    @override
    bool operator ==(Object other) => identical(this, other) || other is AddGalleryImagesRequest &&
      other.images == images;

    @override
    int get hashCode =>
        images.hashCode;

  factory AddGalleryImagesRequest.fromJson(Map<String, dynamic> json) => _$AddGalleryImagesRequestFromJson(json);

  Map<String, dynamic> toJson() => _$AddGalleryImagesRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

