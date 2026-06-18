//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'delete_social_link_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DeleteSocialLinkRequest {
  /// Returns a new [DeleteSocialLinkRequest] instance.
  DeleteSocialLinkRequest({

     this.id,

     this.platform,
  });

  @JsonKey(
    
    name: r'id',
    required: false,
    includeIfNull: false,
  )


  final String? id;



  @JsonKey(
    
    name: r'platform',
    required: false,
    includeIfNull: false,
  )


  final String? platform;





    @override
    bool operator ==(Object other) => identical(this, other) || other is DeleteSocialLinkRequest &&
      other.id == id &&
      other.platform == platform;

    @override
    int get hashCode =>
        id.hashCode +
        platform.hashCode;

  factory DeleteSocialLinkRequest.fromJson(Map<String, dynamic> json) => _$DeleteSocialLinkRequestFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteSocialLinkRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

