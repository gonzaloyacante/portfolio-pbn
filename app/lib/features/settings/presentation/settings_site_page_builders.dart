part of 'settings_site_page.dart';

extension _SettingsSitePageBuilders on _SettingsSitePageState {
  Widget _buildForm(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    final maxWidth = AppBreakpoints.value<double>(
      context,
      compact: double.infinity,
      medium: 760,
      expanded: 960,
    );

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
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
                  if (_navbarShowBrand) ..._buildNavbarBrandFields(context),
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
                    ? AppColors.warning.withValues(alpha: 0.12)
                    : null,
                borderRadius: AppRadius.forCard,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.engineering_outlined,
                          color: AppColors.warning,
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

  List<Widget> _buildNavbarBrandFields(BuildContext context) {
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
            child: FontPickerField(
              value: _navbarBrandFont,
              label: 'Fuente',
              onChanged: (name, url) => setState(() {
                _navbarBrandFont = name;
                _navbarBrandFontUrl = url;
                _isDirty = true;
              }),
            ),
          ),
          const SizedBox(width: 12),
          SizedBox(
            width: 100,
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
      Row(
        children: [
          Expanded(
            child: ColorPickerField(
              controller: _navbarBrandColorCtrl,
              label: 'Color claro',
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ColorPickerField(
              controller: _navbarBrandColorDarkCtrl,
              label: 'Color oscuro (modo oscuro)',
            ),
          ),
        ],
      ),
    ];
  }

  Widget _buildScaffold(BuildContext context) {
    final async = ref.watch(siteSettingsProvider);

    ref.listen<AsyncValue<SiteSettings>>(siteSettingsProvider, (_, next) {
      next.whenData((settings) {
        if (!mounted || _populated || _isDirty) {
          return;
        }
        _populate(settings);
        _populated = true;
        setState(() {});
      });
    });

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, Object? result) =>
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
            error: (e, _) => ErrorState.forFailure(
              e,
              onRetry: () => ref.invalidate(siteSettingsProvider),
            ),
            data: (settings) {
              return RefreshIndicator(
                onRefresh: () async {
                  ref.invalidate(siteSettingsProvider);
                  final s = await ref.read(siteSettingsProvider.future);
                  if (!mounted || _isDirty) {
                    return;
                  }
                  _populate(s);
                  _populated = true;
                  setState(() {});
                },
                child: _buildForm(context),
              );
            },
          ),
        ),
      ),
    );
  }

  void _populate(SiteSettings s) {
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
}
