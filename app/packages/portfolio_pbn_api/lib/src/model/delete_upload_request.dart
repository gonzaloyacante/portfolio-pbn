//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'delete_upload_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DeleteUploadRequest {
  /// Returns a new [DeleteUploadRequest] instance.
  DeleteUploadRequest({

    required  this.publicId,
  });

  @JsonKey(
    
    name: r'publicId',
    required: true,
    includeIfNull: false,
  )


  final String publicId;





    @override
    bool operator ==(Object other) => identical(this, other) || other is DeleteUploadRequest &&
      other.publicId == publicId;

    @override
    int get hashCode =>
        publicId.hashCode;

  factory DeleteUploadRequest.fromJson(Map<String, dynamic> json) => _$DeleteUploadRequestFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteUploadRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

