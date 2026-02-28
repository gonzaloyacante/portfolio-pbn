// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'categories_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(categoriesList)
final categoriesListProvider = CategoriesListFamily._();

final class CategoriesListProvider
    extends
        $FunctionalProvider<
          AsyncValue<PaginatedResponse<CategoryItem>>,
          PaginatedResponse<CategoryItem>,
          FutureOr<PaginatedResponse<CategoryItem>>
        >
    with $FutureModifier<PaginatedResponse<CategoryItem>>, $FutureProvider<PaginatedResponse<CategoryItem>> {
  CategoriesListProvider._({
    required CategoriesListFamily super.from,
    required ({int page, String? search, bool? isActive}) super.argument,
  }) : super(
         retry: null,
         name: r'categoriesListProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$categoriesListHash();

  @override
  String toString() {
    return r'categoriesListProvider'
        ''
        '$argument';
  }

  @$internal
  @override
  $FutureProviderElement<PaginatedResponse<CategoryItem>> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<PaginatedResponse<CategoryItem>> create(Ref ref) {
    final argument = this.argument as ({int page, String? search, bool? isActive});
    return categoriesList(ref, page: argument.page, search: argument.search, isActive: argument.isActive);
  }

  @override
  bool operator ==(Object other) {
    return other is CategoriesListProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$categoriesListHash() => r'870928df3fabe9b0ed2255a8d1b5fd12ed7bd91c';

final class CategoriesListFamily extends $Family
    with
        $FunctionalFamilyOverride<
          FutureOr<PaginatedResponse<CategoryItem>>,
          ({int page, String? search, bool? isActive})
        > {
  CategoriesListFamily._()
    : super(
        retry: null,
        name: r'categoriesListProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  CategoriesListProvider call({int page = 1, String? search, bool? isActive}) =>
      CategoriesListProvider._(argument: (page: page, search: search, isActive: isActive), from: this);

  @override
  String toString() => r'categoriesListProvider';
}

@ProviderFor(categoryDetail)
final categoryDetailProvider = CategoryDetailFamily._();

final class CategoryDetailProvider
    extends $FunctionalProvider<AsyncValue<CategoryDetail>, CategoryDetail, FutureOr<CategoryDetail>>
    with $FutureModifier<CategoryDetail>, $FutureProvider<CategoryDetail> {
  CategoryDetailProvider._({required CategoryDetailFamily super.from, required String super.argument})
    : super(
        retry: null,
        name: r'categoryDetailProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$categoryDetailHash();

  @override
  String toString() {
    return r'categoryDetailProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<CategoryDetail> $createElement($ProviderPointer pointer) => $FutureProviderElement(pointer);

  @override
  FutureOr<CategoryDetail> create(Ref ref) {
    final argument = this.argument as String;
    return categoryDetail(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is CategoryDetailProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$categoryDetailHash() => r'429be3e222910125a614d7b5c5912a8c34bbcdd0';

final class CategoryDetailFamily extends $Family with $FunctionalFamilyOverride<FutureOr<CategoryDetail>, String> {
  CategoryDetailFamily._()
    : super(
        retry: null,
        name: r'categoryDetailProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  CategoryDetailProvider call(String id) => CategoryDetailProvider._(argument: id, from: this);

  @override
  String toString() => r'categoryDetailProvider';
}
