//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:portfolio_pbn_api/src/model/service_item.dart';
import 'package:portfolio_pbn_api/src/model/pagination.dart';
import 'package:json_annotation/json_annotation.dart';

part 'service_list.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ServiceList {
  /// Returns a new [ServiceList] instance.
  ServiceList({

    required  this.data,

    required  this.pagination,
  });

  @JsonKey(
    
    name: r'data',
    required: true,
    includeIfNull: false,
  )


  final List<ServiceItem> data;



  @JsonKey(
    
    name: r'pagination',
    required: true,
    includeIfNull: false,
  )


  final Pagination pagination;





    @override
    bool operator ==(Object other) => identical(this, other) || other is ServiceList &&
      other.data == data &&
      other.pagination == pagination;

    @override
    int get hashCode =>
        data.hashCode +
        pagination.hashCode;

  factory ServiceList.fromJson(Map<String, dynamic> json) => _$ServiceListFromJson(json);

  Map<String, dynamic> toJson() => _$ServiceListToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

