//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'reorder_gallery_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ReorderGalleryResponse {
  /// Returns a new [ReorderGalleryResponse] instance.
  ReorderGalleryResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is ReorderGalleryResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory ReorderGalleryResponse.fromJson(Map<String, dynamic> json) => _$ReorderGalleryResponseFromJson(json);

  Map<String, dynamic> toJson() => _$ReorderGalleryResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

