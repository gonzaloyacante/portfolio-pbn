//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'permanent_delete_trash_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PermanentDeleteTrashResponse {
  /// Returns a new [PermanentDeleteTrashResponse] instance.
  PermanentDeleteTrashResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is PermanentDeleteTrashResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory PermanentDeleteTrashResponse.fromJson(Map<String, dynamic> json) => _$PermanentDeleteTrashResponseFromJson(json);

  Map<String, dynamic> toJson() => _$PermanentDeleteTrashResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

