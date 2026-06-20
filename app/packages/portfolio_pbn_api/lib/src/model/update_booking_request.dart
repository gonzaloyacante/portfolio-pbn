//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'update_booking_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateBookingRequest {
  /// Returns a new [UpdateBookingRequest] instance.
  UpdateBookingRequest({

     this.date,

     this.endDate,

     this.clientName,

     this.clientEmail,

     this.clientPhone,

     this.clientNotes,

     this.guestCount,

     this.serviceId,

     this.adminNotes,

     this.totalAmount,

     this.paymentStatus,

     this.paymentMethod,

     this.status,

     this.cancellationReason,

     this.paidAmount,

     this.paymentRef,
  });

  @JsonKey(
    
    name: r'date',
    required: false,
    includeIfNull: false,
  )


  final String? date;



  @JsonKey(
    
    name: r'endDate',
    required: false,
    includeIfNull: false,
  )


  final String? endDate;



  @JsonKey(
    
    name: r'clientName',
    required: false,
    includeIfNull: false,
  )


  final String? clientName;



  @JsonKey(
    
    name: r'clientEmail',
    required: false,
    includeIfNull: false,
  )


  final String? clientEmail;



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


  final num? guestCount;



  @JsonKey(
    
    name: r'serviceId',
    required: false,
    includeIfNull: false,
  )


  final String? serviceId;



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


  final UpdateBookingRequestStatusEnum? status;



  @JsonKey(
    
    name: r'cancellationReason',
    required: false,
    includeIfNull: false,
  )


  final String? cancellationReason;



  @JsonKey(
    
    name: r'paidAmount',
    required: false,
    includeIfNull: false,
  )


  final num? paidAmount;



  @JsonKey(
    
    name: r'paymentRef',
    required: false,
    includeIfNull: false,
  )


  final String? paymentRef;





    @override
    bool operator ==(Object other) => identical(this, other) || other is UpdateBookingRequest &&
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
      other.status == status &&
      other.cancellationReason == cancellationReason &&
      other.paidAmount == paidAmount &&
      other.paymentRef == paymentRef;

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
        status.hashCode +
        (cancellationReason == null ? 0 : cancellationReason.hashCode) +
        (paidAmount == null ? 0 : paidAmount.hashCode) +
        (paymentRef == null ? 0 : paymentRef.hashCode);

  factory UpdateBookingRequest.fromJson(Map<String, dynamic> json) => _$UpdateBookingRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateBookingRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

/// Estado de la reserva
enum UpdateBookingRequestStatusEnum {
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

const UpdateBookingRequestStatusEnum(this.value);

final String value;

@override
String toString() => value;
}


