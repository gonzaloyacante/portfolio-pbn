//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'create_booking_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CreateBookingRequest {
  /// Returns a new [CreateBookingRequest] instance.
  CreateBookingRequest({

    required  this.date,

     this.endDate,

    required  this.clientName,

    required  this.clientEmail,

     this.clientPhone,

     this.clientNotes,

     this.guestCount,

    required  this.serviceId,

     this.adminNotes,

     this.totalAmount,

     this.paymentStatus,

     this.paymentMethod,

     this.status,
  });

  @JsonKey(
    
    name: r'date',
    required: true,
    includeIfNull: false,
  )


  final String date;



  @JsonKey(
    
    name: r'endDate',
    required: false,
    includeIfNull: false,
  )


  final String? endDate;



  @JsonKey(
    
    name: r'clientName',
    required: true,
    includeIfNull: false,
  )


  final String clientName;



  @JsonKey(
    
    name: r'clientEmail',
    required: true,
    includeIfNull: false,
  )


  final String clientEmail;



  @JsonKey(
    
    name: r'clientPhone',
    required: false,
    includeIfNull: false,
  )


  final String? clientPhone;



  @JsonKey(
    
    name: r'clientNotes',
    required: false,
    includeIfNull: false,
  )


  final String? clientNotes;



  @JsonKey(
    
    name: r'guestCount',
    required: false,
    includeIfNull: false,
  )


  final int? guestCount;



  @JsonKey(
    
    name: r'serviceId',
    required: true,
    includeIfNull: false,
  )


  final String serviceId;



  @JsonKey(
    
    name: r'adminNotes',
    required: false,
    includeIfNull: false,
  )


  final String? adminNotes;



  @JsonKey(
    
    name: r'totalAmount',
    required: false,
    includeIfNull: false,
  )


  final num? totalAmount;



  @JsonKey(
    
    name: r'paymentStatus',
    required: false,
    includeIfNull: false,
  )


  final String? paymentStatus;



  @JsonKey(
    
    name: r'paymentMethod',
    required: false,
    includeIfNull: false,
  )


  final String? paymentMethod;



      /// Estado de la reserva
  @JsonKey(
    
    name: r'status',
    required: false,
    includeIfNull: false,
  )


  final CreateBookingRequestStatusEnum? status;





    @override
    bool operator ==(Object other) => identical(this, other) || other is CreateBookingRequest &&
      other.date == date &&
      other.endDate == endDate &&
      other.clientName == clientName &&
      other.clientEmail == clientEmail &&
      other.clientPhone == clientPhone &&
      other.clientNotes == clientNotes &&
      other.guestCount == guestCount &&
      other.serviceId == serviceId &&
      other.adminNotes == adminNotes &&
      other.totalAmount == totalAmount &&
      other.paymentStatus == paymentStatus &&
      other.paymentMethod == paymentMethod &&
      other.status == status;

    @override
    int get hashCode =>
        date.hashCode +
        (endDate == null ? 0 : endDate.hashCode) +
        clientName.hashCode +
        clientEmail.hashCode +
        (clientPhone == null ? 0 : clientPhone.hashCode) +
        (clientNotes == null ? 0 : clientNotes.hashCode) +
        (guestCount == null ? 0 : guestCount.hashCode) +
        serviceId.hashCode +
        (adminNotes == null ? 0 : adminNotes.hashCode) +
        (totalAmount == null ? 0 : totalAmount.hashCode) +
        (paymentStatus == null ? 0 : paymentStatus.hashCode) +
        (paymentMethod == null ? 0 : paymentMethod.hashCode) +
        status.hashCode;

  factory CreateBookingRequest.fromJson(Map<String, dynamic> json) => _$CreateBookingRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateBookingRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

/// Estado de la reserva
enum CreateBookingRequestStatusEnum {
    /// Estado de la reserva
@JsonValue(r'PENDING')
PENDING(r'PENDING'),
    /// Estado de la reserva
@JsonValue(r'CONFIRMED')
CONFIRMED(r'CONFIRMED'),
    /// Estado de la reserva
@JsonValue(r'IN_PROGRESS')
IN_PROGRESS(r'IN_PROGRESS'),
    /// Estado de la reserva
@JsonValue(r'CANCELLED')
CANCELLED(r'CANCELLED'),
    /// Estado de la reserva
@JsonValue(r'COMPLETED')
COMPLETED(r'COMPLETED'),
    /// Estado de la reserva
@JsonValue(r'NO_SHOW')
NO_SHOW(r'NO_SHOW');

const CreateBookingRequestStatusEnum(this.value);

final String value;

@override
String toString() => value;
}


