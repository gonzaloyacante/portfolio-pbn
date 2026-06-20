//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'booking.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class Booking {
  /// Returns a new [Booking] instance.
  Booking({

    required  this.id,

    required  this.date,

    required  this.endDate,

    required  this.clientName,

    required  this.clientEmail,

    required  this.clientPhone,

    required  this.clientNotes,

    required  this.guestCount,

    required  this.serviceId,

    required  this.adminNotes,

    required  this.totalAmount,

    required  this.paymentStatus,

    required  this.paymentMethod,

    required  this.status,

    required  this.cancellationReason,

    required  this.paidAmount,

    required  this.paymentRef,

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
    
    name: r'date',
    required: true,
    includeIfNull: false,
  )


  final String date;



  @JsonKey(
    
    name: r'endDate',
    required: true,
    includeIfNull: true,
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
    required: true,
    includeIfNull: true,
  )


  final String? clientPhone;



  @JsonKey(
    
    name: r'clientNotes',
    required: true,
    includeIfNull: true,
  )


  final String? clientNotes;



  @JsonKey(
    
    name: r'guestCount',
    required: true,
    includeIfNull: true,
  )


  final num? guestCount;



  @JsonKey(
    
    name: r'serviceId',
    required: true,
    includeIfNull: false,
  )


  final String serviceId;



  @JsonKey(
    
    name: r'adminNotes',
    required: true,
    includeIfNull: true,
  )


  final String? adminNotes;



  @JsonKey(
    
    name: r'totalAmount',
    required: true,
    includeIfNull: true,
  )


  final num? totalAmount;



  @JsonKey(
    
    name: r'paymentStatus',
    required: true,
    includeIfNull: true,
  )


  final String? paymentStatus;



  @JsonKey(
    
    name: r'paymentMethod',
    required: true,
    includeIfNull: true,
  )


  final String? paymentMethod;



      /// Estado de la reserva
  @JsonKey(
    
    name: r'status',
    required: true,
    includeIfNull: false,
  )


  final BookingStatusEnum status;



  @JsonKey(
    
    name: r'cancellationReason',
    required: true,
    includeIfNull: true,
  )


  final String? cancellationReason;



  @JsonKey(
    
    name: r'paidAmount',
    required: true,
    includeIfNull: true,
  )


  final num? paidAmount;



  @JsonKey(
    
    name: r'paymentRef',
    required: true,
    includeIfNull: true,
  )


  final String? paymentRef;



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
    bool operator ==(Object other) => identical(this, other) || other is Booking &&
      other.id == id &&
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
      other.paymentRef == paymentRef &&
      other.createdAt == createdAt &&
      other.updatedAt == updatedAt;

    @override
    int get hashCode =>
        id.hashCode +
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
        (paymentRef == null ? 0 : paymentRef.hashCode) +
        createdAt.hashCode +
        updatedAt.hashCode;

  factory Booking.fromJson(Map<String, dynamic> json) => _$BookingFromJson(json);

  Map<String, dynamic> toJson() => _$BookingToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

/// Estado de la reserva
enum BookingStatusEnum {
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

const BookingStatusEnum(this.value);

final String value;

@override
String toString() => value;
}


