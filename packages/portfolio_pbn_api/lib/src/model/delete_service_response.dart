//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'delete_service_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DeleteServiceResponse {
  /// Returns a new [DeleteServiceResponse] instance.
  DeleteServiceResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is DeleteServiceResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory DeleteServiceResponse.fromJson(Map<String, dynamic> json) => _$DeleteServiceResponseFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteServiceResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

