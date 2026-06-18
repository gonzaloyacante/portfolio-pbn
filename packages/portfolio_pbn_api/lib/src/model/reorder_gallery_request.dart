//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'reorder_gallery_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ReorderGalleryRequest {
  /// Returns a new [ReorderGalleryRequest] instance.
  ReorderGalleryRequest({

    required  this.orderedIds,
  });

  @JsonKey(
    
    name: r'orderedIds',
    required: true,
    includeIfNull: false,
  )


  final List<String> orderedIds;





    @override
    bool operator ==(Object other) => identical(this, other) || other is ReorderGalleryRequest &&
      other.orderedIds == orderedIds;

    @override
    int get hashCode =>
        orderedIds.hashCode;

  factory ReorderGalleryRequest.fromJson(Map<String, dynamic> json) => _$ReorderGalleryRequestFromJson(json);

  Map<String, dynamic> toJson() => _$ReorderGalleryRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

