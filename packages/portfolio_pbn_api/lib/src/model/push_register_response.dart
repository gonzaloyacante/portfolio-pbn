//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'push_register_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PushRegisterResponse {
  /// Returns a new [PushRegisterResponse] instance.
  PushRegisterResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is PushRegisterResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory PushRegisterResponse.fromJson(Map<String, dynamic> json) => _$PushRegisterResponseFromJson(json);

  Map<String, dynamic> toJson() => _$PushRegisterResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

