//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'testimonial_item.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TestimonialItem {
  /// Returns a new [TestimonialItem] instance.
  TestimonialItem({

    required  this.id,

    required  this.name,

    required  this.excerpt,

    required  this.position,

    required  this.company,

    required  this.avatarUrl,

    required  this.rating,

    required  this.verified,

    required  this.featured,

    required  this.status,

    required  this.isActive,

    required  this.sortOrder,

    required  this.createdAt,

    required  this.updatedAt,
  });

  @JsonKey(
    
    name: r'id',
    required: true,
    includeIfNull: false,
  )


  final String id;



  @JsonKey(
    
    name: r'name',
    required: true,
    includeIfNull: false,
  )


  final String name;



  @JsonKey(
    
    name: r'excerpt',
    required: true,
    includeIfNull: true,
  )


  final String? excerpt;



  @JsonKey(
    
    name: r'position',
    required: true,
    includeIfNull: true,
  )


  final String? position;



  @JsonKey(
    
    name: r'company',
    required: true,
    includeIfNull: true,
  )


  final String? company;



  @JsonKey(
    
    name: r'avatarUrl',
    required: true,
    includeIfNull: true,
  )


  final String? avatarUrl;



  @JsonKey(
    
    name: r'rating',
    required: true,
    includeIfNull: false,
  )


  final num rating;



  @JsonKey(
    
    name: r'verified',
    required: true,
    includeIfNull: false,
  )


  final bool verified;



  @JsonKey(
    
    name: r'featured',
    required: true,
    includeIfNull: false,
  )


  final bool featured;



  @JsonKey(
    
    name: r'status',
    required: true,
    includeIfNull: false,
  )


  final String status;



  @JsonKey(
    
    name: r'isActive',
    required: true,
    includeIfNull: false,
  )


  final bool isActive;



  @JsonKey(
    
    name: r'sortOrder',
    required: true,
    includeIfNull: false,
  )


  final num sortOrder;



  @JsonKey(
    
    name: r'createdAt',
    required: true,
    includeIfNull: false,
  )


  final String createdAt;



  @JsonKey(
    
    name: r'updatedAt',
    required: true,
    includeIfNull: false,
  )


  final String updatedAt;





    @override
    bool operator ==(Object other) => identical(this, other) || other is TestimonialItem &&
      other.id == id &&
      other.name == name &&
      other.excerpt == excerpt &&
      other.position == position &&
      other.company == company &&
      other.avatarUrl == avatarUrl &&
      other.rating == rating &&
      other.verified == verified &&
      other.featured == featured &&
      other.status == status &&
      other.isActive == isActive &&
      other.sortOrder == sortOrder &&
      other.createdAt == createdAt &&
      other.updatedAt == updatedAt;

    @override
    int get hashCode =>
        id.hashCode +
        name.hashCode +
        (excerpt == null ? 0 : excerpt.hashCode) +
        (position == null ? 0 : position.hashCode) +
        (company == null ? 0 : company.hashCode) +
        (avatarUrl == null ? 0 : avatarUrl.hashCode) +
        rating.hashCode +
        verified.hashCode +
        featured.hashCode +
        status.hashCode +
        isActive.hashCode +
        sortOrder.hashCode +
        createdAt.hashCode +
        updatedAt.hashCode;

  factory TestimonialItem.fromJson(Map<String, dynamic> json) => _$TestimonialItemFromJson(json);

  Map<String, dynamic> toJson() => _$TestimonialItemToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

