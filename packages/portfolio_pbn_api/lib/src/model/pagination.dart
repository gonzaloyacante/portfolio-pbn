//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'pagination.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class Pagination {
  /// Returns a new [Pagination] instance.
  Pagination({

    required  this.total,

    required  this.page,

    required  this.limit,

    required  this.totalPages,
  });

  @JsonKey(
    
    name: r'total',
    required: true,
    includeIfNull: false,
  )


  final num total;



  @JsonKey(
    
    name: r'page',
    required: true,
    includeIfNull: false,
  )


  final num page;



  @JsonKey(
    
    name: r'limit',
    required: true,
    includeIfNull: false,
  )


  final num limit;



  @JsonKey(
    
    name: r'totalPages',
    required: true,
    includeIfNull: false,
  )


  final num totalPages;





    @override
    bool operator ==(Object other) => identical(this, other) || other is Pagination &&
      other.total == total &&
      other.page == page &&
      other.limit == limit &&
      other.totalPages == totalPages;

    @override
    int get hashCode =>
        total.hashCode +
        page.hashCode +
        limit.hashCode +
        totalPages.hashCode;

  factory Pagination.fromJson(Map<String, dynamic> json) => _$PaginationFromJson(json);

  Map<String, dynamic> toJson() => _$PaginationToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

