//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'update_me_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateMeResponse {
  /// Returns a new [UpdateMeResponse] instance.
  UpdateMeResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is UpdateMeResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory UpdateMeResponse.fromJson(Map<String, dynamic> json) => _$UpdateMeResponseFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateMeResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

