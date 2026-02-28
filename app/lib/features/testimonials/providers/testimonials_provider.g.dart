// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'testimonials_provider.dart';

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
        isAutoDispose: true,
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
    r'016a3202f34acbfaf728bd69f2bd807bc02fe661';

@ProviderFor(testimonialsList)
final testimonialsListProvider = TestimonialsListFamily._();

final class TestimonialsListProvider
    extends
        $FunctionalProvider<
          AsyncValue<PaginatedResponse<TestimonialItem>>,
          PaginatedResponse<TestimonialItem>,
          FutureOr<PaginatedResponse<TestimonialItem>>
        >
    with
        $FutureModifier<PaginatedResponse<TestimonialItem>>,
        $FutureProvider<PaginatedResponse<TestimonialItem>> {
  TestimonialsListProvider._({
    required TestimonialsListFamily super.from,
    required ({int page, String? search, String? status, bool? isFeatured})
    super.argument,
  }) : super(
         retry: null,
         name: r'testimonialsListProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$testimonialsListHash();

  @override
  String toString() {
    return r'testimonialsListProvider'
        ''
        '$argument';
  }

  @$internal
  @override
  $FutureProviderElement<PaginatedResponse<TestimonialItem>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<PaginatedResponse<TestimonialItem>> create(Ref ref) {
    final argument =
        this.argument
            as ({int page, String? search, String? status, bool? isFeatured});
    return testimonialsList(
      ref,
      page: argument.page,
      search: argument.search,
      status: argument.status,
      isFeatured: argument.isFeatured,
    );
  }

  @override
  bool operator ==(Object other) {
    return other is TestimonialsListProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$testimonialsListHash() => r'dfc32a75d54ac5627113561ef12258587b8c050f';

final class TestimonialsListFamily extends $Family
    with
        $FunctionalFamilyOverride<
          FutureOr<PaginatedResponse<TestimonialItem>>,
          ({int page, String? search, String? status, bool? isFeatured})
        > {
  TestimonialsListFamily._()
    : super(
        retry: null,
        name: r'testimonialsListProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  TestimonialsListProvider call({
    int page = 1,
    String? search,
    String? status,
    bool? isFeatured,
  }) => TestimonialsListProvider._(
    argument: (
      page: page,
      search: search,
      status: status,
      isFeatured: isFeatured,
    ),
    from: this,
  );

  @override
  String toString() => r'testimonialsListProvider';
}

@ProviderFor(testimonialDetail)
final testimonialDetailProvider = TestimonialDetailFamily._();

final class TestimonialDetailProvider
    extends
        $FunctionalProvider<
          AsyncValue<TestimonialDetail>,
          TestimonialDetail,
          FutureOr<TestimonialDetail>
        >
    with
        $FutureModifier<TestimonialDetail>,
        $FutureProvider<TestimonialDetail> {
  TestimonialDetailProvider._({
    required TestimonialDetailFamily super.from,
    required String super.argument,
  }) : super(
         retry: null,
         name: r'testimonialDetailProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$testimonialDetailHash();

  @override
  String toString() {
    return r'testimonialDetailProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<TestimonialDetail> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<TestimonialDetail> create(Ref ref) {
    final argument = this.argument as String;
    return testimonialDetail(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is TestimonialDetailProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$testimonialDetailHash() => r'28e06a9459a01de458f3bf8a15e630b5e73028e3';

final class TestimonialDetailFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<TestimonialDetail>, String> {
  TestimonialDetailFamily._()
    : super(
        retry: null,
        name: r'testimonialDetailProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  TestimonialDetailProvider call(String id) =>
      TestimonialDetailProvider._(argument: id, from: this);

  @override
  String toString() => r'testimonialDetailProvider';
}
