//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'login_response_user.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class LoginResponseUser {
  /// Returns a new [LoginResponseUser] instance.
  LoginResponseUser({

    required  this.id,

    required  this.email,

    required  this.name,
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





    @override
    bool operator ==(Object other) => identical(this, other) || other is LoginResponseUser &&
      other.id == id &&
      other.email == email &&
      other.name == name;

    @override
    int get hashCode =>
        id.hashCode +
        email.hashCode +
        (name == null ? 0 : name.hashCode);

  factory LoginResponseUser.fromJson(Map<String, dynamic> json) => _$LoginResponseUserFromJson(json);

  Map<String, dynamic> toJson() => _$LoginResponseUserToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

