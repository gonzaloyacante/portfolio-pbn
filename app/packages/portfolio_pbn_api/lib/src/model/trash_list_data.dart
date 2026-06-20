//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'trash_list_data.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TrashListData {
  /// Returns a new [TrashListData] instance.
  TrashListData({

     this.category,

     this.service,

     this.testimonial,

     this.contact,

     this.booking,
  });

  @JsonKey(
    
    name: r'category',
    required: false,
    includeIfNull: false,
  )


  final List<Map<String, Object>>? category;



  @JsonKey(
    
    name: r'service',
    required: false,
    includeIfNull: false,
  )


  final List<Map<String, Object>>? service;



  @JsonKey(
    
    name: r'testimonial',
    required: false,
    includeIfNull: false,
  )


  final List<Map<String, Object>>? testimonial;



  @JsonKey(
    
    name: r'contact',
    required: false,
    includeIfNull: false,
  )


  final List<Map<String, Object>>? contact;



  @JsonKey(
    
    name: r'booking',
    required: false,
    includeIfNull: false,
  )


  final List<Map<String, Object>>? booking;





    @override
    bool operator ==(Object other) => identical(this, other) || other is TrashListData &&
      other.category == category &&
      other.service == service &&
      other.testimonial == testimonial &&
      other.contact == contact &&
      other.booking == booking;

    @override
    int get hashCode =>
        category.hashCode +
        service.hashCode +
        testimonial.hashCode +
        contact.hashCode +
        booking.hashCode;

  factory TrashListData.fromJson(Map<String, dynamic> json) => _$TrashListDataFromJson(json);

  Map<String, dynamic> toJson() => _$TrashListDataToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

