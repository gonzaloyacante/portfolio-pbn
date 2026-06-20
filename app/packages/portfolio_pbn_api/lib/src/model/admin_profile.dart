//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'admin_profile.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AdminProfile {
  /// Returns a new [AdminProfile] instance.
  AdminProfile({

    required  this.id,

    required  this.email,

    required  this.name,

    required  this.role,
  });

  @JsonKey(
    
    name: r'id',
    required: true,
    includeIfNull: false,
  )


  final String id;



  @JsonKey(
    
    name: r'email',
    required: true,
    includeIfNull: false,
  )


  final String email;



  @JsonKey(
    
    name: r'name',
    required: true,
    includeIfNull: true,
  )


  final String? name;



  @JsonKey(
    
    name: r'role',
    required: true,
    includeIfNull: false,
  )


  final String role;





    @override
    bool operator ==(Object other) => identical(this, other) || other is AdminProfile &&
      other.id == id &&
      other.email == email &&
      other.name == name &&
      other.role == role;

    @override
    int get hashCode =>
        id.hashCode +
        email.hashCode +
        (name == null ? 0 : name.hashCode) +
        role.hashCode;

  factory AdminProfile.fromJson(Map<String, dynamic> json) => _$AdminProfileFromJson(json);

  Map<String, dynamic> toJson() => _$AdminProfileToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

