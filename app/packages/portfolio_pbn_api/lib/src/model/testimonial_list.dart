//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:portfolio_pbn_api/src/model/pagination.dart';
import 'package:portfolio_pbn_api/src/model/testimonial_item.dart';
import 'package:json_annotation/json_annotation.dart';

part 'testimonial_list.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TestimonialList {
  /// Returns a new [TestimonialList] instance.
  TestimonialList({

    required  this.data,

    required  this.pagination,
  });

  @JsonKey(
    
    name: r'data',
    required: true,
    includeIfNull: false,
  )


  final List<TestimonialItem> data;



  @JsonKey(
    
    name: r'pagination',
    required: true,
    includeIfNull: false,
  )


  final Pagination pagination;





    @override
    bool operator ==(Object other) => identical(this, other) || other is TestimonialList &&
      other.data == data &&
      other.pagination == pagination;

    @override
    int get hashCode =>
        data.hashCode +
        pagination.hashCode;

  factory TestimonialList.fromJson(Map<String, dynamic> json) => _$TestimonialListFromJson(json);

  Map<String, dynamic> toJson() => _$TestimonialListToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

