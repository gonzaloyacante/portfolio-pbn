# portfolio_pbn_api.api.BookingsApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createBooking**](BookingsApi.md#createbooking) | **POST** /api/admin/bookings | Crea una reserva (admin)
[**deleteBooking**](BookingsApi.md#deletebooking) | **DELETE** /api/admin/bookings/{id} | Elimina una reserva
[**getBooking**](BookingsApi.md#getbooking) | **GET** /api/admin/bookings/{id} | Obtiene una reserva por ID
[**listBookings**](BookingsApi.md#listbookings) | **GET** /api/admin/bookings | Lista reservas (admin)
[**updateBooking**](BookingsApi.md#updatebooking) | **PATCH** /api/admin/bookings/{id} | Actualiza una reserva


# **createBooking**
> Booking createBooking(createBookingRequest)

Crea una reserva (admin)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getBookingsApi();
final CreateBookingRequest createBookingRequest = ; // CreateBookingRequest | 

try {
    final response = api.createBooking(createBookingRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling BookingsApi->createBooking: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createBookingRequest** | [**CreateBookingRequest**](CreateBookingRequest.md)|  | [optional] 

### Return type

[**Booking**](Booking.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteBooking**
> DeleteResponse deleteBooking(id)

Elimina una reserva

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getBookingsApi();
final String id = id_example; // String | 

try {
    final response = api.deleteBooking(id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling BookingsApi->deleteBooking: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**DeleteResponse**](DeleteResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getBooking**
> Booking getBooking(id)

Obtiene una reserva por ID

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getBookingsApi();
final String id = id_example; // String | 

try {
    final response = api.getBooking(id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling BookingsApi->getBooking: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**Booking**](Booking.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listBookings**
> BookingList listBookings(status, page, limit)

Lista reservas (admin)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getBookingsApi();
final String status = status_example; // String | Estado de la reserva
final int page = 1; // int | 
final int limit = 20; // int | 

try {
    final response = api.listBookings(status, page, limit);
    print(response);
} catch on DioException (e) {
    print('Exception when calling BookingsApi->listBookings: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | **String**| Estado de la reserva | [optional] 
 **page** | **int**|  | [optional] 
 **limit** | **int**|  | [optional] 

### Return type

[**BookingList**](BookingList.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateBooking**
> Booking updateBooking(id, updateBookingRequest)

Actualiza una reserva

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getBookingsApi();
final String id = id_example; // String | 
final UpdateBookingRequest updateBookingRequest = ; // UpdateBookingRequest | 

try {
    final response = api.updateBooking(id, updateBookingRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling BookingsApi->updateBooking: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateBookingRequest** | [**UpdateBookingRequest**](UpdateBookingRequest.md)|  | [optional] 

### Return type

[**Booking**](Booking.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

