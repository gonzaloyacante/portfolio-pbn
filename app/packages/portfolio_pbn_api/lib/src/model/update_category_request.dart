//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'update_category_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateCategoryRequest {
  /// Returns a new [UpdateCategoryRequest] instance.
  UpdateCategoryRequest({

     this.name,

     this.slug,

     this.description,

     this.coverImageUrl,

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
    
    name: r'slug',
    required: false,
    includeIfNull: false,
  )


  final String? slug;



  @JsonKey(
    
    name: r'description',
    required: false,
    includeIfNull: false,
  )


  final String? description;



  @JsonKey(
    
    name: r'coverImageUrl',
    required: false,
    includeIfNull: false,
  )


  final String? coverImageUrl;



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
    bool operator ==(Object other) => identical(this, other) || other is UpdateCategoryRequest &&
      other.name == name &&
      other.slug == slug &&
      other.description == description &&
      other.coverImageUrl == coverImageUrl &&
      other.isActive == isActive &&
      other.sortOrder == sortOrder;

    @override
    int get hashCode =>
        name.hashCode +
        slug.hashCode +
        (description == null ? 0 : description.hashCode) +
        (coverImageUrl == null ? 0 : coverImageUrl.hashCode) +
        isActive.hashCode +
        sortOrder.hashCode;

  factory UpdateCategoryRequest.fromJson(Map<String, dynamic> json) => _$UpdateCategoryRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateCategoryRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

