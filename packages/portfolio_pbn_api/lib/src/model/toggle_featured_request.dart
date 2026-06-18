//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'toggle_featured_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ToggleFeaturedRequest {
  /// Returns a new [ToggleFeaturedRequest] instance.
  ToggleFeaturedRequest({

    required  this.imageId,

    required  this.isFeatured,
  });

  @JsonKey(
    
    name: r'imageId',
    required: true,
    includeIfNull: false,
  )


  final String imageId;



  @JsonKey(
    
    name: r'isFeatured',
    required: true,
    includeIfNull: false,
  )


  final bool isFeatured;





    @override
    bool operator ==(Object other) => identical(this, other) || other is ToggleFeaturedRequest &&
      other.imageId == imageId &&
      other.isFeatured == isFeatured;

    @override
    int get hashCode =>
        imageId.hashCode +
        isFeatured.hashCode;

  factory ToggleFeaturedRequest.fromJson(Map<String, dynamic> json) => _$ToggleFeaturedRequestFromJson(json);

  Map<String, dynamic> toJson() => _$ToggleFeaturedRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

