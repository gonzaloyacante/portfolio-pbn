// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contacts_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(contactsRepository)
final contactsRepositoryProvider = ContactsRepositoryProvider._();

final class ContactsRepositoryProvider
    extends
        $FunctionalProvider<
          ContactsRepository,
          ContactsRepository,
          ContactsRepository
        >
    with $Provider<ContactsRepository> {
  ContactsRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'contactsRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$contactsRepositoryHash();

  @$internal
  @override
  $ProviderElement<ContactsRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  ContactsRepository create(Ref ref) {
    return contactsRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ContactsRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ContactsRepository>(value),
    );
  }
}

String _$contactsRepositoryHash() =>
    r'e8a89bf5730b722b5ade5c86622df5a3852c14df';

@ProviderFor(contactsList)
final contactsListProvider = ContactsListFamily._();

final class ContactsListProvider
    extends
        $FunctionalProvider<
          AsyncValue<PaginatedResponse<ContactItem>>,
          PaginatedResponse<ContactItem>,
          FutureOr<PaginatedResponse<ContactItem>>
        >
    with
        $FutureModifier<PaginatedResponse<ContactItem>>,
        $FutureProvider<PaginatedResponse<ContactItem>> {
  ContactsListProvider._({
    required ContactsListFamily super.from,
    required ({
      int page,
      String? search,
      String? status,
      String? priority,
      bool? unreadOnly,
    })
    super.argument,
  }) : super(
         retry: null,
         name: r'contactsListProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$contactsListHash();

  @override
  String toString() {
    return r'contactsListProvider'
        ''
        '$argument';
  }

  @$internal
  @override
  $FutureProviderElement<PaginatedResponse<ContactItem>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<PaginatedResponse<ContactItem>> create(Ref ref) {
    final argument =
        this.argument
            as ({
              int page,
              String? search,
              String? status,
              String? priority,
              bool? unreadOnly,
            });
    return contactsList(
      ref,
      page: argument.page,
      search: argument.search,
      status: argument.status,
      priority: argument.priority,
      unreadOnly: argument.unreadOnly,
    );
  }

  @override
  bool operator ==(Object other) {
    return other is ContactsListProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$contactsListHash() => r'2bbc308f0eacca1bd87f526f2129d1c4468f3399';

final class ContactsListFamily extends $Family
    with
        $FunctionalFamilyOverride<
          FutureOr<PaginatedResponse<ContactItem>>,
          ({
            int page,
            String? search,
            String? status,
            String? priority,
            bool? unreadOnly,
          })
        > {
  ContactsListFamily._()
    : super(
        retry: null,
        name: r'contactsListProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  ContactsListProvider call({
    int page = 1,
    String? search,
    String? status,
    String? priority,
    bool? unreadOnly,
  }) => ContactsListProvider._(
    argument: (
      page: page,
      search: search,
      status: status,
      priority: priority,
      unreadOnly: unreadOnly,
    ),
    from: this,
  );

  @override
  String toString() => r'contactsListProvider';
}

@ProviderFor(contactDetail)
final contactDetailProvider = ContactDetailFamily._();

final class ContactDetailProvider
    extends
        $FunctionalProvider<
          AsyncValue<ContactDetail>,
          ContactDetail,
          FutureOr<ContactDetail>
        >
    with $FutureModifier<ContactDetail>, $FutureProvider<ContactDetail> {
  ContactDetailProvider._({
    required ContactDetailFamily super.from,
    required String super.argument,
  }) : super(
         retry: null,
         name: r'contactDetailProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$contactDetailHash();

  @override
  String toString() {
    return r'contactDetailProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<ContactDetail> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<ContactDetail> create(Ref ref) {
    final argument = this.argument as String;
    return contactDetail(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is ContactDetailProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$contactDetailHash() => r'e7a5f32d03ead5460d9ef02f9ba4317d24516a82';

final class ContactDetailFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<ContactDetail>, String> {
  ContactDetailFamily._()
    : super(
        retry: null,
        name: r'contactDetailProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  ContactDetailProvider call(String id) =>
      ContactDetailProvider._(argument: id, from: this);

  @override
  String toString() => r'contactDetailProvider';
}
