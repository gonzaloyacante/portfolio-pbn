// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'categories_repository.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(categoriesRepository)
final categoriesRepositoryProvider = CategoriesRepositoryProvider._();

final class CategoriesRepositoryProvider
    extends
        $FunctionalProvider<
          CategoriesRepository,
          CategoriesRepository,
          CategoriesRepository
        >
    with $Provider<CategoriesRepository> {
  CategoriesRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'categoriesRepositoryProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$categoriesRepositoryHash();

  @$internal
  @override
  $ProviderElement<CategoriesRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  CategoriesRepository create(Ref ref) {
    return categoriesRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(CategoriesRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<CategoriesRepository>(value),
    );
  }
}

String _$categoriesRepositoryHash() =>
    r'1dc537896babbdea1d7d1c9f77f283a21036d2ee';
