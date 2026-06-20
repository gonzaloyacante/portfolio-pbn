# portfolio_pbn_api.api.TestimonialsApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTestimonial**](TestimonialsApi.md#createtestimonial) | **POST** /api/admin/testimonials | Crea un testimonio
[**deleteTestimonial**](TestimonialsApi.md#deletetestimonial) | **DELETE** /api/admin/testimonials/{id} | Elimina un testimonio (soft delete)
[**getTestimonial**](TestimonialsApi.md#gettestimonial) | **GET** /api/admin/testimonials/{id} | Obtiene un testimonio por ID
[**listTestimonials**](TestimonialsApi.md#listtestimonials) | **GET** /api/admin/testimonials | Lista testimonios (admin)
[**updateTestimonial**](TestimonialsApi.md#updatetestimonial) | **PATCH** /api/admin/testimonials/{id} | Actualiza un testimonio


# **createTestimonial**
> TestimonialDetail createTestimonial(createTestimonialRequest)

Crea un testimonio

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getTestimonialsApi();
final CreateTestimonialRequest createTestimonialRequest = ; // CreateTestimonialRequest | 

try {
    final response = api.createTestimonial(createTestimonialRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling TestimonialsApi->createTestimonial: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createTestimonialRequest** | [**CreateTestimonialRequest**](CreateTestimonialRequest.md)|  | [optional] 

### Return type

[**TestimonialDetail**](TestimonialDetail.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteTestimonial**
> DeleteTestimonialResponse deleteTestimonial(id)

Elimina un testimonio (soft delete)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getTestimonialsApi();
final String id = id_example; // String | 

try {
    final response = api.deleteTestimonial(id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling TestimonialsApi->deleteTestimonial: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**DeleteTestimonialResponse**](DeleteTestimonialResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTestimonial**
> TestimonialDetail getTestimonial(id)

Obtiene un testimonio por ID

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getTestimonialsApi();
final String id = id_example; // String | 

try {
    final response = api.getTestimonial(id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling TestimonialsApi->getTestimonial: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**TestimonialDetail**](TestimonialDetail.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listTestimonials**
> TestimonialList listTestimonials(page, limit, search, status, featured, active)

Lista testimonios (admin)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getTestimonialsApi();
final num page = 8.14; // num | 
final num limit = 8.14; // num | 
final String search = search_example; // String | 
final String status = status_example; // String | 
final String featured = featured_example; // String | 
final String active = active_example; // String | 

try {
    final response = api.listTestimonials(page, limit, search, status, featured, active);
    print(response);
} catch on DioException (e) {
    print('Exception when calling TestimonialsApi->listTestimonials: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **num**|  | [optional] 
 **limit** | **num**|  | [optional] 
 **search** | **String**|  | [optional] 
 **status** | **String**|  | [optional] 
 **featured** | **String**|  | [optional] 
 **active** | **String**|  | [optional] 

### Return type

[**TestimonialList**](TestimonialList.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTestimonial**
> TestimonialDetail updateTestimonial(id, updateTestimonialRequest)

Actualiza un testimonio

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getTestimonialsApi();
final String id = id_example; // String | 
final UpdateTestimonialRequest updateTestimonialRequest = ; // UpdateTestimonialRequest | 

try {
    final response = api.updateTestimonial(id, updateTestimonialRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling TestimonialsApi->updateTestimonial: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateTestimonialRequest** | [**UpdateTestimonialRequest**](UpdateTestimonialRequest.md)|  | [optional] 

### Return type

[**TestimonialDetail**](TestimonialDetail.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

