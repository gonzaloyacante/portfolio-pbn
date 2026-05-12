part of 'settings_theme_page.dart';

extension _SettingsThemePageBuilders on _SettingsThemePageState {
  Widget _buildForm(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    if (AppBreakpoints.isExpanded(context)) {
      return Padding(
        padding: padding,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 460,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: _buildEditorColumn(context),
              ),
            ),
            const SizedBox(width: AppSpacing.xl),
            Expanded(
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [_buildThemeMap(context), _buildLivePreview()],
                ),
              ),
            ),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: padding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildThemeMap(context),
          _buildLivePreview(),
          const SizedBox(height: AppSpacing.md),
          _buildEditorColumn(context),
        ],
      ),
    );
  }

  Widget _buildEditorColumn(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildThemeSection(
          context,
          icon: Icons.layers_outlined,
          title: 'Canvas claro',
          subtitle:
              'Define fondo general, texto base, tarjetas y acentos del sitio en modo claro.',
          initiallyExpanded: true,
          children: [
            _colorField(
              context,
              controller: _bgCtrl,
              label: 'Canvas de página',
              helperText: 'Fondos generales y secciones públicas.',
            ),
            _colorField(
              context,
              controller: _textCtrl,
              label: 'Texto principal',
              helperText: 'Párrafos, títulos normales y contenido legible.',
            ),
            _colorField(
              context,
              controller: _cardBgCtrl,
              label: 'Superficie / tarjetas',
              helperText: 'Cards, paneles y bloques elevados.',
            ),
            _colorField(
              context,
              controller: _secondaryCtrl,
              label: 'Superficie suave',
              helperText: 'Fondos secundarios, hover y zonas destacadas.',
            ),
            _colorField(
              context,
              controller: _accentCtrl,
              label: 'Acento suave',
              helperText: 'Fondos decorativos y énfasis no principal.',
            ),
            _colorField(
              context,
              controller: _primaryCtrl,
              label: 'Acento / CTA',
              helperText: 'Botones principales, links y estado activo.',
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        _buildThemeSection(
          context,
          icon: Icons.dark_mode_outlined,
          title: 'Canvas oscuro',
          subtitle:
              'Mismos roles que modo claro, pero para visitante con dark mode activo.',
          children: [
            _colorField(
              context,
              controller: _darkBgCtrl,
              label: 'Canvas oscuro',
              helperText: 'Fondo general en modo oscuro.',
            ),
            _colorField(
              context,
              controller: _darkTextCtrl,
              label: 'Texto oscuro',
              helperText: 'Texto legible sobre fondos oscuros.',
            ),
            _colorField(
              context,
              controller: _darkCardBgCtrl,
              label: 'Tarjetas oscuras',
              helperText: 'Paneles, cards y superficies elevadas oscuras.',
            ),
            _colorField(
              context,
              controller: _darkSecondaryCtrl,
              label: 'Superficie suave oscura',
              helperText: 'Hover, chips y zonas secundarias.',
            ),
            _colorField(
              context,
              controller: _darkAccentCtrl,
              label: 'Acento suave oscuro',
              helperText: 'Decoración y fondos de apoyo.',
            ),
            _colorField(
              context,
              controller: _darkPrimaryCtrl,
              label: 'Acento / CTA oscuro',
              helperText: 'Botones, links y navegación activa en dark mode.',
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        _buildThemeSection(
          context,
          icon: Icons.text_fields_outlined,
          title: 'Tipografías base',
          subtitle:
              'Roles visibles en todo el sitio: títulos, párrafos y firma decorativa.',
          children: [
            _fontPicker(
              label: 'Títulos',
              controller: _headingFontCtrl,
              sizeController: _headingFontSizeCtrl,
              sizeLabel: 'Tamaño títulos (px)',
            ),
            _fontPicker(
              label: 'Cuerpo',
              controller: _bodyFontCtrl,
              sizeController: _bodyFontSizeCtrl,
              sizeLabel: 'Tamaño cuerpo (px)',
            ),
            _fontPicker(
              label: 'Script / decorativa',
              controller: _scriptFontCtrl,
              sizeController: _scriptFontSizeCtrl,
              sizeLabel: 'Tamaño script (px)',
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        _buildThemeSection(
          context,
          icon: Icons.draw_outlined,
          title: 'Tipografías de marca',
          subtitle:
              'Afectan bloques especiales del hero y marca, no todos los textos.',
          children: [
            _fontPicker(
              label: 'Make-up',
              controller: _brandFontCtrl,
              sizeController: _brandFontSizeCtrl,
              sizeLabel: 'Tamaño Make-up (px)',
            ),
            _fontPicker(
              label: 'Portfolio',
              controller: _portfolioFontCtrl,
              sizeController: _portfolioFontSizeCtrl,
              sizeLabel: 'Tamaño Portfolio (px)',
            ),
            _fontPicker(
              label: 'Firma',
              controller: _signatureFontCtrl,
              sizeController: _signatureFontSizeCtrl,
              sizeLabel: 'Tamaño firma (px)',
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        _buildThemeSection(
          context,
          icon: Icons.rounded_corner,
          title: 'Forma y radio',
          subtitle: 'Define cuán redondeadas se ven cards, botones y paneles.',
          children: [
            TextFormField(
              controller: _borderRadiusCtrl,
              decoration: const InputDecoration(
                labelText: 'Radio global (px)',
                prefixIcon: Icon(Icons.rounded_corner),
                helperText: 'Ej: 40 para cards suaves tipo marca PBN.',
              ),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.xl),
        FilledButton.icon(
          onPressed: _save,
          icon: const Icon(Icons.save_outlined),
          label: const Text('Guardar tema'),
        ),
        const SizedBox(height: AppSpacing.base),
      ],
    );
  }

  Widget _buildThemeMap(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return SettingsFormCard(
      title: 'Mapa del tema',
      leadingIcon: Icons.map_outlined,
      children: [
        Text(
          'Editá por capas. Cada color tiene un rol concreto: fondo, texto, tarjeta, navegación, botones o estados. Mirá el preview antes de guardar.',
          style: textTheme.bodyMedium?.copyWith(
            color: colorScheme.onSurface.withValues(alpha: 0.72),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        Wrap(
          spacing: AppSpacing.sm,
          runSpacing: AppSpacing.sm,
          children: [
            _layerChip(context, 'Canvas'),
            _layerChip(context, 'Tarjetas'),
            _layerChip(context, 'Navegación'),
            _layerChip(context, 'CTA'),
            _layerChip(context, 'Tipografía'),
          ],
        ),
      ],
    );
  }

  Widget _buildThemeSection(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required List<Widget> children,
    bool initiallyExpanded = false,
  }) {
    final colorScheme = Theme.of(context).colorScheme;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: colorScheme.outlineVariant.withValues(alpha: 0.6),
        ),
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          initiallyExpanded: initiallyExpanded,
          tilePadding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.base,
            vertical: AppSpacing.sm,
          ),
          childrenPadding: const EdgeInsets.fromLTRB(
            AppSpacing.base,
            0,
            AppSpacing.base,
            AppSpacing.base,
          ),
          expandedCrossAxisAlignment: CrossAxisAlignment.stretch,
          leading: Icon(icon, color: colorScheme.primary),
          title: Text(
            title,
            style: Theme.of(
              context,
            ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w800),
          ),
          subtitle: Text(subtitle),
          children: [
            AdaptiveFormLayout(maxWidth: double.infinity, children: children),
          ],
        ),
      ),
    );
  }

  Widget _buildLivePreview() {
    return ThemeColorPreview(
      lightPrimary: _primaryCtrl.text,
      lightSecondary: _secondaryCtrl.text,
      lightAccent: _accentCtrl.text,
      lightBg: _bgCtrl.text,
      lightText: _textCtrl.text,
      lightCard: _cardBgCtrl.text,
      darkPrimary: _darkPrimaryCtrl.text,
      darkSecondary: _darkSecondaryCtrl.text,
      darkAccent: _darkAccentCtrl.text,
      darkBg: _darkBgCtrl.text,
      darkText: _darkTextCtrl.text,
      darkCard: _darkCardBgCtrl.text,
      headingFont: _headingFontCtrl.text,
      bodyFont: _bodyFontCtrl.text,
      scriptFont: _scriptFontCtrl.text,
      borderRadius: _intOrNull(_borderRadiusCtrl.text) ?? 40,
    );
  }

  Widget _layerChip(BuildContext context, String label) {
    final colorScheme = Theme.of(context).colorScheme;
    return Chip(
      label: Text(label),
      backgroundColor: colorScheme.secondaryContainer.withValues(alpha: 0.55),
      side: BorderSide(color: colorScheme.outlineVariant),
      labelStyle: TextStyle(
        color: colorScheme.onSecondaryContainer,
        fontWeight: FontWeight.w700,
      ),
    );
  }

  Widget _colorField(
    BuildContext context, {
    required TextEditingController controller,
    required String label,
    required String helperText,
  }) {
    return ColorField(
      controller: controller,
      label: label,
      helperText: helperText,
      onInfoTap: () =>
          showColorUsageSheet(context, label: label, hexColor: controller.text),
    );
  }

  Widget _fontPicker({
    required String label,
    required TextEditingController controller,
    required TextEditingController sizeController,
    required String sizeLabel,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        FontPickerField(
          label: label,
          value: controller.text.isEmpty ? null : controller.text,
          onChanged: (name, _) {
            controller.text = name;
            _markDirty();
            setState(() {});
          },
        ),
        const SizedBox(height: AppSpacing.sm),
        TextFormField(
          controller: sizeController,
          decoration: InputDecoration(
            labelText: sizeLabel,
            prefixIcon: const Icon(Icons.format_size),
            helperText: 'Se ve en el preview de tipografías.',
          ),
          keyboardType: TextInputType.number,
        ),
      ],
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
