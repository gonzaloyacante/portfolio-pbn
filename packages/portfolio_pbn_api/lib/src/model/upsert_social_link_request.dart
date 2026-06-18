//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'upsert_social_link_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpsertSocialLinkRequest {
  /// Returns a new [UpsertSocialLinkRequest] instance.
  UpsertSocialLinkRequest({

    required  this.platform,

    required  this.url,

     this.username,

     this.icon,

     this.isActive,

     this.sortOrder,
  });

  @JsonKey(
    
    name: r'platform',
    required: true,
    includeIfNull: false,
  )


  final String platform;



  @JsonKey(
    
    name: r'url',
    required: true,
    includeIfNull: false,
  )


  final String url;



  @JsonKey(
    
    name: r'username',
    required: false,
    includeIfNull: false,
  )


  final String? username;



  @JsonKey(
    
    name: r'icon',
    required: false,
    includeIfNull: false,
  )


  final String? icon;



  @JsonKey(
    
    name: r'isActive',
    required: false,
    includeIfNull: false,
  )


  final bool? isActive;



  @JsonKey(
    
    name: r'sortOrder',
    required: false,
    includeIfNull: false,
  )


  final int? sortOrder;





    @override
    bool operator ==(Object other) => identical(this, other) || other is UpsertSocialLinkRequest &&
      other.platform == platform &&
      other.url == url &&
      other.username == username &&
      other.icon == icon &&
      other.isActive == isActive &&
      other.sortOrder == sortOrder;

    @override
    int get hashCode =>
        platform.hashCode +
        url.hashCode +
        (username == null ? 0 : username.hashCode) +
        (icon == null ? 0 : icon.hashCode) +
        isActive.hashCode +
        sortOrder.hashCode;

  factory UpsertSocialLinkRequest.fromJson(Map<String, dynamic> json) => _$UpsertSocialLinkRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpsertSocialLinkRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

