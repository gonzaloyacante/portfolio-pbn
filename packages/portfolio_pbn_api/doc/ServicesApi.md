# portfolio_pbn_api.api.ServicesApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createService**](ServicesApi.md#createservice) | **POST** /api/admin/services | Crea un servicio
[**deleteService**](ServicesApi.md#deleteservice) | **DELETE** /api/admin/services/{id} | Elimina un servicio (soft delete)
[**getService**](ServicesApi.md#getservice) | **GET** /api/admin/services/{id} | Obtiene un servicio por ID
[**listServices**](ServicesApi.md#listservices) | **GET** /api/admin/services | Lista servicios (admin)
[**updateService**](ServicesApi.md#updateservice) | **PATCH** /api/admin/services/{id} | Actualiza un servicio


# **createService**
> ServiceDetail createService(createServiceRequest)

Crea un servicio

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getServicesApi();
final CreateServiceRequest createServiceRequest = ; // CreateServiceRequest | 

try {
    final response = api.createService(createServiceRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling ServicesApi->createService: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createServiceRequest** | [**CreateServiceRequest**](CreateServiceRequest.md)|  | [optional] 

### Return type

[**ServiceDetail**](ServiceDetail.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteService**
> DeleteServiceResponse deleteService(id)

Elimina un servicio (soft delete)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getServicesApi();
final String id = id_example; // String | 

try {
    final response = api.deleteService(id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling ServicesApi->deleteService: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**DeleteServiceResponse**](DeleteServiceResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getService**
> ServiceDetail getService(id)

Obtiene un servicio por ID

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getServicesApi();
final String id = id_example; // String | 

try {
    final response = api.getService(id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling ServicesApi->getService: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**ServiceDetail**](ServiceDetail.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listServices**
> ServiceList listServices(page, limit, search, active, featured)

Lista servicios (admin)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getServicesApi();
final num page = 8.14; // num | 
final num limit = 8.14; // num | 
final String search = search_example; // String | 
final String active = active_example; // String | 
final String featured = featured_example; // String | 

try {
    final response = api.listServices(page, limit, search, active, featured);
    print(response);
} catch on DioException (e) {
    print('Exception when calling ServicesApi->listServices: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **num**|  | [optional] 
 **limit** | **num**|  | [optional] 
 **search** | **String**|  | [optional] 
 **active** | **String**|  | [optional] 
 **featured** | **String**|  | [optional] 

### Return type

[**ServiceList**](ServiceList.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateService**
> ServiceDetail updateService(id, updateServiceRequest)

Actualiza un servicio

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getServicesApi();
final String id = id_example; // String | 
final UpdateServiceRequest updateServiceRequest = ; // UpdateServiceRequest | 

try {
    final response = api.updateService(id, updateServiceRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling ServicesApi->updateService: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateServiceRequest** | [**UpdateServiceRequest**](UpdateServiceRequest.md)|  | [optional] 

### Return type

[**ServiceDetail**](ServiceDetail.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

