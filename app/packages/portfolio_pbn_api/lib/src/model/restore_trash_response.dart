//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'restore_trash_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class RestoreTrashResponse {
  /// Returns a new [RestoreTrashResponse] instance.
  RestoreTrashResponse({

    required  this.ok,

    required  this.id,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;



  @JsonKey(
    
    name: r'id',
    required: true,
    includeIfNull: false,
  )


  final String id;





    @override
    bool operator ==(Object other) => identical(this, other) || other is RestoreTrashResponse &&
      other.ok == ok &&
      other.id == id;

    @override
    int get hashCode =>
        ok.hashCode +
        id.hashCode;

  factory RestoreTrashResponse.fromJson(Map<String, dynamic> json) => _$RestoreTrashResponseFromJson(json);

  Map<String, dynamic> toJson() => _$RestoreTrashResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

