//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'create_category_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CreateCategoryRequest {
  /// Returns a new [CreateCategoryRequest] instance.
  CreateCategoryRequest({

    required  this.name,

     this.slug,

     this.description,

     this.coverImageUrl,

     this.isActive,
  });

  @JsonKey(
    
    name: r'name',
    required: true,
    includeIfNull: false,
  )


  final String name;



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





    @override
    bool operator ==(Object other) => identical(this, other) || other is CreateCategoryRequest &&
      other.name == name &&
      other.slug == slug &&
      other.description == description &&
      other.coverImageUrl == coverImageUrl &&
      other.isActive == isActive;

    @override
    int get hashCode =>
        name.hashCode +
        slug.hashCode +
        (description == null ? 0 : description.hashCode) +
        (coverImageUrl == null ? 0 : coverImageUrl.hashCode) +
        isActive.hashCode;

  factory CreateCategoryRequest.fromJson(Map<String, dynamic> json) => _$CreateCategoryRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateCategoryRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

