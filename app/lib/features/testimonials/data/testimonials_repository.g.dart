// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'testimonials_repository.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(testimonialsRepository)
final testimonialsRepositoryProvider = TestimonialsRepositoryProvider._();

final class TestimonialsRepositoryProvider
    extends
        $FunctionalProvider<
          TestimonialsRepository,
          TestimonialsRepository,
          TestimonialsRepository
        >
    with $Provider<TestimonialsRepository> {
  TestimonialsRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'testimonialsRepositoryProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$testimonialsRepositoryHash();

  @$internal
  @override
  $ProviderElement<TestimonialsRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  TestimonialsRepository create(Ref ref) {
    return testimonialsRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(TestimonialsRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<TestimonialsRepository>(value),
    );
  }
}

String _$testimonialsRepositoryHash() =>
    r'3c5427ac0c616d978640fc0c9f479b7ceca572bb';
