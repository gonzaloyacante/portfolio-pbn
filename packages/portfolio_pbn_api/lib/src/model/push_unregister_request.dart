//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'push_unregister_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PushUnregisterRequest {
  /// Returns a new [PushUnregisterRequest] instance.
  PushUnregisterRequest({

    required  this.token,
  });

  @JsonKey(
    
    name: r'token',
    required: true,
    includeIfNull: false,
  )


  final String token;





    @override
    bool operator ==(Object other) => identical(this, other) || other is PushUnregisterRequest &&
      other.token == token;

    @override
    int get hashCode =>
        token.hashCode;

  factory PushUnregisterRequest.fromJson(Map<String, dynamic> json) => _$PushUnregisterRequestFromJson(json);

  Map<String, dynamic> toJson() => _$PushUnregisterRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

