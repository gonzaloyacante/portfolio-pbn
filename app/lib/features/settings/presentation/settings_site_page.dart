import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';

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
  final _navbarBrandFontCtrl = TextEditingController();
  final _navbarBrandFontUrlCtrl = TextEditingController();
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
      _navbarBrandFontCtrl,
      _navbarBrandFontUrlCtrl,
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
      _navbarBrandFontCtrl,
      _navbarBrandFontUrlCtrl,
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
    _navbarBrandFontCtrl.text = s.navbarBrandFont ?? '';
    _navbarBrandFontUrlCtrl.text = s.navbarBrandFontUrl ?? '';
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
        'navbarBrandFont': _nullIfEmpty(_navbarBrandFontCtrl.text),
        'navbarBrandFontUrl': _nullIfEmpty(_navbarBrandFontUrlCtrl.text),
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
              return _buildForm(context);
            },
          ),
        ),
      ),
    );
  }

  List<Widget> _navbarBrandFields() {
    return [
      const SizedBox(height: 12),
      TextFormField(
        controller: _navbarBrandTextCtrl,
        decoration: const InputDecoration(
          labelText: 'Texto del nombre',
          hintText: 'Paola BN',
        ),
      ),
      const SizedBox(height: 12),
      Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: TextFormField(
              controller: _navbarBrandFontCtrl,
              decoration: const InputDecoration(
                labelText: 'Fuente (nombre)',
                hintText: 'Great Vibes',
              ),
            ),
          ),
          const SizedBox(width: 12),
          SizedBox(
            width: 90,
            child: TextFormField(
              controller: _navbarBrandFontSizeCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Tamaño (px)',
                hintText: '30',
              ),
            ),
          ),
        ],
      ),
      const SizedBox(height: 12),
      TextFormField(
        controller: _navbarBrandFontUrlCtrl,
        decoration: const InputDecoration(
          labelText: 'URL Google Fonts',
          hintText:
              'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
        ),
      ),
      const SizedBox(height: 12),
      Row(
        children: [
          Expanded(
            child: TextFormField(
              controller: _navbarBrandColorCtrl,
              decoration: const InputDecoration(
                labelText: 'Color claro',
                hintText: '#1a050a',
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: TextFormField(
              controller: _navbarBrandColorDarkCtrl,
              decoration: const InputDecoration(
                labelText: 'Color oscuro',
                hintText: '#fb7185',
              ),
            ),
          ),
        ],
      ),
    ];
  }

  Widget _buildForm(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    final maxWidth = AppBreakpoints.value<double>(
      context,
      compact: double.infinity,
      medium: 760,
      expanded: 960,
    );

    return SingleChildScrollView(
      padding: padding,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ── Encabezado ───────────────────────────────────────────────────
              SettingsFormCard(
                title: 'Encabezado',
                children: [
                  SwitchListTile(
                    title: const Text('Mostrar nombre en navbar'),
                    subtitle: const Text(
                      'Muestra u oculta el nombre de marca en la cabecera.',
                    ),
                    value: _navbarShowBrand,
                    onChanged: (v) => setState(() => _navbarShowBrand = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  if (_navbarShowBrand) ..._navbarBrandFields(),
                  const Divider(height: 24),
                  Text(
                    'Visibilidad de páginas',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                  const SizedBox(height: 4),
                  SwitchListTile(
                    title: const Text('Sobre mí'),
                    value: _showAbout,
                    onChanged: (v) => setState(() => _showAbout = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  SwitchListTile(
                    title: const Text('Portfolio'),
                    value: _showGallery,
                    onChanged: (v) => setState(() => _showGallery = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  SwitchListTile(
                    title: const Text('Servicios'),
                    value: _showServices,
                    onChanged: (v) => setState(() => _showServices = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  SwitchListTile(
                    title: const Text('Contacto'),
                    value: _showContact,
                    onChanged: (v) => setState(() => _showContact = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              // ── Branding ─────────────────────────────────────────────────────
              SettingsFormCard(
                title: 'Branding',
                children: [
                  TextFormField(
                    controller: _siteNameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Nombre del sitio',
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _siteTaglineCtrl,
                    decoration: const InputDecoration(labelText: 'Eslogan'),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              // ── SEO ────────────────────────────────────────────────────────
              SettingsFormCard(
                title: 'SEO',
                children: [
                  TextFormField(
                    controller: _metaTitleCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Meta título',
                      helperText: 'Título para buscadores (Google)',
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _metaDescCtrl,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      labelText: 'Meta descripción',
                      helperText: 'Descripción en resultados de búsqueda',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              // ── Mantenimiento ──────────────────────────────────────────────
              AppCard(
                color: _maintenanceMode
                    ? Colors.orange.withValues(alpha: 0.12)
                    : null,
                borderRadius: AppRadius.forCard,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.engineering_outlined,
                          color: Colors.orange,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Modo mantenimiento',
                          style: Theme.of(context).textTheme.titleSmall
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const Spacer(),
                        Switch(
                          value: _maintenanceMode,
                          onChanged: (v) =>
                              setState(() => _maintenanceMode = v),
                        ),
                      ],
                    ),
                    if (_maintenanceMode) ...[
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _maintenanceMsgCtrl,
                        maxLines: 2,
                        decoration: const InputDecoration(
                          labelText: 'Mensaje de mantenimiento',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
              FilledButton.icon(
                onPressed: _save,
                icon: const Icon(Icons.save_outlined),
                label: const Text('Guardar cambios'),
              ),
              const SizedBox(height: AppSpacing.base),
            ],
          ),
        ),
      ),
    );
  }
}
