//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'delete_release_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DeleteReleaseResponse {
  /// Returns a new [DeleteReleaseResponse] instance.
  DeleteReleaseResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is DeleteReleaseResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory DeleteReleaseResponse.fromJson(Map<String, dynamic> json) => _$DeleteReleaseResponseFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteReleaseResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

