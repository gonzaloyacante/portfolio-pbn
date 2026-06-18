//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'social_link.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class SocialLink {
  /// Returns a new [SocialLink] instance.
  SocialLink({

    required  this.id,

    required  this.platform,

    required  this.url,

    required  this.username,

    required  this.icon,

    required  this.isActive,

    required  this.sortOrder,
  });

  @JsonKey(
    
    name: r'id',
    required: true,
    includeIfNull: false,
  )


  final String id;



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
    required: true,
    includeIfNull: true,
  )


  final String? username;



  @JsonKey(
    
    name: r'icon',
    required: true,
    includeIfNull: true,
  )


  final String? icon;



  @JsonKey(
    
    name: r'isActive',
    required: true,
    includeIfNull: false,
  )


  final bool isActive;



  @JsonKey(
    
    name: r'sortOrder',
    required: true,
    includeIfNull: false,
  )


  final num sortOrder;





    @override
    bool operator ==(Object other) => identical(this, other) || other is SocialLink &&
      other.id == id &&
      other.platform == platform &&
      other.url == url &&
      other.username == username &&
      other.icon == icon &&
      other.isActive == isActive &&
      other.sortOrder == sortOrder;

    @override
    int get hashCode =>
        id.hashCode +
        platform.hashCode +
        url.hashCode +
        (username == null ? 0 : username.hashCode) +
        (icon == null ? 0 : icon.hashCode) +
        isActive.hashCode +
        sortOrder.hashCode;

  factory SocialLink.fromJson(Map<String, dynamic> json) => _$SocialLinkFromJson(json);

  Map<String, dynamic> toJson() => _$SocialLinkToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

