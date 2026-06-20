//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'delete_gallery_image_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DeleteGalleryImageResponse {
  /// Returns a new [DeleteGalleryImageResponse] instance.
  DeleteGalleryImageResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is DeleteGalleryImageResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory DeleteGalleryImageResponse.fromJson(Map<String, dynamic> json) => _$DeleteGalleryImageResponseFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteGalleryImageResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

