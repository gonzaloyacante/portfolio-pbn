# portfolio_pbn_api.api.CategoriesApi

## Load the API package
```dart
import 'package:portfolio_pbn_api/api.dart';
```

All URIs are relative to *https://portfoliopbn.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addGalleryImages**](CategoriesApi.md#addgalleryimages) | **POST** /api/admin/categories/{id}/gallery | Agrega imágenes a la galería de una categoría
[**createCategory**](CategoriesApi.md#createcategory) | **POST** /api/admin/categories | Crea una categoría
[**deleteCategory**](CategoriesApi.md#deletecategory) | **DELETE** /api/admin/categories/{id} | Elimina una categoría (soft delete)
[**deleteGalleryImage**](CategoriesApi.md#deletegalleryimage) | **DELETE** /api/admin/categories/{id}/gallery | Elimina una imagen de la galería
[**getCategory**](CategoriesApi.md#getcategory) | **GET** /api/admin/categories/{id} | Obtiene una categoría por ID
[**getCategoryGallery**](CategoriesApi.md#getcategorygallery) | **GET** /api/admin/categories/{id}/gallery | Obtiene imágenes de la galería de una categoría
[**listCategories**](CategoriesApi.md#listcategories) | **GET** /api/admin/categories | Lista categorías (admin)
[**reorderGallery**](CategoriesApi.md#reordergallery) | **PUT** /api/admin/categories/{id}/gallery | Actualiza el orden de la galería
[**toggleGalleryImageFeatured**](CategoriesApi.md#togglegalleryimagefeatured) | **PATCH** /api/admin/categories/{id}/gallery | Alterna isFeatured de una imagen de galería
[**updateCategory**](CategoriesApi.md#updatecategory) | **PATCH** /api/admin/categories/{id} | Actualiza una categoría


# **addGalleryImages**
> AddGalleryImagesResponse addGalleryImages(id, addGalleryImagesRequest)

Agrega imágenes a la galería de una categoría

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getCategoriesApi();
final String id = id_example; // String | 
final AddGalleryImagesRequest addGalleryImagesRequest = ; // AddGalleryImagesRequest | 

try {
    final response = api.addGalleryImages(id, addGalleryImagesRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling CategoriesApi->addGalleryImages: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **addGalleryImagesRequest** | [**AddGalleryImagesRequest**](AddGalleryImagesRequest.md)|  | [optional] 

### Return type

[**AddGalleryImagesResponse**](AddGalleryImagesResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createCategory**
> CategoryDetail createCategory(createCategoryRequest)

Crea una categoría

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getCategoriesApi();
final CreateCategoryRequest createCategoryRequest = ; // CreateCategoryRequest | 

try {
    final response = api.createCategory(createCategoryRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling CategoriesApi->createCategory: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createCategoryRequest** | [**CreateCategoryRequest**](CreateCategoryRequest.md)|  | [optional] 

### Return type

[**CategoryDetail**](CategoryDetail.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteCategory**
> DeleteCategoryResponse deleteCategory(id)

Elimina una categoría (soft delete)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getCategoriesApi();
final String id = id_example; // String | 

try {
    final response = api.deleteCategory(id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling CategoriesApi->deleteCategory: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**DeleteCategoryResponse**](DeleteCategoryResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteGalleryImage**
> DeleteGalleryImageResponse deleteGalleryImage(id, deleteGalleryImageRequest)

Elimina una imagen de la galería

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getCategoriesApi();
final String id = id_example; // String | 
final DeleteGalleryImageRequest deleteGalleryImageRequest = ; // DeleteGalleryImageRequest | 

try {
    final response = api.deleteGalleryImage(id, deleteGalleryImageRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling CategoriesApi->deleteGalleryImage: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **deleteGalleryImageRequest** | [**DeleteGalleryImageRequest**](DeleteGalleryImageRequest.md)|  | [optional] 

### Return type

[**DeleteGalleryImageResponse**](DeleteGalleryImageResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCategory**
> CategoryDetail getCategory(id)

Obtiene una categoría por ID

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getCategoriesApi();
final String id = id_example; // String | 

try {
    final response = api.getCategory(id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling CategoriesApi->getCategory: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**CategoryDetail**](CategoryDetail.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCategoryGallery**
> CategoryGalleryResponse getCategoryGallery(id)

Obtiene imágenes de la galería de una categoría

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getCategoriesApi();
final String id = id_example; // String | 

try {
    final response = api.getCategoryGallery(id);
    print(response);
} catch on DioException (e) {
    print('Exception when calling CategoriesApi->getCategoryGallery: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**CategoryGalleryResponse**](CategoryGalleryResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listCategories**
> CategoryList listCategories(page, limit, search, active)

Lista categorías (admin)

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getCategoriesApi();
final num page = 8.14; // num | 
final num limit = 8.14; // num | 
final String search = search_example; // String | 
final String active = active_example; // String | 

try {
    final response = api.listCategories(page, limit, search, active);
    print(response);
} catch on DioException (e) {
    print('Exception when calling CategoriesApi->listCategories: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **num**|  | [optional] 
 **limit** | **num**|  | [optional] 
 **search** | **String**|  | [optional] 
 **active** | **String**|  | [optional] 

### Return type

[**CategoryList**](CategoryList.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reorderGallery**
> ReorderGalleryResponse reorderGallery(id, reorderGalleryRequest)

Actualiza el orden de la galería

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getCategoriesApi();
final String id = id_example; // String | 
final ReorderGalleryRequest reorderGalleryRequest = ; // ReorderGalleryRequest | 

try {
    final response = api.reorderGallery(id, reorderGalleryRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling CategoriesApi->reorderGallery: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **reorderGalleryRequest** | [**ReorderGalleryRequest**](ReorderGalleryRequest.md)|  | [optional] 

### Return type

[**ReorderGalleryResponse**](ReorderGalleryResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **toggleGalleryImageFeatured**
> GalleryImage toggleGalleryImageFeatured(id, toggleFeaturedRequest)

Alterna isFeatured de una imagen de galería

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getCategoriesApi();
final String id = id_example; // String | 
final ToggleFeaturedRequest toggleFeaturedRequest = ; // ToggleFeaturedRequest | 

try {
    final response = api.toggleGalleryImageFeatured(id, toggleFeaturedRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling CategoriesApi->toggleGalleryImageFeatured: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **toggleFeaturedRequest** | [**ToggleFeaturedRequest**](ToggleFeaturedRequest.md)|  | [optional] 

### Return type

[**GalleryImage**](GalleryImage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateCategory**
> CategoryDetail updateCategory(id, updateCategoryRequest)

Actualiza una categoría

### Example
```dart
import 'package:portfolio_pbn_api/api.dart';

final api = PortfolioPbnApi().getCategoriesApi();
final String id = id_example; // String | 
final UpdateCategoryRequest updateCategoryRequest = ; // UpdateCategoryRequest | 

try {
    final response = api.updateCategory(id, updateCategoryRequest);
    print(response);
} catch on DioException (e) {
    print('Exception when calling CategoriesApi->updateCategory: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateCategoryRequest** | [**UpdateCategoryRequest**](UpdateCategoryRequest.md)|  | [optional] 

### Return type

[**CategoryDetail**](CategoryDetail.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

