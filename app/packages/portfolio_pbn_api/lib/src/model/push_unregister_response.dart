//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'push_unregister_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PushUnregisterResponse {
  /// Returns a new [PushUnregisterResponse] instance.
  PushUnregisterResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is PushUnregisterResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory PushUnregisterResponse.fromJson(Map<String, dynamic> json) => _$PushUnregisterResponseFromJson(json);

  Map<String, dynamic> toJson() => _$PushUnregisterResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

