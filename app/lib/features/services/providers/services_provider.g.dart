// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'services_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(servicesList)
final servicesListProvider = ServicesListFamily._();

final class ServicesListProvider
    extends
        $FunctionalProvider<
          AsyncValue<PaginatedResponse<ServiceItem>>,
          PaginatedResponse<ServiceItem>,
          FutureOr<PaginatedResponse<ServiceItem>>
        >
    with
        $FutureModifier<PaginatedResponse<ServiceItem>>,
        $FutureProvider<PaginatedResponse<ServiceItem>> {
  ServicesListProvider._({
    required ServicesListFamily super.from,
    required ({int page, String? search, bool? isActive, bool? isFeatured})
    super.argument,
  }) : super(
         retry: null,
         name: r'servicesListProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$servicesListHash();

  @override
  String toString() {
    return r'servicesListProvider'
        ''
        '$argument';
  }

  @$internal
  @override
  $FutureProviderElement<PaginatedResponse<ServiceItem>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<PaginatedResponse<ServiceItem>> create(Ref ref) {
    final argument =
        this.argument
            as ({int page, String? search, bool? isActive, bool? isFeatured});
    return servicesList(
      ref,
      page: argument.page,
      search: argument.search,
      isActive: argument.isActive,
      isFeatured: argument.isFeatured,
    );
  }

  @override
  bool operator ==(Object other) {
    return other is ServicesListProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$servicesListHash() => r'b884a39485d130d1e32b418099db9955f2e060ac';

final class ServicesListFamily extends $Family
    with
        $FunctionalFamilyOverride<
          FutureOr<PaginatedResponse<ServiceItem>>,
          ({int page, String? search, bool? isActive, bool? isFeatured})
        > {
  ServicesListFamily._()
    : super(
        retry: null,
        name: r'servicesListProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  ServicesListProvider call({
    int page = 1,
    String? search,
    bool? isActive,
    bool? isFeatured,
  }) => ServicesListProvider._(
    argument: (
      page: page,
      search: search,
      isActive: isActive,
      isFeatured: isFeatured,
    ),
    from: this,
  );

  @override
  String toString() => r'servicesListProvider';
}

@ProviderFor(serviceDetail)
final serviceDetailProvider = ServiceDetailFamily._();

final class ServiceDetailProvider
    extends
        $FunctionalProvider<
          AsyncValue<ServiceDetail>,
          ServiceDetail,
          FutureOr<ServiceDetail>
        >
    with $FutureModifier<ServiceDetail>, $FutureProvider<ServiceDetail> {
  ServiceDetailProvider._({
    required ServiceDetailFamily super.from,
    required String super.argument,
  }) : super(
         retry: null,
         name: r'serviceDetailProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$serviceDetailHash();

  @override
  String toString() {
    return r'serviceDetailProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<ServiceDetail> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<ServiceDetail> create(Ref ref) {
    final argument = this.argument as String;
    return serviceDetail(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is ServiceDetailProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$serviceDetailHash() => r'cf1055346236d6862c77b146282568a1ca5f418c';

final class ServiceDetailFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<ServiceDetail>, String> {
  ServiceDetailFamily._()
    : super(
        retry: null,
        name: r'serviceDetailProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  ServiceDetailProvider call(String id) =>
      ServiceDetailProvider._(argument: id, from: this);

  @override
  String toString() => r'serviceDetailProvider';
}
