//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:portfolio_pbn_api/src/model/category_item.dart';
import 'package:portfolio_pbn_api/src/model/pagination.dart';
import 'package:json_annotation/json_annotation.dart';

part 'category_list.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CategoryList {
  /// Returns a new [CategoryList] instance.
  CategoryList({

    required  this.data,

    required  this.pagination,
  });

  @JsonKey(
    
    name: r'data',
    required: true,
    includeIfNull: false,
  )


  final List<CategoryItem> data;



  @JsonKey(
    
    name: r'pagination',
    required: true,
    includeIfNull: false,
  )


  final Pagination pagination;





    @override
    bool operator ==(Object other) => identical(this, other) || other is CategoryList &&
      other.data == data &&
      other.pagination == pagination;

    @override
    int get hashCode =>
        data.hashCode +
        pagination.hashCode;

  factory CategoryList.fromJson(Map<String, dynamic> json) => _$CategoryListFromJson(json);

  Map<String, dynamic> toJson() => _$CategoryListToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

