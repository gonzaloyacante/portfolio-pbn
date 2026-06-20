# portfolio_pbn_api.api.AnalyticsApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAnalyticsOverview**](AnalyticsApi.md#getanalyticsoverview) | **GET** /api/admin/analytics/overview | Resumen del dashboard (contadores operativos)


# **getAnalyticsOverview**
> AnalyticsOverview getAnalyticsOverview()

Resumen del dashboard (contadores operativos)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getAnalyticsApi();

try {
    final response = api.getAnalyticsOverview();
    print(response);
} catch on DioException (e) {
    print('Exception when calling AnalyticsApi->getAnalyticsOverview: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**AnalyticsOverview**](AnalyticsOverview.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

