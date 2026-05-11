part of 'settings_theme_page.dart';

extension _SettingsThemePageBuilders on _SettingsThemePageState {
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
              // ── Colores — Modo claro ───────────────────────────────
              SettingsFormCard(
                title: 'Colores — Modo claro',
                children: [
                  ColorField(
                    controller: _primaryCtrl,
                    label: 'Primario',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Primario',
                      hexColor: _primaryCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _secondaryCtrl,
                    label: 'Secundario',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Secundario',
                      hexColor: _secondaryCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _accentCtrl,
                    label: 'Acento',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Acento',
                      hexColor: _accentCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _bgCtrl,
                    label: 'Fondo',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Fondo',
                      hexColor: _bgCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _textCtrl,
                    label: 'Texto',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Texto',
                      hexColor: _textCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _cardBgCtrl,
                    label: 'Fondo tarjetas',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Fondo tarjetas',
                      hexColor: _cardBgCtrl.text,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Colores — Modo oscuro ──────────────────────────────
              SettingsFormCard(
                title: 'Colores — Modo oscuro',
                children: [
                  ColorField(
                    controller: _darkPrimaryCtrl,
                    label: 'Primario (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Primario (dark)',
                      hexColor: _darkPrimaryCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkSecondaryCtrl,
                    label: 'Secundario (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Secundario (dark)',
                      hexColor: _darkSecondaryCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkAccentCtrl,
                    label: 'Acento (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Acento (dark)',
                      hexColor: _darkAccentCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkBgCtrl,
                    label: 'Fondo (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Fondo (dark)',
                      hexColor: _darkBgCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkTextCtrl,
                    label: 'Texto (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Texto (dark)',
                      hexColor: _darkTextCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkCardBgCtrl,
                    label: 'Fondo tarjetas (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Fondo tarjetas (dark)',
                      hexColor: _darkCardBgCtrl.text,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Tipografías base ───────────────────────────────────
              SettingsFormCard(
                title: 'Tipografías — Base',
                children: [
                  FontPickerField(
                    label: 'Fuente de títulos',
                    value: _headingFontCtrl.text.isEmpty
                        ? null
                        : _headingFontCtrl.text,
                    onChanged: (name, _) {
                      _headingFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _headingFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño títulos (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  FontPickerField(
                    label: 'Fuente de cuerpo',
                    value: _bodyFontCtrl.text.isEmpty
                        ? null
                        : _bodyFontCtrl.text,
                    onChanged: (name, _) {
                      _bodyFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _bodyFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño cuerpo (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  FontPickerField(
                    label: 'Fuente script/decorativa',
                    value: _scriptFontCtrl.text.isEmpty
                        ? null
                        : _scriptFontCtrl.text,
                    onChanged: (name, _) {
                      _scriptFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _scriptFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño script (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Tipografías — Marca ────────────────────────────────
              SettingsFormCard(
                title: 'Tipografías — Marca',
                children: [
                  FontPickerField(
                    label: 'Fuente título "Make-up"',
                    value: _brandFontCtrl.text.isEmpty
                        ? null
                        : _brandFontCtrl.text,
                    onChanged: (name, _) {
                      _brandFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _brandFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  FontPickerField(
                    label: 'Fuente título "Portfolio"',
                    value: _portfolioFontCtrl.text.isEmpty
                        ? null
                        : _portfolioFontCtrl.text,
                    onChanged: (name, _) {
                      _portfolioFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _portfolioFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  FontPickerField(
                    label: 'Fuente firma',
                    value: _signatureFontCtrl.text.isEmpty
                        ? null
                        : _signatureFontCtrl.text,
                    onChanged: (name, _) {
                      _signatureFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _signatureFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Layout ─────────────────────────────────────────────
              SettingsFormCard(
                title: 'Layout',
                children: [
                  TextFormField(
                    controller: _borderRadiusCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Border radius (px)',
                      prefixIcon: Icon(Icons.rounded_corner),
                      hintText: 'Ej: 40',
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Vista previa de colores ────────────────────────────
              ThemeColorPreview(
                lightPrimary: _primaryCtrl.text,
                lightSecondary: _secondaryCtrl.text,
                lightBg: _bgCtrl.text,
                darkPrimary: _darkPrimaryCtrl.text,
                darkBg: _darkBgCtrl.text,
              ),
              const SizedBox(height: AppSpacing.xl),

              FilledButton.icon(
                onPressed: _save,
                icon: const Icon(Icons.save_outlined),
                label: const Text('Guardar tema'),
              ),
              const SizedBox(height: AppSpacing.base),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScaffold(BuildContext context) {
    final async = ref.watch(themeSettingsProvider);

    ref.listen<AsyncValue<ThemeSettings>>(themeSettingsProvider, (_, next) {
      next.whenData((settings) {
        if (!mounted || _populated || _isDirty) {
          return;
        }
        _assignControllers(settings);
        _populated = true;
      });
    });

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, Object? result) =>
          _maybeLeave(context),
      child: AppScaffold(
        title: 'Tema',
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
                const SkeletonSettingsPage(cardCount: 3, fieldsPerCard: 3),
            error: (e, _) => ErrorState.forFailure(
              e,
              onRetry: () => ref.invalidate(themeSettingsProvider),
            ),
            data: (settings) {
              return RefreshIndicator(
                onRefresh: () async {
                  ref.invalidate(themeSettingsProvider);
                  final s = await ref.read(themeSettingsProvider.future);
                  if (!mounted || _isDirty) {
                    return;
                  }
                  _assignControllers(s);
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

  void _assignControllers(ThemeSettings s) {
    // Light colors
    _primaryCtrl.text = s.primaryColor;
    _secondaryCtrl.text = s.secondaryColor;
    _accentCtrl.text = s.accentColor;
    _bgCtrl.text = s.backgroundColor;
    _textCtrl.text = s.textColor;
    _cardBgCtrl.text = s.cardBgColor;
    // Dark colors
    _darkPrimaryCtrl.text = s.darkPrimaryColor;
    _darkSecondaryCtrl.text = s.darkSecondaryColor;
    _darkAccentCtrl.text = s.darkAccentColor;
    _darkBgCtrl.text = s.darkBackgroundColor;
    _darkTextCtrl.text = s.darkTextColor;
    _darkCardBgCtrl.text = s.darkCardBgColor;
    // Fonts
    _headingFontCtrl.text = s.headingFont;
    _bodyFontCtrl.text = s.bodyFont;
    _scriptFontCtrl.text = s.scriptFont;
    _brandFontCtrl.text = s.brandFont ?? '';
    _portfolioFontCtrl.text = s.portfolioFont ?? '';
    _signatureFontCtrl.text = s.signatureFont ?? '';
    // Font sizes
    _headingFontSizeCtrl.text = '${s.headingFontSize}';
    _bodyFontSizeCtrl.text = '${s.bodyFontSize}';
    _scriptFontSizeCtrl.text = '${s.scriptFontSize}';
    _brandFontSizeCtrl.text = s.brandFontSize != null
        ? '${s.brandFontSize}'
        : '';
    _portfolioFontSizeCtrl.text = s.portfolioFontSize != null
        ? '${s.portfolioFontSize}'
        : '';
    _signatureFontSizeCtrl.text = s.signatureFontSize != null
        ? '${s.signatureFontSize}'
        : '';
    // Layout
    _borderRadiusCtrl.text = '${s.borderRadius}';
  }

  String? _nullIfEmpty(String v) => v.trim().isEmpty ? null : v.trim();
  int? _intOrNull(String v) => int.tryParse(v.trim());

  Future<void> _save() async {
    if (!_populated) return;
    setState(() => _saving = true);
    try {
      await ref.read(settingsRepositoryProvider).updateTheme({
        // Light colors
        'primaryColor': _primaryCtrl.text.trim(),
        'secondaryColor': _secondaryCtrl.text.trim(),
        'accentColor': _accentCtrl.text.trim(),
        'backgroundColor': _bgCtrl.text.trim(),
        'textColor': _textCtrl.text.trim(),
        'cardBgColor': _cardBgCtrl.text.trim(),
        // Dark colors
        'darkPrimaryColor': _darkPrimaryCtrl.text.trim(),
        'darkSecondaryColor': _darkSecondaryCtrl.text.trim(),
        'darkAccentColor': _darkAccentCtrl.text.trim(),
        'darkBackgroundColor': _darkBgCtrl.text.trim(),
        'darkTextColor': _darkTextCtrl.text.trim(),
        'darkCardBgColor': _darkCardBgCtrl.text.trim(),
        // Fonts
        'headingFont': _headingFontCtrl.text.trim(),
        'bodyFont': _bodyFontCtrl.text.trim(),
        'scriptFont': _scriptFontCtrl.text.trim(),
        'brandFont': _nullIfEmpty(_brandFontCtrl.text),
        'portfolioFont': _nullIfEmpty(_portfolioFontCtrl.text),
        'signatureFont': _nullIfEmpty(_signatureFontCtrl.text),
        // Font sizes
        'headingFontSize': _intOrNull(_headingFontSizeCtrl.text),
        'bodyFontSize': _intOrNull(_bodyFontSizeCtrl.text),
        'scriptFontSize': _intOrNull(_scriptFontSizeCtrl.text),
        'brandFontSize': _intOrNull(_brandFontSizeCtrl.text),
        'portfolioFontSize': _intOrNull(_portfolioFontSizeCtrl.text),
        'signatureFontSize': _intOrNull(_signatureFontSizeCtrl.text),
        // Layout
        'borderRadius': _intOrNull(_borderRadiusCtrl.text),
      });
      ref.invalidate(themeSettingsProvider);
      if (mounted) {
        setState(() => _isDirty = false);
        AppSnackBar.success(context, 'Tema guardado correctamente');
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        AppSnackBar.error(context, 'Error al guardar el tema: $e');
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
