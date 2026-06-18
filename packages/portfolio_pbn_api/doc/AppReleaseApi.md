# portfolio_pbn_api.api.AppReleaseApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createRelease**](AppReleaseApi.md#createrelease) | **POST** /api/admin/app/latest-release | Crea una nueva release
[**deleteRelease**](AppReleaseApi.md#deleterelease) | **POST** /api/admin/app/latest-release/delete | Elimina la release actual
[**getLatestRelease**](AppReleaseApi.md#getlatestrelease) | **GET** /api/admin/app/latest-release | Obtiene la última release de la app


# **createRelease**
> AppRelease createRelease(createReleaseRequest)

Crea una nueva release

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getAppReleaseApi();
final CreateReleaseRequest createReleaseRequest = ; // CreateReleaseRequest | 

try {
    final response = api.createRelease(createReleaseRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling AppReleaseApi->createRelease: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createReleaseRequest** | [**CreateReleaseRequest**](CreateReleaseRequest.md)|  | [optional] 

### Return type

[**AppRelease**](AppRelease.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteRelease**
> DeleteReleaseResponse deleteRelease()

Elimina la release actual

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getAppReleaseApi();

try {
    final response = api.deleteRelease();
    print(response);
} catch on DioException (e) {
    print('Exception when calling AppReleaseApi->deleteRelease: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**DeleteReleaseResponse**](DeleteReleaseResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLatestRelease**
> AppRelease getLatestRelease()

Obtiene la última release de la app

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getAppReleaseApi();

try {
    final response = api.getLatestRelease();
    print(response);
} catch on DioException (e) {
    print('Exception when calling AppReleaseApi->getLatestRelease: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**AppRelease**](AppRelease.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

