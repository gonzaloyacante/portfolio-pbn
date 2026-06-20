# portfolio_pbn_api.api.UploadApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteUploadedAsset**](UploadApi.md#deleteuploadedasset) | **DELETE** /api/admin/upload | Elimina un asset de Cloudinary por publicId
[**getUploadSignature**](UploadApi.md#getuploadsignature) | **POST** /api/admin/upload/sign | Genera una firma Cloudinary para subida directa


# **deleteUploadedAsset**
> DeleteUploadResponse deleteUploadedAsset(deleteUploadRequest)

Elimina un asset de Cloudinary por publicId

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getUploadApi();
final DeleteUploadRequest deleteUploadRequest = ; // DeleteUploadRequest | 

try {
    final response = api.deleteUploadedAsset(deleteUploadRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling UploadApi->deleteUploadedAsset: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteUploadRequest** | [**DeleteUploadRequest**](DeleteUploadRequest.md)|  | [optional] 

### Return type

[**DeleteUploadResponse**](DeleteUploadResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUploadSignature**
> UploadSignResponse getUploadSignature(uploadSignRequest)

Genera una firma Cloudinary para subida directa

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getUploadApi();
final UploadSignRequest uploadSignRequest = ; // UploadSignRequest | 

try {
    final response = api.getUploadSignature(uploadSignRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling UploadApi->getUploadSignature: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uploadSignRequest** | [**UploadSignRequest**](UploadSignRequest.md)|  | [optional] 

### Return type

[**UploadSignResponse**](UploadSignResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

