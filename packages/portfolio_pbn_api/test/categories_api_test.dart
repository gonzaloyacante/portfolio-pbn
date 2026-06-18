import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for CategoriesApi
void main() {
  final instance = PortfolioPbnApi().getCategoriesApi();

  group(CategoriesApi, () {
    // Agrega imágenes a la galería de una categoría
    //
    //Future<AddGalleryImagesResponse> addGalleryImages(String id, { AddGalleryImagesRequest addGalleryImagesRequest }) async
    test('test addGalleryImages', () async {
      // TODO
    });

    // Crea una categoría
    //
    //Future<CategoryDetail> createCategory({ CreateCategoryRequest createCategoryRequest }) async
    test('test createCategory', () async {
      // TODO
    });

    // Elimina una categoría (soft delete)
    //
    //Future<DeleteCategoryResponse> deleteCategory(String id) async
    test('test deleteCategory', () async {
      // TODO
    });

    // Elimina una imagen de la galería
    //
    //Future<DeleteGalleryImageResponse> deleteGalleryImage(String id, { DeleteGalleryImageRequest deleteGalleryImageRequest }) async
    test('test deleteGalleryImage', () async {
      // TODO
    });

    // Obtiene una categoría por ID
    //
    //Future<CategoryDetail> getCategory(String id) async
    test('test getCategory', () async {
      // TODO
    });

    // Obtiene imágenes de la galería de una categoría
    //
    //Future<CategoryGalleryResponse> getCategoryGallery(String id) async
    test('test getCategoryGallery', () async {
      // TODO
    });

    // Lista categorías (admin)
    //
    //Future<CategoryList> listCategories({ num page, num limit, String search, String active }) async
    test('test listCategories', () async {
      // TODO
    });

    // Actualiza el orden de la galería
    //
    //Future<ReorderGalleryResponse> reorderGallery(String id, { ReorderGalleryRequest reorderGalleryRequest }) async
    test('test reorderGallery', () async {
      // TODO
    });

    // Alterna isFeatured de una imagen de galería
    //
    //Future<GalleryImage> toggleGalleryImageFeatured(String id, { ToggleFeaturedRequest toggleFeaturedRequest }) async
    test('test toggleGalleryImageFeatured', () async {
      // TODO
    });

    // Actualiza una categoría
    //
    //Future<CategoryDetail> updateCategory(String id, { UpdateCategoryRequest updateCategoryRequest }) async
    test('test updateCategory', () async {
      // TODO
    });

  });
}
