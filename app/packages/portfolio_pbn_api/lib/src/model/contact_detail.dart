//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'contact_detail.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ContactDetail {
  /// Returns a new [ContactDetail] instance.
  ContactDetail({

    required  this.id,

    required  this.name,

    required  this.email,

    required  this.phone,

    required  this.message,

    required  this.subject,

    required  this.responsePreference,

    required  this.instagramUser,

    required  this.status,

    required  this.priority,

    required  this.isRead,

    required  this.readAt,

    required  this.isImportant,

    required  this.adminNote,

    required  this.tags,

    required  this.ipAddress,

    required  this.referrer,

    required  this.utmSource,

    required  this.utmMedium,

    required  this.utmCampaign,

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
    
    name: r'email',
    required: true,
    includeIfNull: false,
  )


  final String email;



  @JsonKey(
    
    name: r'phone',
    required: true,
    includeIfNull: true,
  )


  final String? phone;



  @JsonKey(
    
    name: r'message',
    required: true,
    includeIfNull: false,
  )


  final String message;



  @JsonKey(
    
    name: r'subject',
    required: true,
    includeIfNull: true,
  )


  final String? subject;



  @JsonKey(
    
    name: r'responsePreference',
    required: true,
    includeIfNull: false,
  )


  final String responsePreference;



  @JsonKey(
    
    name: r'instagramUser',
    required: true,
    includeIfNull: true,
  )


  final String? instagramUser;



  @JsonKey(
    
    name: r'status',
    required: true,
    includeIfNull: false,
  )


  final String status;



  @JsonKey(
    
    name: r'priority',
    required: true,
    includeIfNull: false,
  )


  final String priority;



  @JsonKey(
    
    name: r'isRead',
    required: true,
    includeIfNull: false,
  )


  final bool isRead;



  @JsonKey(
    
    name: r'readAt',
    required: true,
    includeIfNull: true,
  )


  final String? readAt;



  @JsonKey(
    
    name: r'isImportant',
    required: true,
    includeIfNull: false,
  )


  final bool isImportant;



  @JsonKey(
    
    name: r'adminNote',
    required: true,
    includeIfNull: true,
  )


  final String? adminNote;



  @JsonKey(
    
    name: r'tags',
    required: true,
    includeIfNull: false,
  )


  final List<String> tags;



  @JsonKey(
    
    name: r'ipAddress',
    required: true,
    includeIfNull: true,
  )


  final String? ipAddress;



  @JsonKey(
    
    name: r'referrer',
    required: true,
    includeIfNull: true,
  )


  final String? referrer;



  @JsonKey(
    
    name: r'utmSource',
    required: true,
    includeIfNull: true,
  )


  final String? utmSource;



  @JsonKey(
    
    name: r'utmMedium',
    required: true,
    includeIfNull: true,
  )


  final String? utmMedium;



  @JsonKey(
    
    name: r'utmCampaign',
    required: true,
    includeIfNull: true,
  )


  final String? utmCampaign;



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
    bool operator ==(Object other) => identical(this, other) || other is ContactDetail &&
      other.id == id &&
      other.name == name &&
      other.email == email &&
      other.phone == phone &&
      other.message == message &&
      other.subject == subject &&
      other.responsePreference == responsePreference &&
      other.instagramUser == instagramUser &&
      other.status == status &&
      other.priority == priority &&
      other.isRead == isRead &&
      other.readAt == readAt &&
      other.isImportant == isImportant &&
      other.adminNote == adminNote &&
      other.tags == tags &&
      other.ipAddress == ipAddress &&
      other.referrer == referrer &&
      other.utmSource == utmSource &&
      other.utmMedium == utmMedium &&
      other.utmCampaign == utmCampaign &&
      other.createdAt == createdAt &&
      other.updatedAt == updatedAt;

    @override
    int get hashCode =>
        id.hashCode +
        name.hashCode +
        email.hashCode +
        (phone == null ? 0 : phone.hashCode) +
        message.hashCode +
        (subject == null ? 0 : subject.hashCode) +
        responsePreference.hashCode +
        (instagramUser == null ? 0 : instagramUser.hashCode) +
        status.hashCode +
        priority.hashCode +
        isRead.hashCode +
        (readAt == null ? 0 : readAt.hashCode) +
        isImportant.hashCode +
        (adminNote == null ? 0 : adminNote.hashCode) +
        tags.hashCode +
        (ipAddress == null ? 0 : ipAddress.hashCode) +
        (referrer == null ? 0 : referrer.hashCode) +
        (utmSource == null ? 0 : utmSource.hashCode) +
        (utmMedium == null ? 0 : utmMedium.hashCode) +
        (utmCampaign == null ? 0 : utmCampaign.hashCode) +
        createdAt.hashCode +
        updatedAt.hashCode;

  factory ContactDetail.fromJson(Map<String, dynamic> json) => _$ContactDetailFromJson(json);

  Map<String, dynamic> toJson() => _$ContactDetailToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

