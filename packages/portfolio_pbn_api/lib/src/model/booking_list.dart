//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:portfolio_pbn_api/src/model/booking.dart';
import 'package:json_annotation/json_annotation.dart';

part 'booking_list.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class BookingList {
  /// Returns a new [BookingList] instance.
  BookingList({

    required  this.items,

    required  this.total,

    required  this.page,

    required  this.totalPages,
  });

  @JsonKey(
    
    name: r'items',
    required: true,
    includeIfNull: false,
  )


  final List<Booking> items;



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
    
    name: r'totalPages',
    required: true,
    includeIfNull: false,
  )


  final num totalPages;





    @override
    bool operator ==(Object other) => identical(this, other) || other is BookingList &&
      other.items == items &&
      other.total == total &&
      other.page == page &&
      other.totalPages == totalPages;

    @override
    int get hashCode =>
        items.hashCode +
        total.hashCode +
        page.hashCode +
        totalPages.hashCode;

  factory BookingList.fromJson(Map<String, dynamic> json) => _$BookingListFromJson(json);

  Map<String, dynamic> toJson() => _$BookingListToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

