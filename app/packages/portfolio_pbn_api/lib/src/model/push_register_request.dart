//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'push_register_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PushRegisterRequest {
  /// Returns a new [PushRegisterRequest] instance.
  PushRegisterRequest({

    required  this.token,

    required  this.platform,
  });

  @JsonKey(
    
    name: r'token',
    required: true,
    includeIfNull: false,
  )


  final String token;



  @JsonKey(
    
    name: r'platform',
    required: true,
    includeIfNull: false,
  )


  final PushRegisterRequestPlatformEnum platform;





    @override
    bool operator ==(Object other) => identical(this, other) || other is PushRegisterRequest &&
      other.token == token &&
      other.platform == platform;

    @override
    int get hashCode =>
        token.hashCode +
        platform.hashCode;

  factory PushRegisterRequest.fromJson(Map<String, dynamic> json) => _$PushRegisterRequestFromJson(json);

  Map<String, dynamic> toJson() => _$PushRegisterRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}


enum PushRegisterRequestPlatformEnum {
@JsonValue(r'android')
android(r'android'),
@JsonValue(r'ios')
ios(r'ios');

const PushRegisterRequestPlatformEnum(this.value);

final String value;

@override
String toString() => value;
}


