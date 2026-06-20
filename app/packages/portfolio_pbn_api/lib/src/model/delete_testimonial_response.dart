//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'delete_testimonial_response.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DeleteTestimonialResponse {
  /// Returns a new [DeleteTestimonialResponse] instance.
  DeleteTestimonialResponse({

    required  this.ok,
  });

  @JsonKey(
    
    name: r'ok',
    required: true,
    includeIfNull: false,
  )


  final bool ok;





    @override
    bool operator ==(Object other) => identical(this, other) || other is DeleteTestimonialResponse &&
      other.ok == ok;

    @override
    int get hashCode =>
        ok.hashCode;

  factory DeleteTestimonialResponse.fromJson(Map<String, dynamic> json) => _$DeleteTestimonialResponseFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteTestimonialResponseToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

