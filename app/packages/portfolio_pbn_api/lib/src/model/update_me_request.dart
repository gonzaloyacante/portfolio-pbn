//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'update_me_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateMeRequest {
  /// Returns a new [UpdateMeRequest] instance.
  UpdateMeRequest({

     this.currentPassword,

     this.newPassword,

     this.name,
  });

  @JsonKey(
    
    name: r'currentPassword',
    required: false,
    includeIfNull: false,
  )


  final String? currentPassword;



  @JsonKey(
    
    name: r'newPassword',
    required: false,
    includeIfNull: false,
  )


  final String? newPassword;



  @JsonKey(
    
    name: r'name',
    required: false,
    includeIfNull: false,
  )


  final String? name;





    @override
    bool operator ==(Object other) => identical(this, other) || other is UpdateMeRequest &&
      other.currentPassword == currentPassword &&
      other.newPassword == newPassword &&
      other.name == name;

    @override
    int get hashCode =>
        currentPassword.hashCode +
        newPassword.hashCode +
        name.hashCode;

  factory UpdateMeRequest.fromJson(Map<String, dynamic> json) => _$UpdateMeRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateMeRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

