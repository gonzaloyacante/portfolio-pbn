//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:portfolio_pbn_api/src/model/trash_list_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'trash_list.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TrashList {
  /// Returns a new [TrashList] instance.
  TrashList({

    required  this.data,

    required  this.total,
  });

  @JsonKey(
    
    name: r'data',
    required: true,
    includeIfNull: false,
  )


  final TrashListData data;



  @JsonKey(
    
    name: r'total',
    required: true,
    includeIfNull: false,
  )


  final num total;





    @override
    bool operator ==(Object other) => identical(this, other) || other is TrashList &&
      other.data == data &&
      other.total == total;

    @override
    int get hashCode =>
        data.hashCode +
        total.hashCode;

  factory TrashList.fromJson(Map<String, dynamic> json) => _$TrashListFromJson(json);

  Map<String, dynamic> toJson() => _$TrashListToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

