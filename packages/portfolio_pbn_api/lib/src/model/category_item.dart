//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'category_item.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CategoryItem {
  /// Returns a new [CategoryItem] instance.
  CategoryItem({

    required  this.id,

    required  this.name,

    required  this.slug,

    required  this.description,

    required  this.coverImageUrl,

    required  this.sortOrder,

    required  this.isActive,

    required  this.imageCount,

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
    
    name: r'slug',
    required: true,
    includeIfNull: false,
  )


  final String slug;



  @JsonKey(
    
    name: r'description',
    required: true,
    includeIfNull: true,
  )


  final String? description;



  @JsonKey(
    
    name: r'coverImageUrl',
    required: true,
    includeIfNull: true,
  )


  final String? coverImageUrl;



  @JsonKey(
    
    name: r'sortOrder',
    required: true,
    includeIfNull: false,
  )


  final num sortOrder;



  @JsonKey(
    
    name: r'isActive',
    required: true,
    includeIfNull: false,
  )


  final bool isActive;



  @JsonKey(
    
    name: r'imageCount',
    required: true,
    includeIfNull: false,
  )


  final num imageCount;



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
    bool operator ==(Object other) => identical(this, other) || other is CategoryItem &&
      other.id == id &&
      other.name == name &&
      other.slug == slug &&
      other.description == description &&
      other.coverImageUrl == coverImageUrl &&
      other.sortOrder == sortOrder &&
      other.isActive == isActive &&
      other.imageCount == imageCount &&
      other.createdAt == createdAt &&
      other.updatedAt == updatedAt;

    @override
    int get hashCode =>
        id.hashCode +
        name.hashCode +
        slug.hashCode +
        (description == null ? 0 : description.hashCode) +
        (coverImageUrl == null ? 0 : coverImageUrl.hashCode) +
        sortOrder.hashCode +
        isActive.hashCode +
        imageCount.hashCode +
        createdAt.hashCode +
        updatedAt.hashCode;

  factory CategoryItem.fromJson(Map<String, dynamic> json) => _$CategoryItemFromJson(json);

  Map<String, dynamic> toJson() => _$CategoryItemToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

