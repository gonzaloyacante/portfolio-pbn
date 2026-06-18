# portfolio_pbn_api.api.AuthApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**adminGetMe**](AuthApi.md#admingetme) | **GET** /api/admin/auth/me | Obtiene perfil del admin autenticado
[**adminLogin**](AuthApi.md#adminlogin) | **POST** /api/admin/auth/login | Admin login
[**adminLogout**](AuthApi.md#adminlogout) | **POST** /api/admin/auth/logout | Admin logout — clears httpOnly cookie
[**adminRefreshToken**](AuthApi.md#adminrefreshtoken) | **POST** /api/admin/auth/refresh | Refresca access token via httpOnly refresh cookie
[**adminUpdateMe**](AuthApi.md#adminupdateme) | **PATCH** /api/admin/auth/me | Actualiza nombre o contraseña del admin


# **adminGetMe**
> AdminProfile adminGetMe()

Obtiene perfil del admin autenticado

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getAuthApi();

try {
    final response = api.adminGetMe();
    print(response);
} catch on DioException (e) {
    print('Exception when calling AuthApi->adminGetMe: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**AdminProfile**](AdminProfile.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminLogin**
> LoginResponse adminLogin(loginRequest)

Admin login

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getAuthApi();
final LoginRequest loginRequest = ; // LoginRequest | 

try {
    final response = api.adminLogin(loginRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling AuthApi->adminLogin: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginRequest** | [**LoginRequest**](LoginRequest.md)|  | [optional] 

### Return type

[**LoginResponse**](LoginResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminLogout**
> LogoutResponse adminLogout()

Admin logout — clears httpOnly cookie

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getAuthApi();

try {
    final response = api.adminLogout();
    print(response);
} catch on DioException (e) {
    print('Exception when calling AuthApi->adminLogout: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**LogoutResponse**](LogoutResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminRefreshToken**
> RefreshResponse adminRefreshToken()

Refresca access token via httpOnly refresh cookie

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getAuthApi();

try {
    final response = api.adminRefreshToken();
    print(response);
} catch on DioException (e) {
    print('Exception when calling AuthApi->adminRefreshToken: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**RefreshResponse**](RefreshResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminUpdateMe**
> UpdateMeResponse adminUpdateMe(updateMeRequest)

Actualiza nombre o contraseña del admin

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getAuthApi();
final UpdateMeRequest updateMeRequest = ; // UpdateMeRequest | 

try {
    final response = api.adminUpdateMe(updateMeRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling AuthApi->adminUpdateMe: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateMeRequest** | [**UpdateMeRequest**](UpdateMeRequest.md)|  | [optional] 

### Return type

[**UpdateMeResponse**](UpdateMeResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

