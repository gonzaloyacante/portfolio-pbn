# portfolio_pbn_api.api.SettingsApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteSocialLink**](SettingsApi.md#deletesociallink) | **DELETE** /api/admin/settings/social | Elimina una red social por id o platform
[**getSettings**](SettingsApi.md#getsettings) | **GET** /api/admin/settings/{type} | Obtiene la configuración de un tipo (singleton)
[**listSocialLinks**](SettingsApi.md#listsociallinks) | **GET** /api/admin/settings/social | Lista redes sociales configuradas
[**updateSettings**](SettingsApi.md#updatesettings) | **PATCH** /api/admin/settings/{type} | Actualiza la configuración de un tipo
[**upsertSocialLink**](SettingsApi.md#upsertsociallink) | **POST** /api/admin/settings/social | Crea o actualiza una red social (upsert por platform)


# **deleteSocialLink**
> DeleteSocialLinkResponse deleteSocialLink(deleteSocialLinkRequest)

Elimina una red social por id o platform

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getSettingsApi();
final DeleteSocialLinkRequest deleteSocialLinkRequest = ; // DeleteSocialLinkRequest | 

try {
    final response = api.deleteSocialLink(deleteSocialLinkRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling SettingsApi->deleteSocialLink: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteSocialLinkRequest** | [**DeleteSocialLinkRequest**](DeleteSocialLinkRequest.md)|  | [optional] 

### Return type

[**DeleteSocialLinkResponse**](DeleteSocialLinkResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSettings**
> Map<String, Object> getSettings(type)

Obtiene la configuración de un tipo (singleton)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getSettingsApi();
final String type = type_example; // String | Tipo de configuración

try {
    final response = api.getSettings(type);
    print(response);
} catch on DioException (e) {
    print('Exception when calling SettingsApi->getSettings: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | **String**| Tipo de configuración | 

### Return type

**Map&lt;String, Object&gt;**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listSocialLinks**
> List<SocialLink> listSocialLinks()

Lista redes sociales configuradas

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getSettingsApi();

try {
    final response = api.listSocialLinks();
    print(response);
} catch on DioException (e) {
    print('Exception when calling SettingsApi->listSocialLinks: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List&lt;SocialLink&gt;**](SocialLink.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateSettings**
> Map<String, Object> updateSettings(type, requestBody)

Actualiza la configuración de un tipo

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getSettingsApi();
final String type = type_example; // String | Tipo de configuración
final Map<String, Object> requestBody = Object; // Map<String, Object> | 

try {
    final response = api.updateSettings(type, requestBody);
    print(response);
} catch on DioException (e) {
    print('Exception when calling SettingsApi->updateSettings: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | **String**| Tipo de configuración | 
 **requestBody** | [**Map&lt;String, Object&gt;**](Object.md)|  | [optional] 

### Return type

**Map&lt;String, Object&gt;**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **upsertSocialLink**
> SocialLink upsertSocialLink(upsertSocialLinkRequest)

Crea o actualiza una red social (upsert por platform)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getSettingsApi();
final UpsertSocialLinkRequest upsertSocialLinkRequest = ; // UpsertSocialLinkRequest | 

try {
    final response = api.upsertSocialLink(upsertSocialLinkRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling SettingsApi->upsertSocialLink: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **upsertSocialLinkRequest** | [**UpsertSocialLinkRequest**](UpsertSocialLinkRequest.md)|  | [optional] 

### Return type

[**SocialLink**](SocialLink.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

