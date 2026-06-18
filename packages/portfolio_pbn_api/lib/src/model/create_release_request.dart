//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'create_release_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CreateReleaseRequest {
  /// Returns a new [CreateReleaseRequest] instance.
  CreateReleaseRequest({

    required  this.version,

    required  this.versionCode,

    required  this.releaseNotes,

    required  this.downloadUrl,

     this.checksumSha256,

     this.mandatory,

     this.minVersion,

     this.fileSizeBytes,
  });

  @JsonKey(
    
    name: r'version',
    required: true,
    includeIfNull: false,
  )


  final String version;



  @JsonKey(
    
    name: r'versionCode',
    required: true,
    includeIfNull: false,
  )


  final int versionCode;



  @JsonKey(
    
    name: r'releaseNotes',
    required: true,
    includeIfNull: false,
  )


  final String releaseNotes;



  @JsonKey(
    
    name: r'downloadUrl',
    required: true,
    includeIfNull: false,
  )


  final String downloadUrl;



  @JsonKey(
    
    name: r'checksumSha256',
    required: false,
    includeIfNull: false,
  )


  final String? checksumSha256;



  @JsonKey(
    
    name: r'mandatory',
    required: false,
    includeIfNull: false,
  )


  final bool? mandatory;



  @JsonKey(
    
    name: r'minVersion',
    required: false,
    includeIfNull: false,
  )


  final String? minVersion;



  @JsonKey(
    
    name: r'fileSizeBytes',
    required: false,
    includeIfNull: false,
  )


  final int? fileSizeBytes;





    @override
    bool operator ==(Object other) => identical(this, other) || other is CreateReleaseRequest &&
      other.version == version &&
      other.versionCode == versionCode &&
      other.releaseNotes == releaseNotes &&
      other.downloadUrl == downloadUrl &&
      other.checksumSha256 == checksumSha256 &&
      other.mandatory == mandatory &&
      other.minVersion == minVersion &&
      other.fileSizeBytes == fileSizeBytes;

    @override
    int get hashCode =>
        version.hashCode +
        versionCode.hashCode +
        releaseNotes.hashCode +
        downloadUrl.hashCode +
        (checksumSha256 == null ? 0 : checksumSha256.hashCode) +
        mandatory.hashCode +
        (minVersion == null ? 0 : minVersion.hashCode) +
        (fileSizeBytes == null ? 0 : fileSizeBytes.hashCode);

  factory CreateReleaseRequest.fromJson(Map<String, dynamic> json) => _$CreateReleaseRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateReleaseRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

