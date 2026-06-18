//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'update_testimonial_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateTestimonialRequest {
  /// Returns a new [UpdateTestimonialRequest] instance.
  UpdateTestimonialRequest({

     this.name,

     this.text,

     this.excerpt,

     this.position,

     this.company,

     this.avatarUrl,

     this.rating,

     this.featured,

     this.status,

     this.isActive,

     this.sortOrder,
  });

  @JsonKey(
    
    name: r'name',
    required: false,
    includeIfNull: false,
  )


  final String? name;



  @JsonKey(
    
    name: r'text',
    required: false,
    includeIfNull: false,
  )


  final String? text;



  @JsonKey(
    
    name: r'excerpt',
    required: false,
    includeIfNull: false,
  )


  final String? excerpt;



  @JsonKey(
    
    name: r'position',
    required: false,
    includeIfNull: false,
  )


  final String? position;



  @JsonKey(
    
    name: r'company',
    required: false,
    includeIfNull: false,
  )


  final String? company;



  @JsonKey(
    
    name: r'avatarUrl',
    required: false,
    includeIfNull: false,
  )


  final String? avatarUrl;



          // minimum: 1
          // maximum: 5
  @JsonKey(
    
    name: r'rating',
    required: false,
    includeIfNull: false,
  )


  final int? rating;



  @JsonKey(
    
    name: r'featured',
    required: false,
    includeIfNull: false,
  )


  final bool? featured;



  @JsonKey(
    
    name: r'status',
    required: false,
    includeIfNull: false,
  )


  final String? status;



  @JsonKey(
    
    name: r'isActive',
    required: false,
    includeIfNull: false,
  )


  final bool? isActive;



  @JsonKey(
    
    name: r'sortOrder',
    required: false,
    includeIfNull: false,
  )


  final int? sortOrder;





    @override
    bool operator ==(Object other) => identical(this, other) || other is UpdateTestimonialRequest &&
      other.name == name &&
      other.text == text &&
      other.excerpt == excerpt &&
      other.position == position &&
      other.company == company &&
      other.avatarUrl == avatarUrl &&
      other.rating == rating &&
      other.featured == featured &&
      other.status == status &&
      other.isActive == isActive &&
      other.sortOrder == sortOrder;

    @override
    int get hashCode =>
        name.hashCode +
        text.hashCode +
        (excerpt == null ? 0 : excerpt.hashCode) +
        (position == null ? 0 : position.hashCode) +
        (company == null ? 0 : company.hashCode) +
        (avatarUrl == null ? 0 : avatarUrl.hashCode) +
        rating.hashCode +
        featured.hashCode +
        status.hashCode +
        isActive.hashCode +
        sortOrder.hashCode;

  factory UpdateTestimonialRequest.fromJson(Map<String, dynamic> json) => _$UpdateTestimonialRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateTestimonialRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

