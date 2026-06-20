// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_me_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateMeRequest _$UpdateMeRequestFromJson(Map<String, dynamic> json) =>
    $checkedCreate('UpdateMeRequest', json, ($checkedConvert) {
      final val = UpdateMeRequest(
        currentPassword: $checkedConvert(
          'currentPassword',
          (v) => v as String?,
        ),
        newPassword: $checkedConvert('newPassword', (v) => v as String?),
        name: $checkedConvert('name', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$UpdateMeRequestToJson(UpdateMeRequest instance) =>
    <String, dynamic>{
      'currentPassword': ?instance.currentPassword,
      'newPassword': ?instance.newPassword,
      'name': ?instance.name,
    };
