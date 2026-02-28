// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'calendar_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(bookingsRepository)
final bookingsRepositoryProvider = BookingsRepositoryProvider._();

final class BookingsRepositoryProvider
    extends
        $FunctionalProvider<
          BookingsRepository,
          BookingsRepository,
          BookingsRepository
        >
    with $Provider<BookingsRepository> {
  BookingsRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'bookingsRepositoryProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$bookingsRepositoryHash();

  @$internal
  @override
  $ProviderElement<BookingsRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  BookingsRepository create(Ref ref) {
    return bookingsRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(BookingsRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<BookingsRepository>(value),
    );
  }
}

String _$bookingsRepositoryHash() =>
    r'8b9622825bb1ead202d7555fe023dddb7c8075fe';

@ProviderFor(bookingsList)
final bookingsListProvider = BookingsListFamily._();

final class BookingsListProvider
    extends
        $FunctionalProvider<
          AsyncValue<PaginatedResponse<BookingItem>>,
          PaginatedResponse<BookingItem>,
          FutureOr<PaginatedResponse<BookingItem>>
        >
    with
        $FutureModifier<PaginatedResponse<BookingItem>>,
        $FutureProvider<PaginatedResponse<BookingItem>> {
  BookingsListProvider._({
    required BookingsListFamily super.from,
    required ({
      int page,
      String? search,
      String? status,
      DateTime? dateFrom,
      DateTime? dateTo,
    })
    super.argument,
  }) : super(
         retry: null,
         name: r'bookingsListProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$bookingsListHash();

  @override
  String toString() {
    return r'bookingsListProvider'
        ''
        '$argument';
  }

  @$internal
  @override
  $FutureProviderElement<PaginatedResponse<BookingItem>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<PaginatedResponse<BookingItem>> create(Ref ref) {
    final argument =
        this.argument
            as ({
              int page,
              String? search,
              String? status,
              DateTime? dateFrom,
              DateTime? dateTo,
            });
    return bookingsList(
      ref,
      page: argument.page,
      search: argument.search,
      status: argument.status,
      dateFrom: argument.dateFrom,
      dateTo: argument.dateTo,
    );
  }

  @override
  bool operator ==(Object other) {
    return other is BookingsListProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$bookingsListHash() => r'49cce804ca833baba65648e57c4f5f1cb0005441';

final class BookingsListFamily extends $Family
    with
        $FunctionalFamilyOverride<
          FutureOr<PaginatedResponse<BookingItem>>,
          ({
            int page,
            String? search,
            String? status,
            DateTime? dateFrom,
            DateTime? dateTo,
          })
        > {
  BookingsListFamily._()
    : super(
        retry: null,
        name: r'bookingsListProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  BookingsListProvider call({
    int page = 1,
    String? search,
    String? status,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) => BookingsListProvider._(
    argument: (
      page: page,
      search: search,
      status: status,
      dateFrom: dateFrom,
      dateTo: dateTo,
    ),
    from: this,
  );

  @override
  String toString() => r'bookingsListProvider';
}

@ProviderFor(bookingDetail)
final bookingDetailProvider = BookingDetailFamily._();

final class BookingDetailProvider
    extends
        $FunctionalProvider<
          AsyncValue<BookingDetail>,
          BookingDetail,
          FutureOr<BookingDetail>
        >
    with $FutureModifier<BookingDetail>, $FutureProvider<BookingDetail> {
  BookingDetailProvider._({
    required BookingDetailFamily super.from,
    required String super.argument,
  }) : super(
         retry: null,
         name: r'bookingDetailProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$bookingDetailHash();

  @override
  String toString() {
    return r'bookingDetailProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<BookingDetail> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<BookingDetail> create(Ref ref) {
    final argument = this.argument as String;
    return bookingDetail(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is BookingDetailProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$bookingDetailHash() => r'427c9cf47bb2d185e527df98567628261f4a16b3';

final class BookingDetailFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<BookingDetail>, String> {
  BookingDetailFamily._()
    : super(
        retry: null,
        name: r'bookingDetailProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  BookingDetailProvider call(String id) =>
      BookingDetailProvider._(argument: id, from: this);

  @override
  String toString() => r'bookingDetailProvider';
}
