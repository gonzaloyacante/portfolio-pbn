//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'delete_gallery_image_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DeleteGalleryImageRequest {
  /// Returns a new [DeleteGalleryImageRequest] instance.
  DeleteGalleryImageRequest({

    required  this.imageId,
  });

  @JsonKey(
    
    name: r'imageId',
    required: true,
    includeIfNull: false,
  )


  final String imageId;





    @override
    bool operator ==(Object other) => identical(this, other) || other is DeleteGalleryImageRequest &&
      other.imageId == imageId;

    @override
    int get hashCode =>
        imageId.hashCode;

  factory DeleteGalleryImageRequest.fromJson(Map<String, dynamic> json) => _$DeleteGalleryImageRequestFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteGalleryImageRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

