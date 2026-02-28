// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'settings_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(settingsRepository)
final settingsRepositoryProvider = SettingsRepositoryProvider._();

final class SettingsRepositoryProvider
    extends
        $FunctionalProvider<
          SettingsRepository,
          SettingsRepository,
          SettingsRepository
        >
    with $Provider<SettingsRepository> {
  SettingsRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'settingsRepositoryProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$settingsRepositoryHash();

  @$internal
  @override
  $ProviderElement<SettingsRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  SettingsRepository create(Ref ref) {
    return settingsRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SettingsRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<SettingsRepository>(value),
    );
  }
}

String _$settingsRepositoryHash() =>
    r'a4403698570087875b300af1c7388bb62d6f80fa';

@ProviderFor(aboutSettings)
final aboutSettingsProvider = AboutSettingsProvider._();

final class AboutSettingsProvider
    extends
        $FunctionalProvider<
          AsyncValue<AboutSettings>,
          AboutSettings,
          FutureOr<AboutSettings>
        >
    with $FutureModifier<AboutSettings>, $FutureProvider<AboutSettings> {
  AboutSettingsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'aboutSettingsProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$aboutSettingsHash();

  @$internal
  @override
  $FutureProviderElement<AboutSettings> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<AboutSettings> create(Ref ref) {
    return aboutSettings(ref);
  }
}

String _$aboutSettingsHash() => r'375d2e168c83755cdf59d821424a8a7f9d2a625a';

@ProviderFor(contactSettings)
final contactSettingsProvider = ContactSettingsProvider._();

final class ContactSettingsProvider
    extends
        $FunctionalProvider<
          AsyncValue<ContactSettings>,
          ContactSettings,
          FutureOr<ContactSettings>
        >
    with $FutureModifier<ContactSettings>, $FutureProvider<ContactSettings> {
  ContactSettingsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'contactSettingsProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$contactSettingsHash();

  @$internal
  @override
  $FutureProviderElement<ContactSettings> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<ContactSettings> create(Ref ref) {
    return contactSettings(ref);
  }
}

String _$contactSettingsHash() => r'bb741fe564b53d4cd0f89cd1c3000d668b33e797';

@ProviderFor(themeSettings)
final themeSettingsProvider = ThemeSettingsProvider._();

final class ThemeSettingsProvider
    extends
        $FunctionalProvider<
          AsyncValue<ThemeSettings>,
          ThemeSettings,
          FutureOr<ThemeSettings>
        >
    with $FutureModifier<ThemeSettings>, $FutureProvider<ThemeSettings> {
  ThemeSettingsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'themeSettingsProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$themeSettingsHash();

  @$internal
  @override
  $FutureProviderElement<ThemeSettings> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<ThemeSettings> create(Ref ref) {
    return themeSettings(ref);
  }
}

String _$themeSettingsHash() => r'fbc122f7b9e804b057f42a5be8b0973786bd8025';

@ProviderFor(siteSettings)
final siteSettingsProvider = SiteSettingsProvider._();

final class SiteSettingsProvider
    extends
        $FunctionalProvider<
          AsyncValue<SiteSettings>,
          SiteSettings,
          FutureOr<SiteSettings>
        >
    with $FutureModifier<SiteSettings>, $FutureProvider<SiteSettings> {
  SiteSettingsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'siteSettingsProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$siteSettingsHash();

  @$internal
  @override
  $FutureProviderElement<SiteSettings> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<SiteSettings> create(Ref ref) {
    return siteSettings(ref);
  }
}

String _$siteSettingsHash() => r'980c784eca419f07af980f3c9283e1f215981674';

@ProviderFor(socialLinks)
final socialLinksProvider = SocialLinksProvider._();

final class SocialLinksProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<SocialLink>>,
          List<SocialLink>,
          FutureOr<List<SocialLink>>
        >
    with $FutureModifier<List<SocialLink>>, $FutureProvider<List<SocialLink>> {
  SocialLinksProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'socialLinksProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$socialLinksHash();

  @$internal
  @override
  $FutureProviderElement<List<SocialLink>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<SocialLink>> create(Ref ref) {
    return socialLinks(ref);
  }
}

String _$socialLinksHash() => r'ad7883c97487b6203bf74e12ac95254be2b5427e';
