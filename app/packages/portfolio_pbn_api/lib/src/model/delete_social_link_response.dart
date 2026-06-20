//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'delete_social_link_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DeleteSocialLinkResponse {
  /// Returns a new [DeleteSocialLinkResponse] instance.
  DeleteSocialLinkResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is DeleteSocialLinkResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory DeleteSocialLinkResponse.fromJson(Map<String, dynamic> json) => _$DeleteSocialLinkResponseFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteSocialLinkResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

