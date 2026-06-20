//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'contact_item.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ContactItem {
  /// Returns a new [ContactItem] instance.
  ContactItem({

    required  this.id,

    required  this.name,

    required  this.email,

    required  this.phone,

    required  this.subject,

    required  this.status,

    required  this.priority,

    required  this.isRead,

    required  this.readAt,

    required  this.tags,

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
    
    name: r'subject',
    required: true,
    includeIfNull: true,
  )


  final String? subject;



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
    
    name: r'tags',
    required: true,
    includeIfNull: false,
  )


  final List<String> tags;



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
    bool operator ==(Object other) => identical(this, other) || other is ContactItem &&
      other.id == id &&
      other.name == name &&
      other.email == email &&
      other.phone == phone &&
      other.subject == subject &&
      other.status == status &&
      other.priority == priority &&
      other.isRead == isRead &&
      other.readAt == readAt &&
      other.tags == tags &&
      other.createdAt == createdAt &&
      other.updatedAt == updatedAt;

    @override
    int get hashCode =>
        id.hashCode +
        name.hashCode +
        email.hashCode +
        (phone == null ? 0 : phone.hashCode) +
        (subject == null ? 0 : subject.hashCode) +
        status.hashCode +
        priority.hashCode +
        isRead.hashCode +
        (readAt == null ? 0 : readAt.hashCode) +
        tags.hashCode +
        createdAt.hashCode +
        updatedAt.hashCode;

  factory ContactItem.fromJson(Map<String, dynamic> json) => _$ContactItemFromJson(json);

  Map<String, dynamic> toJson() => _$ContactItemToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

