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

    final vpLabel = switch (_previewDevice) {
      'mobile' => '375×812',
      'tablet' => '768×1024',
      _ => '1280×900',
    };

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
            onSelectPanel: (panel) => _rebuild(() => _editorPanel = panel),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        Text(
          'Viewport $vpLabel px — igual que el CMS web. Máx. alto vista ${650}px. '
          'Toca títulos, foto, CTA o fondo para abrir ese panel.',
          style: theme.textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurface.withValues(alpha: 150 / 255),
            fontStyle: FontStyle.italic,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildPanelChips(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (final p in HomeEditorPanel.values)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: FilterChip(
                selected: _editorPanel == p,
                showCheckmark: false,
                avatar: Icon(p.icon, size: 18),
                label: Text(p.label),
                onSelected: (_) => _rebuild(() => _editorPanel = p),
                selectedColor: cs.primaryContainer,
                checkmarkColor: cs.onPrimaryContainer,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildActiveEditorPanel(BuildContext context) {
    return switch (_editorPanel) {
      HomeEditorPanel.texts => _buildHeroTextsSection(),
      HomeEditorPanel.immersive => _buildImmersiveSection(),
      HomeEditorPanel.heroImage => _buildHeroImageSection(),
      HomeEditorPanel.illustration => _buildIllustrationSection(),
      HomeEditorPanel.cta => _buildCtaSection(),
      HomeEditorPanel.featured => _buildFeaturedSection(),
      HomeEditorPanel.position => _buildPositionSection(),
      HomeEditorPanel.mobile => _buildMobileSection(),
    };
  }

  Widget _buildEditorColumn(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildPanelChips(context),
        const SizedBox(height: AppSpacing.md),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 220),
          switchInCurve: Curves.easeOut,
          switchOutCurve: Curves.easeIn,
          child: KeyedSubtree(
            key: ValueKey(_editorPanel),
            child: _buildActiveEditorPanel(context),
          ),
        ),
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

  Widget _buildForm(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    final isExpanded = AppBreakpoints.isExpanded(context);
    final maxWidth = AppBreakpoints.value<double>(
      context,
      compact: double.infinity,
      medium: 760,
      expanded: 1400,
    );

    final editor = _buildEditorColumn(context);

    final scrollBody = isExpanded
        ? Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 55,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.only(right: AppSpacing.sm),
                  child: editor,
                ),
              ),
              const SizedBox(width: AppSpacing.xl),
              Expanded(
                flex: 45,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  child: StickyPreviewColumn(
                    preview: _buildHeroPreview(context),
                  ),
                ),
              ),
            ],
          )
        : SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                CollapsiblePreview(preview: _buildHeroPreview(context)),
                const SizedBox(height: AppSpacing.md),
                editor,
              ],
            ),
          );

    return Padding(
      padding: padding,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: scrollBody,
        ),
      ),
    );
  }
}
