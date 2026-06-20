//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'refresh_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class RefreshResponse {
  /// Returns a new [RefreshResponse] instance.
  RefreshResponse({

    required  this.accessToken,
  });

  @JsonKey(
    
    name: r'accessToken',
    required: true,
    includeIfNull: false,
  )


  final String accessToken;





    @override
    bool operator ==(Object other) => identical(this, other) || other is RefreshResponse &&
      other.accessToken == accessToken;

    @override
    int get hashCode =>
        accessToken.hashCode;

  factory RefreshResponse.fromJson(Map<String, dynamic> json) => _$RefreshResponseFromJson(json);

  Map<String, dynamic> toJson() => _$RefreshResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

