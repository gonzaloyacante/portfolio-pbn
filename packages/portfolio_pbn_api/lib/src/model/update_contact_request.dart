//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'update_contact_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateContactRequest {
  /// Returns a new [UpdateContactRequest] instance.
  UpdateContactRequest({

     this.status,

     this.priority,

     this.isRead,

     this.isImportant,

     this.adminNote,

     this.tags,
  });

  @JsonKey(
    
    name: r'status',
    required: false,
    includeIfNull: false,
  )


  final String? status;



  @JsonKey(
    
    name: r'priority',
    required: false,
    includeIfNull: false,
  )


  final String? priority;



  @JsonKey(
    
    name: r'isRead',
    required: false,
    includeIfNull: false,
  )


  final bool? isRead;



  @JsonKey(
    
    name: r'isImportant',
    required: false,
    includeIfNull: false,
  )


  final bool? isImportant;



  @JsonKey(
    
    name: r'adminNote',
    required: false,
    includeIfNull: false,
  )


  final String? adminNote;



  @JsonKey(
    
    name: r'tags',
    required: false,
    includeIfNull: false,
  )


  final List<String>? tags;





    @override
    bool operator ==(Object other) => identical(this, other) || other is UpdateContactRequest &&
      other.status == status &&
      other.priority == priority &&
      other.isRead == isRead &&
      other.isImportant == isImportant &&
      other.adminNote == adminNote &&
      other.tags == tags;

    @override
    int get hashCode =>
        status.hashCode +
        priority.hashCode +
        isRead.hashCode +
        isImportant.hashCode +
        (adminNote == null ? 0 : adminNote.hashCode) +
        tags.hashCode;

  factory UpdateContactRequest.fromJson(Map<String, dynamic> json) => _$UpdateContactRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateContactRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

