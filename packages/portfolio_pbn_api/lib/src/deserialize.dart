import 'package:portfolio_pbn_api/src/model/add_gallery_images_request.dart';
import 'package:portfolio_pbn_api/src/model/add_gallery_images_request_images_inner.dart';
import 'package:portfolio_pbn_api/src/model/add_gallery_images_response.dart';
import 'package:portfolio_pbn_api/src/model/admin_profile.dart';
import 'package:portfolio_pbn_api/src/model/analytics_overview.dart';
import 'package:portfolio_pbn_api/src/model/app_release.dart';
import 'package:portfolio_pbn_api/src/model/booking.dart';
import 'package:portfolio_pbn_api/src/model/booking_list.dart';
import 'package:portfolio_pbn_api/src/model/category_detail.dart';
import 'package:portfolio_pbn_api/src/model/category_gallery_response.dart';
import 'package:portfolio_pbn_api/src/model/category_item.dart';
import 'package:portfolio_pbn_api/src/model/category_list.dart';
import 'package:portfolio_pbn_api/src/model/contact_detail.dart';
import 'package:portfolio_pbn_api/src/model/contact_item.dart';
import 'package:portfolio_pbn_api/src/model/contact_list.dart';
import 'package:portfolio_pbn_api/src/model/create_booking_request.dart';
import 'package:portfolio_pbn_api/src/model/create_category_request.dart';
import 'package:portfolio_pbn_api/src/model/create_release_request.dart';
import 'package:portfolio_pbn_api/src/model/create_service_request.dart';
import 'package:portfolio_pbn_api/src/model/create_testimonial_request.dart';
import 'package:portfolio_pbn_api/src/model/delete_category_response.dart';
import 'package:portfolio_pbn_api/src/model/delete_contact_response.dart';
import 'package:portfolio_pbn_api/src/model/delete_gallery_image_request.dart';
import 'package:portfolio_pbn_api/src/model/delete_gallery_image_response.dart';
import 'package:portfolio_pbn_api/src/model/delete_release_response.dart';
import 'package:portfolio_pbn_api/src/model/delete_response.dart';
import 'package:portfolio_pbn_api/src/model/delete_service_response.dart';
import 'package:portfolio_pbn_api/src/model/delete_social_link_request.dart';
import 'package:portfolio_pbn_api/src/model/delete_social_link_response.dart';
import 'package:portfolio_pbn_api/src/model/delete_testimonial_response.dart';
import 'package:portfolio_pbn_api/src/model/delete_upload_request.dart';
import 'package:portfolio_pbn_api/src/model/delete_upload_response.dart';
import 'package:portfolio_pbn_api/src/model/error.dart';
import 'package:portfolio_pbn_api/src/model/gallery_image.dart';
import 'package:portfolio_pbn_api/src/model/login_request.dart';
import 'package:portfolio_pbn_api/src/model/login_response.dart';
import 'package:portfolio_pbn_api/src/model/login_response_user.dart';
import 'package:portfolio_pbn_api/src/model/logout_response.dart';
import 'package:portfolio_pbn_api/src/model/pagination.dart';
import 'package:portfolio_pbn_api/src/model/permanent_delete_trash_response.dart';
import 'package:portfolio_pbn_api/src/model/push_register_request.dart';
import 'package:portfolio_pbn_api/src/model/push_register_response.dart';
import 'package:portfolio_pbn_api/src/model/push_unregister_request.dart';
import 'package:portfolio_pbn_api/src/model/push_unregister_response.dart';
import 'package:portfolio_pbn_api/src/model/refresh_response.dart';
import 'package:portfolio_pbn_api/src/model/reorder_gallery_request.dart';
import 'package:portfolio_pbn_api/src/model/reorder_gallery_response.dart';
import 'package:portfolio_pbn_api/src/model/restore_trash_response.dart';
import 'package:portfolio_pbn_api/src/model/service_detail.dart';
import 'package:portfolio_pbn_api/src/model/service_item.dart';
import 'package:portfolio_pbn_api/src/model/service_list.dart';
import 'package:portfolio_pbn_api/src/model/service_pricing_tier.dart';
import 'package:portfolio_pbn_api/src/model/social_link.dart';
import 'package:portfolio_pbn_api/src/model/testimonial_detail.dart';
import 'package:portfolio_pbn_api/src/model/testimonial_item.dart';
import 'package:portfolio_pbn_api/src/model/testimonial_list.dart';
import 'package:portfolio_pbn_api/src/model/toggle_featured_request.dart';
import 'package:portfolio_pbn_api/src/model/trash_list.dart';
import 'package:portfolio_pbn_api/src/model/trash_list_data.dart';
import 'package:portfolio_pbn_api/src/model/update_booking_request.dart';
import 'package:portfolio_pbn_api/src/model/update_category_request.dart';
import 'package:portfolio_pbn_api/src/model/update_contact_request.dart';
import 'package:portfolio_pbn_api/src/model/update_me_request.dart';
import 'package:portfolio_pbn_api/src/model/update_me_response.dart';
import 'package:portfolio_pbn_api/src/model/update_service_request.dart';
import 'package:portfolio_pbn_api/src/model/update_testimonial_request.dart';
import 'package:portfolio_pbn_api/src/model/upload_sign_request.dart';
import 'package:portfolio_pbn_api/src/model/upload_sign_response.dart';
import 'package:portfolio_pbn_api/src/model/upsert_social_link_request.dart';

final _regList = RegExp(r'^List<(.*)>$');
final _regSet = RegExp(r'^Set<(.*)>$');
final _regMap = RegExp(r'^Map<String,(.*)>$');

  ReturnType deserialize<ReturnType, BaseType>(dynamic value, String targetType, {bool growable= true}) {
      switch (targetType) {
        case 'String':
          return '$value' as ReturnType;
        case 'int':
          return (value is int ? value : int.parse('$value')) as ReturnType;
        case 'bool':
          if (value is bool) {
            return value as ReturnType;
          }
          final valueString = '$value'.toLowerCase();
          return (valueString == 'true' || valueString == '1') as ReturnType;
        case 'double':
          return (value is double ? value : double.parse('$value')) as ReturnType;
        case 'AddGalleryImagesRequest':
          return AddGalleryImagesRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'AddGalleryImagesRequestImagesInner':
          return AddGalleryImagesRequestImagesInner.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'AddGalleryImagesResponse':
          return AddGalleryImagesResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'AdminProfile':
          return AdminProfile.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'AnalyticsOverview':
          return AnalyticsOverview.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'AppRelease':
          return AppRelease.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'Booking':
          return Booking.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'BookingList':
          return BookingList.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'CategoryDetail':
          return CategoryDetail.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'CategoryGalleryResponse':
          return CategoryGalleryResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'CategoryItem':
          return CategoryItem.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'CategoryList':
          return CategoryList.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'ContactDetail':
          return ContactDetail.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'ContactItem':
          return ContactItem.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'ContactList':
          return ContactList.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'CreateBookingRequest':
          return CreateBookingRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'CreateCategoryRequest':
          return CreateCategoryRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'CreateReleaseRequest':
          return CreateReleaseRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'CreateServiceRequest':
          return CreateServiceRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'CreateTestimonialRequest':
          return CreateTestimonialRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteCategoryResponse':
          return DeleteCategoryResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteContactResponse':
          return DeleteContactResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteGalleryImageRequest':
          return DeleteGalleryImageRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteGalleryImageResponse':
          return DeleteGalleryImageResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteReleaseResponse':
          return DeleteReleaseResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteResponse':
          return DeleteResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteServiceResponse':
          return DeleteServiceResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteSocialLinkRequest':
          return DeleteSocialLinkRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteSocialLinkResponse':
          return DeleteSocialLinkResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteTestimonialResponse':
          return DeleteTestimonialResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteUploadRequest':
          return DeleteUploadRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'DeleteUploadResponse':
          return DeleteUploadResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'Error':
          return Error.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'GalleryImage':
          return GalleryImage.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'LoginRequest':
          return LoginRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'LoginResponse':
          return LoginResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'LoginResponseUser':
          return LoginResponseUser.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'LogoutResponse':
          return LogoutResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'Pagination':
          return Pagination.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'PermanentDeleteTrashResponse':
          return PermanentDeleteTrashResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'PushRegisterRequest':
          return PushRegisterRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'PushRegisterResponse':
          return PushRegisterResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'PushUnregisterRequest':
          return PushUnregisterRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'PushUnregisterResponse':
          return PushUnregisterResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'RefreshResponse':
          return RefreshResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'ReorderGalleryRequest':
          return ReorderGalleryRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'ReorderGalleryResponse':
          return ReorderGalleryResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'RestoreTrashResponse':
          return RestoreTrashResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'ServiceDetail':
          return ServiceDetail.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'ServiceItem':
          return ServiceItem.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'ServiceList':
          return ServiceList.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'ServicePricingTier':
          return ServicePricingTier.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'SocialLink':
          return SocialLink.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'TestimonialDetail':
          return TestimonialDetail.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'TestimonialItem':
          return TestimonialItem.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'TestimonialList':
          return TestimonialList.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'ToggleFeaturedRequest':
          return ToggleFeaturedRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'TrashList':
          return TrashList.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'TrashListData':
          return TrashListData.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'UpdateBookingRequest':
          return UpdateBookingRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'UpdateCategoryRequest':
          return UpdateCategoryRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'UpdateContactRequest':
          return UpdateContactRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'UpdateMeRequest':
          return UpdateMeRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'UpdateMeResponse':
          return UpdateMeResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'UpdateServiceRequest':
          return UpdateServiceRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'UpdateTestimonialRequest':
          return UpdateTestimonialRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'UploadSignRequest':
          return UploadSignRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'UploadSignResponse':
          return UploadSignResponse.fromJson(value as Map<String, dynamic>) as ReturnType;
        case 'UpsertSocialLinkRequest':
          return UpsertSocialLinkRequest.fromJson(value as Map<String, dynamic>) as ReturnType;
        default:
          RegExpMatch? match;

          if (value is List && (match = _regList.firstMatch(targetType)) != null) {
            targetType = match![1]!; // ignore: parameter_assignments
            return value
              .map<BaseType>((dynamic v) => deserialize<BaseType, BaseType>(v, targetType, growable: growable))
              .toList(growable: growable) as ReturnType;
          }
          if (value is Set && (match = _regSet.firstMatch(targetType)) != null) {
            targetType = match![1]!; // ignore: parameter_assignments
            return value
              .map<BaseType>((dynamic v) => deserialize<BaseType, BaseType>(v, targetType, growable: growable))
              .toSet() as ReturnType;
          }
          if (value is Map && (match = _regMap.firstMatch(targetType)) != null) {
            targetType = match![1]!.trim(); // ignore: parameter_assignments
            return Map<String, BaseType>.fromIterables(
              value.keys as Iterable<String>,
              value.values.map((dynamic v) => deserialize<BaseType, BaseType>(v, targetType, growable: growable)),
            ) as ReturnType;
          }
          break;
    }
    throw Exception('Cannot deserialize');
  }