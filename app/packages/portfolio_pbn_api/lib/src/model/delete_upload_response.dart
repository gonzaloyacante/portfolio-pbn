//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'delete_upload_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DeleteUploadResponse {
  /// Returns a new [DeleteUploadResponse] instance.
  DeleteUploadResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is DeleteUploadResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory DeleteUploadResponse.fromJson(Map<String, dynamic> json) => _$DeleteUploadResponseFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteUploadResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

