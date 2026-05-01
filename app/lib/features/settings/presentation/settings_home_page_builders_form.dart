part of 'settings_home_page.dart';

extension _SettingsHomeForm on _SettingsHomePageState {
  Widget _buildHeroPreview(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final theme = Theme.of(context);

    Widget buildToolbar() {
      return Container(
        margin: const EdgeInsets.only(bottom: AppSpacing.sm),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: colorScheme.surfaceContainerHighest.withValues(alpha: 100),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(Icons.web_outlined, size: 16, color: colorScheme.primary),
                const SizedBox(width: 6),
                Text(
                  'Vista previa en vivo',
                  style: theme.textTheme.labelMedium?.copyWith(
                    color: colorScheme.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            Row(
              children: [
                IconButton(
                  iconSize: 18,
                  tooltip: _previewDarkMode ? 'Modo Claro' : 'Modo Oscuro',
                  icon: Icon(
                    _previewDarkMode ? Icons.dark_mode : Icons.light_mode,
                  ),
                  onPressed: () {
                    _togglePreviewDarkMode();
                  },
                ),
                const SizedBox(width: 4),
                SegmentedButton<String>(
                  segments: const [
                    ButtonSegment(
                      value: 'mobile',
                      icon: Icon(Icons.phone_android, size: 16),
                    ),
                    ButtonSegment(
                      value: 'tablet',
                      icon: Icon(Icons.tablet_mac, size: 16),
                    ),
                    ButtonSegment(
                      value: 'desktop',
                      icon: Icon(Icons.desktop_mac, size: 16),
                    ),
                  ],
                  selected: {_previewDevice},
                  onSelectionChanged: (Set<String> newSelection) {
                    _setPreviewDevice(newSelection.first);
                  },
                  showSelectedIcon: false,
                  style: SegmentedButton.styleFrom(
                    visualDensity: VisualDensity.compact,
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                  ),
                ),
              ],
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        buildToolbar(),
        const SizedBox(height: AppSpacing.xs),
        DecoratedBox(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 25 / 255),
                blurRadius: 16,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: LiveHeroPreview(
            vals: _vals,
            extraCtrls: _extraCtrls,
            title1: _title1Ctrl.text.isNotEmpty ? _title1Ctrl.text : 'Make-up',
            title2: _title2Ctrl.text.isNotEmpty
                ? _title2Ctrl.text
                : 'Portfolio',
            owner: _ownerNameCtrl.text.isNotEmpty
                ? _ownerNameCtrl.text
                : 'Paola Bolívar Nievas',
            cta: _ctaTextCtrl.text.isNotEmpty
                ? _ctaTextCtrl.text
                : 'Ver Portfolio',
            pendingHeroImage: _pendingHeroImage,
            currentHeroImageUrl: _heroImageCtrl.text,
            pendingIllustration: _pendingIllustration,
            currentIllustrationUrl: _extraCtrls['illustrationUrl']?.text ?? '',
            device: _previewDevice,
            isDarkMode: _previewDarkMode,
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        Text(
          "El simulador escala el viewport (${_previewDevice == 'mobile'
              ? '390px'
              : _previewDevice == 'tablet'
              ? '768px'
              : '1200px'}) a esta caja en tiempo real. Utilízalo para probar los overrides móviles.",
          style: theme.textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurface.withValues(alpha: 150 / 255),
            fontStyle: FontStyle.italic,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildForm(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    final isExpanded = AppBreakpoints.isExpanded(context);
    final maxWidth = AppBreakpoints.value<double>(
      context,
      compact: double.infinity,
      medium: 760,
      expanded: 1200,
    );

    final formContent = _buildFormContent(context);

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: padding,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: isExpanded
              ? Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 58,
                      child: Padding(
                        padding: EdgeInsets.zero,
                        child: formContent,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.xl),
                    Expanded(
                      flex: 42,
                      child: StickyPreviewColumn(
                        preview: _buildHeroPreview(context),
                      ),
                    ),
                  ],
                )
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    CollapsiblePreview(preview: _buildHeroPreview(context)),
                    const SizedBox(height: AppSpacing.md),
                    formContent,
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildFormContent(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildHeroTextsSection(),
        const SizedBox(height: AppSpacing.md),
        _buildHeroImageSection(),
        const SizedBox(height: AppSpacing.md),
        _buildIllustrationSection(),
        const SizedBox(height: AppSpacing.md),
        _buildCtaSection(),
        const SizedBox(height: AppSpacing.md),
        _buildFeaturedSection(),
        const SizedBox(height: AppSpacing.md),
        _buildPositionSection(),
        const SizedBox(height: AppSpacing.md),
        _buildMobileSection(),
        const SizedBox(height: AppSpacing.xl),
        FilledButton.icon(
          onPressed: _saving ? null : _save,
          icon: const Icon(Icons.save_outlined),
          label: const Text('Guardar cambios'),
        ),
        const SizedBox(height: AppSpacing.base),
      ],
    );
  }
}
