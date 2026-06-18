# portfolio_pbn_api.api.TrashApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**listTrash**](TrashApi.md#listtrash) | **GET** /api/admin/trash | Lista items en la papelera agrupados por tipo
[**permanentDeleteTrashItem**](TrashApi.md#permanentdeletetrashitem) | **DELETE** /api/admin/trash/{type}/{id} | Elimina permanentemente un item de la papelera
[**restoreTrashItem**](TrashApi.md#restoretrashitem) | **PATCH** /api/admin/trash/{type}/{id} | Restaura un item de la papelera


# **listTrash**
> TrashList listTrash(type)

Lista items en la papelera agrupados por tipo

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getTrashApi();
final String type = type_example; // String | Tipo de entidad en papelera

try {
    final response = api.listTrash(type);
    print(response);
} catch on DioException (e) {
    print('Exception when calling TrashApi->listTrash: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | **String**| Tipo de entidad en papelera | [optional] 

### Return type

[**TrashList**](TrashList.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **permanentDeleteTrashItem**
> PermanentDeleteTrashResponse permanentDeleteTrashItem(type, id)

Elimina permanentemente un item de la papelera

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getTrashApi();
final String type = type_example; // String | Tipo de entidad en papelera
final String id = id_example; // String | 

try {
    final response = api.permanentDeleteTrashItem(type, id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling TrashApi->permanentDeleteTrashItem: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | **String**| Tipo de entidad en papelera | 
 **id** | **String**|  | 

### Return type

[**PermanentDeleteTrashResponse**](PermanentDeleteTrashResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **restoreTrashItem**
> RestoreTrashResponse restoreTrashItem(type, id)

Restaura un item de la papelera

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getTrashApi();
final String type = type_example; // String | Tipo de entidad en papelera
final String id = id_example; // String | 

try {
    final response = api.restoreTrashItem(type, id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling TrashApi->restoreTrashItem: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | **String**| Tipo de entidad en papelera | 
 **id** | **String**|  | 

### Return type

[**RestoreTrashResponse**](RestoreTrashResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

