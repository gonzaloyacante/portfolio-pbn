//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'delete_category_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DeleteCategoryResponse {
  /// Returns a new [DeleteCategoryResponse] instance.
  DeleteCategoryResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is DeleteCategoryResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory DeleteCategoryResponse.fromJson(Map<String, dynamic> json) => _$DeleteCategoryResponseFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteCategoryResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

