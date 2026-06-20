//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'app_release.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AppRelease {
  /// Returns a new [AppRelease] instance.
  AppRelease({

    required  this.id,

    required  this.version,

    required  this.versionCode,

    required  this.releaseNotes,

    required  this.downloadUrl,

    required  this.checksumSha256,

    required  this.mandatory,

    required  this.minVersion,

    required  this.fileSizeBytes,

    required  this.publishedAt,
  });

  @JsonKey(
    
    name: r'id',
    required: true,
    includeIfNull: false,
  )


  final String id;



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


  final num versionCode;



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
    required: true,
    includeIfNull: true,
  )


  final String? checksumSha256;



  @JsonKey(
    
    name: r'mandatory',
    required: true,
    includeIfNull: false,
  )


  final bool mandatory;



  @JsonKey(
    
    name: r'minVersion',
    required: true,
    includeIfNull: true,
  )


  final String? minVersion;



  @JsonKey(
    
    name: r'fileSizeBytes',
    required: true,
    includeIfNull: true,
  )


  final num? fileSizeBytes;



  @JsonKey(
    
    name: r'publishedAt',
    required: true,
    includeIfNull: false,
  )


  final String publishedAt;





    @override
    bool operator ==(Object other) => identical(this, other) || other is AppRelease &&
      other.id == id &&
      other.version == version &&
      other.versionCode == versionCode &&
      other.releaseNotes == releaseNotes &&
      other.downloadUrl == downloadUrl &&
      other.checksumSha256 == checksumSha256 &&
      other.mandatory == mandatory &&
      other.minVersion == minVersion &&
      other.fileSizeBytes == fileSizeBytes &&
      other.publishedAt == publishedAt;

    @override
    int get hashCode =>
        id.hashCode +
        version.hashCode +
        versionCode.hashCode +
        releaseNotes.hashCode +
        downloadUrl.hashCode +
        (checksumSha256 == null ? 0 : checksumSha256.hashCode) +
        mandatory.hashCode +
        (minVersion == null ? 0 : minVersion.hashCode) +
        (fileSizeBytes == null ? 0 : fileSizeBytes.hashCode) +
        publishedAt.hashCode;

  factory AppRelease.fromJson(Map<String, dynamic> json) => _$AppReleaseFromJson(json);

  Map<String, dynamic> toJson() => _$AppReleaseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

