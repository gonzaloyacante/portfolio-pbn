//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'upload_sign_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UploadSignResponse {
  /// Returns a new [UploadSignResponse] instance.
  UploadSignResponse({

    required  this.apiKey,

    required  this.cloudName,

    required  this.timestamp,

    required  this.signature,

    required  this.folder,
  });

  @JsonKey(
    
    name: r'apiKey',
    required: true,
    includeIfNull: false,
  )


  final String apiKey;



  @JsonKey(
    
    name: r'cloudName',
    required: true,
    includeIfNull: false,
  )


  final String cloudName;



  @JsonKey(
    
    name: r'timestamp',
    required: true,
    includeIfNull: false,
  )


  final num timestamp;



  @JsonKey(
    
    name: r'signature',
    required: true,
    includeIfNull: false,
  )


  final String signature;



  @JsonKey(
    
    name: r'folder',
    required: true,
    includeIfNull: false,
  )


  final String folder;





    @override
    bool operator ==(Object other) => identical(this, other) || other is UploadSignResponse &&
      other.apiKey == apiKey &&
      other.cloudName == cloudName &&
      other.timestamp == timestamp &&
      other.signature == signature &&
      other.folder == folder;

    @override
    int get hashCode =>
        apiKey.hashCode +
        cloudName.hashCode +
        timestamp.hashCode +
        signature.hashCode +
        folder.hashCode;

  factory UploadSignResponse.fromJson(Map<String, dynamic> json) => _$UploadSignResponseFromJson(json);

  Map<String, dynamic> toJson() => _$UploadSignResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

