//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'delete_contact_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DeleteContactResponse {
  /// Returns a new [DeleteContactResponse] instance.
  DeleteContactResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is DeleteContactResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory DeleteContactResponse.fromJson(Map<String, dynamic> json) => _$DeleteContactResponseFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteContactResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

