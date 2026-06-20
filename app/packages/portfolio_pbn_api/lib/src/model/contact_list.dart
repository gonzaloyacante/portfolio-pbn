//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:portfolio_pbn_api/src/model/pagination.dart';
import 'package:portfolio_pbn_api/src/model/contact_item.dart';
import 'package:json_annotation/json_annotation.dart';

part 'contact_list.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ContactList {
  /// Returns a new [ContactList] instance.
  ContactList({

    required  this.data,

    required  this.pagination,
  });

  @JsonKey(
    
    name: r'data',
    required: true,
    includeIfNull: false,
  )


  final List<ContactItem> data;



  @JsonKey(
    
    name: r'pagination',
    required: true,
    includeIfNull: false,
  )


  final Pagination pagination;





    @override
    bool operator ==(Object other) => identical(this, other) || other is ContactList &&
      other.data == data &&
      other.pagination == pagination;

    @override
    int get hashCode =>
        data.hashCode +
        pagination.hashCode;

  factory ContactList.fromJson(Map<String, dynamic> json) => _$ContactListFromJson(json);

  Map<String, dynamic> toJson() => _$ContactListToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

