//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'testimonial_detail.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TestimonialDetail {
  /// Returns a new [TestimonialDetail] instance.
  TestimonialDetail({

    required  this.id,

    required  this.name,

    required  this.text,

    required  this.excerpt,

    required  this.email,

    required  this.phone,

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
    
    name: r'text',
    required: true,
    includeIfNull: false,
  )


  final String text;



  @JsonKey(
    
    name: r'excerpt',
    required: true,
    includeIfNull: true,
  )


  final String? excerpt;



  @JsonKey(
    
    name: r'email',
    required: true,
    includeIfNull: true,
  )


  final String? email;



  @JsonKey(
    
    name: r'phone',
    required: true,
    includeIfNull: true,
  )


  final String? phone;



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
    bool operator ==(Object other) => identical(this, other) || other is TestimonialDetail &&
      other.id == id &&
      other.name == name &&
      other.text == text &&
      other.excerpt == excerpt &&
      other.email == email &&
      other.phone == phone &&
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
        text.hashCode +
        (excerpt == null ? 0 : excerpt.hashCode) +
        (email == null ? 0 : email.hashCode) +
        (phone == null ? 0 : phone.hashCode) +
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

  factory TestimonialDetail.fromJson(Map<String, dynamic> json) => _$TestimonialDetailFromJson(json);

  Map<String, dynamic> toJson() => _$TestimonialDetailToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

