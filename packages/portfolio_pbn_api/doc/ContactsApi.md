# portfolio_pbn_api.api.ContactsApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteContact**](ContactsApi.md#deletecontact) | **DELETE** /api/admin/contacts/{id} | Elimina un contacto (soft delete)
[**getContact**](ContactsApi.md#getcontact) | **GET** /api/admin/contacts/{id} | Obtiene un contacto por ID (marca como leído)
[**listContacts**](ContactsApi.md#listcontacts) | **GET** /api/admin/contacts | Lista contactos (admin)
[**updateContact**](ContactsApi.md#updatecontact) | **PATCH** /api/admin/contacts/{id} | Actualiza un contacto


# **deleteContact**
> DeleteContactResponse deleteContact(id)

Elimina un contacto (soft delete)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getContactsApi();
final String id = id_example; // String | 

try {
    final response = api.deleteContact(id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling ContactsApi->deleteContact: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**DeleteContactResponse**](DeleteContactResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getContact**
> ContactDetail getContact(id)

Obtiene un contacto por ID (marca como leído)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getContactsApi();
final String id = id_example; // String | 

try {
    final response = api.getContact(id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling ContactsApi->getContact: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**ContactDetail**](ContactDetail.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listContacts**
> ContactList listContacts(page, limit, search, status, isRead)

Lista contactos (admin)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getContactsApi();
final num page = 8.14; // num | 
final num limit = 8.14; // num | 
final String search = search_example; // String | 
final String status = status_example; // String | 
final String isRead = isRead_example; // String | 

try {
    final response = api.listContacts(page, limit, search, status, isRead);
    print(response);
} catch on DioException (e) {
    print('Exception when calling ContactsApi->listContacts: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **num**|  | [optional] 
 **limit** | **num**|  | [optional] 
 **search** | **String**|  | [optional] 
 **status** | **String**|  | [optional] 
 **isRead** | **String**|  | [optional] 

### Return type

[**ContactList**](ContactList.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateContact**
> ContactDetail updateContact(id, updateContactRequest)

Actualiza un contacto

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getContactsApi();
final String id = id_example; // String | 
final UpdateContactRequest updateContactRequest = ; // UpdateContactRequest | 

try {
    final response = api.updateContact(id, updateContactRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling ContactsApi->updateContact: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateContactRequest** | [**UpdateContactRequest**](UpdateContactRequest.md)|  | [optional] 

### Return type

[**ContactDetail**](ContactDetail.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

