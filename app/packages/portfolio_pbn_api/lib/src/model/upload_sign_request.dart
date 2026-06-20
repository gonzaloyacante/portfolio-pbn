//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'upload_sign_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UploadSignRequest {
  /// Returns a new [UploadSignRequest] instance.
  UploadSignRequest({

     this.folder,
  });

  @JsonKey(
    
    name: r'folder',
    required: false,
    includeIfNull: false,
  )


  final String? folder;





    @override
    bool operator ==(Object other) => identical(this, other) || other is UploadSignRequest &&
      other.folder == folder;

    @override
    int get hashCode =>
        folder.hashCode;

  factory UploadSignRequest.fromJson(Map<String, dynamic> json) => _$UploadSignRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UploadSignRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

