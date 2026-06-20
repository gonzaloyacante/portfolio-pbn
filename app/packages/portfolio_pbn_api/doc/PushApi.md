# portfolio_pbn_api.api.PushApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**registerPushToken**](PushApi.md#registerpushtoken) | **POST** /api/admin/push/register | Registra token FCM para push notifications
[**unregisterPushToken**](PushApi.md#unregisterpushtoken) | **POST** /api/admin/push/unregister | Elimina token FCM


# **registerPushToken**
> PushRegisterResponse registerPushToken(pushRegisterRequest)

Registra token FCM para push notifications

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getPushApi();
final PushRegisterRequest pushRegisterRequest = ; // PushRegisterRequest | 

try {
    final response = api.registerPushToken(pushRegisterRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling PushApi->registerPushToken: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pushRegisterRequest** | [**PushRegisterRequest**](PushRegisterRequest.md)|  | [optional] 

### Return type

[**PushRegisterResponse**](PushRegisterResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **unregisterPushToken**
> PushUnregisterResponse unregisterPushToken(pushUnregisterRequest)

Elimina token FCM

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getPushApi();
final PushUnregisterRequest pushUnregisterRequest = ; // PushUnregisterRequest | 

try {
    final response = api.unregisterPushToken(pushUnregisterRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling PushApi->unregisterPushToken: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pushUnregisterRequest** | [**PushUnregisterRequest**](PushUnregisterRequest.md)|  | [optional] 

### Return type

[**PushUnregisterResponse**](PushUnregisterResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

