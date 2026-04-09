import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';

part 'settings_site_page_builders.dart';

class SettingsSitePage extends ConsumerStatefulWidget {
  const SettingsSitePage({super.key});

  @override
  ConsumerState<SettingsSitePage> createState() => _SettingsSitePageState();
}

class _SettingsSitePageState extends ConsumerState<SettingsSitePage> {
  bool _saving = false;
  bool _populated = false;
  bool _isDirty = false;

  final _siteNameCtrl = TextEditingController();
  final _siteTaglineCtrl = TextEditingController();
  final _metaTitleCtrl = TextEditingController();
  final _metaDescCtrl = TextEditingController();
  final _maintenanceMsgCtrl = TextEditingController();

  bool _maintenanceMode = false;
  bool _showAbout = true;
  bool _showGallery = true;
  bool _showServices = false;
  bool _showContact = true;

  // ── Encabezado / Navbar brand ──
  final _navbarBrandTextCtrl = TextEditingController();
  String? _navbarBrandFont;
  String? _navbarBrandFontUrl;
  final _navbarBrandFontSizeCtrl = TextEditingController();
  final _navbarBrandColorCtrl = TextEditingController();
  final _navbarBrandColorDarkCtrl = TextEditingController();
  bool _navbarShowBrand = true;

  @override
  void initState() {
    super.initState();
    for (final c in [
      _siteNameCtrl,
      _siteTaglineCtrl,
      _metaTitleCtrl,
      _metaDescCtrl,
      _maintenanceMsgCtrl,
      _navbarBrandTextCtrl,
      _navbarBrandFontSizeCtrl,
      _navbarBrandColorCtrl,
      _navbarBrandColorDarkCtrl,
    ]) {
      c.addListener(_markDirty);
    }
  }

  void _markDirty() {
    if (!_isDirty) setState(() => _isDirty = true);
  }

  Future<void> _maybeLeave(BuildContext context) async {
    if (!_isDirty) {
      context.pop();
      return;
    }
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => const ConfirmDialog(
        title: '¿Salir sin guardar?',
        message: 'Tienes cambios sin guardar.',
        confirmLabel: 'Salir',
        cancelLabel: 'Continuar editando',
      ),
    );
    if (confirmed == true && context.mounted) context.pop();
  }

  @override
  void dispose() {
    for (final c in [
      _siteNameCtrl,
      _siteTaglineCtrl,
      _metaTitleCtrl,
      _metaDescCtrl,
      _maintenanceMsgCtrl,
      _navbarBrandTextCtrl,
      _navbarBrandFontSizeCtrl,
      _navbarBrandColorCtrl,
      _navbarBrandColorDarkCtrl,
    ]) {
      c.removeListener(_markDirty);
      c.dispose();
    }
    super.dispose();
  }

  void _populate(SiteSettings s) {
    if (_populated) return;
    _populated = true;
    _siteNameCtrl.text = s.siteName;
    _siteTaglineCtrl.text = s.siteTagline ?? '';
    _metaTitleCtrl.text = s.defaultMetaTitle ?? '';
    _metaDescCtrl.text = s.defaultMetaDescription ?? '';
    _maintenanceMsgCtrl.text = s.maintenanceMessage ?? '';
    _maintenanceMode = s.maintenanceMode;
    _showAbout = s.showAboutPage;
    _showGallery = s.showGalleryPage;
    _showServices = s.showServicesPage;
    _showContact = s.showContactPage;
    _navbarShowBrand = s.navbarShowBrand;
    _navbarBrandTextCtrl.text = s.navbarBrandText ?? '';
    _navbarBrandFont = s.navbarBrandFont;
    _navbarBrandFontUrl = s.navbarBrandFontUrl;
    _navbarBrandFontSizeCtrl.text = s.navbarBrandFontSize != null
        ? s.navbarBrandFontSize.toString()
        : '30';
    _navbarBrandColorCtrl.text = s.navbarBrandColor ?? '';
    _navbarBrandColorDarkCtrl.text = s.navbarBrandColorDark ?? '';
  }

  String? _nullIfEmpty(String v) => v.trim().isEmpty ? null : v.trim();

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      await ref.read(settingsRepositoryProvider).updateSite({
        'siteName': _siteNameCtrl.text.trim(),
        'siteTagline': _nullIfEmpty(_siteTaglineCtrl.text),
        'defaultMetaTitle': _nullIfEmpty(_metaTitleCtrl.text),
        'defaultMetaDescription': _nullIfEmpty(_metaDescCtrl.text),
        'maintenanceMode': _maintenanceMode,
        'maintenanceMessage': _nullIfEmpty(_maintenanceMsgCtrl.text),
        'showAboutPage': _showAbout,
        'showGalleryPage': _showGallery,
        'showServicesPage': _showServices,
        'showContactPage': _showContact,
        'navbarShowBrand': _navbarShowBrand,
        'navbarBrandText': _nullIfEmpty(_navbarBrandTextCtrl.text),
        'navbarBrandFont': _navbarBrandFont?.trim().isEmpty ?? true
            ? null
            : _navbarBrandFont,
        'navbarBrandFontUrl': _navbarBrandFontUrl?.trim().isEmpty ?? true
            ? null
            : _navbarBrandFontUrl,
        'navbarBrandFontSize': _navbarBrandFontSizeCtrl.text.trim().isNotEmpty
            ? int.tryParse(_navbarBrandFontSizeCtrl.text.trim())
            : null,
        'navbarBrandColor': _nullIfEmpty(_navbarBrandColorCtrl.text),
        'navbarBrandColorDark': _nullIfEmpty(_navbarBrandColorDarkCtrl.text),
      });
      ref.invalidate(siteSettingsProvider);
      if (mounted) {
        setState(() => _isDirty = false);
        AppSnackBar.success(context, 'Configuración guardada');
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        AppSnackBar.error(
          context,
          'No se pudo guardar la configuración. Inténtalo de nuevo.',
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(siteSettingsProvider);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, dynamic result) =>
          _maybeLeave(context),
      child: AppScaffold(
        title: 'Sitio Web',
        actions: [
          IconButton(
            icon: const Icon(Icons.save_outlined),
            tooltip: 'Guardar',
            onPressed: _save,
          ),
        ],
        body: LoadingOverlay(
          isLoading: _saving,
          child: async.when(
            loading: () =>
                const SkeletonSettingsPage(cardCount: 4, fieldsPerCard: 3),
            error: (e, _) => ErrorState(
              message: e.toString(),
              onRetry: () => ref.invalidate(siteSettingsProvider),
            ),
            data: (settings) {
              _populate(settings);
              return RefreshIndicator(
                onRefresh: () async {
                  ref.invalidate(siteSettingsProvider);
                  await ref.read(siteSettingsProvider.future);
                },
                child: _buildForm(context),
              );
            },
          ),
        ),
      ),
    );
  }
}
