part of 'settings_home_page.dart';

extension _SettingsHomePageBuilders on _SettingsHomePageState {
  // ── Section 1: Hero Texts ─────────────────────────────────────────────────

  Widget _buildHeroTextsSection() {
    return SettingsFormCard(
      title: 'Textos del Hero',
      leadingIcon: Icons.title_rounded,
      children: [
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Visible en web: título principal'),
          value: (_vals['showHeroTitle1'] as bool?) ?? true,
          onChanged: (v) => _rebuild(() {
            _vals['showHeroTitle1'] = v;
            _isDirty = true;
          }),
        ),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Visible en web: segundo título'),
          value: (_vals['showHeroTitle2'] as bool?) ?? true,
          onChanged: (v) => _rebuild(() {
            _vals['showHeroTitle2'] = v;
            _isDirty = true;
          }),
        ),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Visible en web: nombre de la artista'),
          value: (_vals['showOwnerName'] as bool?) ?? true,
          onChanged: (v) => _rebuild(() {
            _vals['showOwnerName'] = v;
            _isDirty = true;
          }),
        ),
        const Divider(height: AppSpacing.lg),
        TextFormField(
          controller: _title1Ctrl,
          decoration: const InputDecoration(
            labelText: 'Título principal',
            hintText: 'Ej: "Make-up"',
            prefixIcon: Icon(Icons.format_size),
          ),
        ),
        _buildTextDesign('heroTitle1', fontSizeFallback: 112),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _title2Ctrl,
          decoration: const InputDecoration(
            labelText: 'Segundo título',
            hintText: 'Ej: "Artist"',
            prefixIcon: Icon(Icons.format_size),
          ),
        ),
        _buildTextDesign('heroTitle2', fontSizeFallback: 96),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ownerNameCtrl,
          decoration: const InputDecoration(
            labelText: 'Nombre de la artista',
            hintText: 'Ej: "Paola Bolívar Nievas"',
            prefixIcon: Icon(Icons.person_outline),
          ),
        ),
        _buildTextDesign('ownerName', fontSizeFallback: 36),
      ],
    );
  }

  // ── Section 2: Hero Image ─────────────────────────────────────────────────

  Widget _buildHeroImageSection() {
    return SettingsFormCard(
      title: 'Foto del Hero',
      leadingIcon: Icons.image_outlined,
      children: [
        HeroImagePicker(
          imageUrl: _heroImageCtrl.text,
          pendingFile: _pendingHeroImage,
          onPick: _pickHeroImage,
          onRemove: _removeHeroImage,
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _heroImageAltCtrl,
          decoration: const InputDecoration(
            labelText: 'Texto alternativo (accesibilidad)',
            hintText: 'Ej: "Foto de Paola maquillando"',
            prefixIcon: Icon(Icons.accessibility_new_outlined),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ctrl('heroMainImageCaption'),
          decoration: const InputDecoration(
            labelText: 'Pie de foto (opcional)',
            hintText: 'Ej: "Sesión en Barcelona"',
            prefixIcon: Icon(Icons.closed_caption_outlined),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        DropdownButtonFormField<String>(
          value: _strVal('heroImageStyle', 'original'),
          decoration: const InputDecoration(
            labelText: 'Estilo de imagen',
            prefixIcon: Icon(Icons.crop_outlined),
          ),
          items: const [
            DropdownMenuItem(value: 'original', child: Text('Original')),
            DropdownMenuItem(value: 'rounded', child: Text('Redondeado')),
            DropdownMenuItem(value: 'square', child: Text('Cuadrado')),
            DropdownMenuItem(value: 'circle', child: Text('Circular')),
            DropdownMenuItem(value: 'landscape', child: Text('Horizontal')),
            DropdownMenuItem(value: 'portrait', child: Text('Retrato')),
            DropdownMenuItem(value: 'star', child: Text('Estrella')),
          ],
          onChanged: (v) => _setVal('heroImageStyle', v),
        ),
      ],
    );
  }

  // ── Section 3: Illustration ───────────────────────────────────────────────

  Widget _buildIllustrationSection() {
    final illustrationUrl = (_vals['illustrationUrl'] as String?) ?? '';

    return SettingsFormCard(
      title: 'Ilustración decorativa',
      leadingIcon: Icons.brush_outlined,
      children: [
        HeroImagePicker(
          imageUrl: illustrationUrl,
          pendingFile: _pendingIllustration,
          onPick: _pickIllustration,
          onRemove: _removeIllustration,
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ctrl('illustrationAlt'),
          decoration: const InputDecoration(
            labelText: 'Texto alternativo',
            hintText: 'Ej: "Ilustración maquilladora"',
            prefixIcon: Icon(Icons.accessibility_new_outlined),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        _buildSlider(
          'illustrationOpacity',
          'Opacidad',
          min: 0,
          max: 100,
          fallback: 100,
          suffix: '%',
        ),
        _buildSlider(
          'illustrationSize',
          'Tamaño',
          min: 10,
          max: 500,
          fallback: 100,
          suffix: '%',
        ),
        _buildSlider(
          'illustrationRotation',
          'Rotación',
          min: -180,
          max: 180,
          fallback: 0,
          suffix: '°',
        ),
      ],
    );
  }

  // ── Section 4: CTA ────────────────────────────────────────────────────────

  Widget _buildCtaSection() {
    return SettingsFormCard(
      title: 'Botón de acción (CTA)',
      leadingIcon: Icons.touch_app_outlined,
      children: [
        TextFormField(
          controller: _ctaTextCtrl,
          decoration: const InputDecoration(
            labelText: 'Texto del botón',
            hintText: 'Ej: "Ver portfolio"',
            prefixIcon: Icon(Icons.smart_button_outlined),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ctaLinkCtrl,
          keyboardType: TextInputType.url,
          decoration: const InputDecoration(
            labelText: 'Enlace destino',
            hintText: 'Ej: "/portfolio"',
            prefixIcon: Icon(Icons.link_outlined),
          ),
        ),
        _buildTextDesignCta(),
        const SizedBox(height: AppSpacing.md),
        DropdownButtonFormField<String>(
          value: _strVal('ctaVariant', 'default'),
          decoration: const InputDecoration(
            labelText: 'Variante',
            prefixIcon: Icon(Icons.style_outlined),
          ),
          items: const [
            DropdownMenuItem(value: 'default', child: Text('Primario')),
            DropdownMenuItem(value: 'secondary', child: Text('Secundario')),
            DropdownMenuItem(value: 'outline', child: Text('Contorno')),
            DropdownMenuItem(value: 'ghost', child: Text('Fantasma')),
          ],
          onChanged: (v) => _setVal('ctaVariant', v),
        ),
        const SizedBox(height: AppSpacing.md),
        DropdownButtonFormField<String>(
          value: _strVal('ctaSize', 'default'),
          decoration: const InputDecoration(
            labelText: 'Tamaño del botón',
            prefixIcon: Icon(Icons.format_size_outlined),
          ),
          items: const [
            DropdownMenuItem(value: 'sm', child: Text('Pequeño')),
            DropdownMenuItem(value: 'default', child: Text('Mediano')),
            DropdownMenuItem(value: 'lg', child: Text('Grande')),
          ],
          onChanged: (v) => _setVal('ctaSize', v),
        ),
      ],
    );
  }

  // ── Section 5: Featured Images ──────────────────────────────────────────

  Widget _buildFeaturedSection() {
    return SettingsFormCard(
      title: 'Imágenes destacadas',
      leadingIcon: Icons.star_outline_rounded,
      children: [
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Mostrar sección de destacados'),
          subtitle: const Text(
            'Aparece debajo del Hero en la página de inicio',
          ),
          value: _showFeatured,
          onChanged: (v) => _rebuild(() => _showFeatured = v),
        ),
        if (_showFeatured) ...[
          const Divider(height: AppSpacing.xl),
          TextFormField(
            controller: _featuredTitleCtrl,
            decoration: const InputDecoration(
              labelText: 'Título de la sección',
              hintText: 'Ej: "Trabajos recientes"',
              prefixIcon: Icon(Icons.title_outlined),
            ),
          ),
          _buildTextDesign('featuredTitle', fontSizeFallback: 32),
          const SizedBox(height: AppSpacing.md),
          FeaturedCountPicker(
            value: _featuredCount,
            onChanged: (v) => _rebuild(() => _featuredCount = v),
          ),
          const SizedBox(height: AppSpacing.md),
          OutlinedButton.icon(
            onPressed: () => context.pushNamed(RouteNames.categories),
            icon: const Icon(Icons.open_in_new_rounded, size: 16),
            label: const Text('Ver categorías →'),
          ),
        ],
      ],
    );
  }

  // ── Section 6: Position & Layers ──────────────────────────────────────────

  Widget _buildPositionSection() {
    return SettingsFormCard(
      title: 'Posición y capas',
      leadingIcon: Icons.layers_outlined,
      children: [
        Text(
          'Ajusta la profundidad (z-index) y posición de cada elemento.',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(
              context,
            ).colorScheme.onSurface.withValues(alpha: 0.6),
          ),
        ),
        _buildPositionBlock('Título 1', 'heroTitle1', zFallback: 20),
        _buildPositionBlock('Título 2', 'heroTitle2', zFallback: 10),
        _buildPositionBlock('Nombre', 'ownerName', zFallback: 15),
        _buildPositionBlock('Imagen hero', 'heroMainImage', zFallback: 5),
        _buildPositionBlock('Ilustración', 'illustration', zFallback: 10),
        _buildPositionBlockNoZ('Botón CTA', 'cta'),
      ],
    );
  }

  // ── Section 7: Mobile Overrides ──────────────────────────────────────────

  Widget _buildMobileSection() {
    return SettingsFormCard(
      title: 'Ajustes móviles',
      leadingIcon: Icons.smartphone_outlined,
      children: [
        Text(
          'Sobreescribe valores para pantallas pequeñas.',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(
              context,
            ).colorScheme.onSurface.withValues(alpha: 0.6),
          ),
        ),
        _buildMobileBlock('Título 1', 'heroTitle1', fontSizeFallback: 56),
        _buildMobileBlock('Título 2', 'heroTitle2', fontSizeFallback: 72),
        _buildMobileBlock('Nombre', 'ownerName', fontSizeFallback: 28),
        _buildMobileBlockOffset('Imagen hero', 'heroMainImage'),
        _buildMobileBlockIllustration(),
        _buildMobileBlock('Botón CTA', 'cta', fontSizeFallback: 16),
      ],
    );
  }

  // ── Reusable helpers ──────────────────────────────────────────────────────

  /// Expandable font, size & color panel for a text element.
  Widget _buildTextDesign(String prefix, {int fontSizeFallback = 16}) {
    final fontKey = '${prefix}Font';
    final fontUrlKey = '${prefix}FontUrl';
    final sizeKey = '${prefix}FontSize';
    final colorKey = '${prefix}Color';
    final colorDarkKey = '${prefix}ColorDark';

    return ExpansionTile(
      title: const Text('Personalizar tipografía'),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        FontPickerField(
          value: _ctrl(fontKey).text.isEmpty ? null : _ctrl(fontKey).text,
          onChanged: (name, url) => _rebuild(() {
            _ctrl(fontKey).text = name;
            _ctrl(fontUrlKey).text = url;
          }),
        ),
        const SizedBox(height: AppSpacing.md),
        _buildSlider(
          sizeKey,
          'Tamaño',
          min: 8,
          max: 200,
          fallback: fontSizeFallback,
        ),
        const SizedBox(height: AppSpacing.md),
        ColorPickerField(controller: _ctrl(colorKey), label: 'Color (claro)'),
        const SizedBox(height: AppSpacing.md),
        ColorPickerField(
          controller: _ctrl(colorDarkKey),
          label: 'Color (oscuro)',
        ),
      ],
    );
  }

  /// CTA font design — font + size (no colors, CTA colors come from variant).
  Widget _buildTextDesignCta() {
    return ExpansionTile(
      title: const Text('Personalizar tipografía'),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        FontPickerField(
          value: _ctrl('ctaFont').text.isEmpty ? null : _ctrl('ctaFont').text,
          onChanged: (name, url) => _rebuild(() {
            _ctrl('ctaFont').text = name;
            _ctrl('ctaFontUrl').text = url;
          }),
        ),
        const SizedBox(height: AppSpacing.md),
        _buildSlider('ctaFontSize', 'Tamaño', min: 8, max: 48, fallback: 16),
      ],
    );
  }

  /// Position block with z-index + offsets.
  Widget _buildPositionBlock(String label, String prefix, {int zFallback = 0}) {
    return ExpansionTile(
      title: Text(label),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        _buildSlider(
          '${prefix}ZIndex',
          'Z-Index',
          min: 0,
          max: 50,
          fallback: zFallback,
        ),
        _buildSlider('${prefix}OffsetX', 'Desplazar X', min: -200, max: 200),
        _buildSlider('${prefix}OffsetY', 'Desplazar Y', min: -200, max: 200),
      ],
    );
  }

  /// Position block without z-index (e.g. CTA).
  Widget _buildPositionBlockNoZ(String label, String prefix) {
    return ExpansionTile(
      title: Text(label),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        _buildSlider('${prefix}OffsetX', 'Desplazar X', min: -200, max: 200),
        _buildSlider('${prefix}OffsetY', 'Desplazar Y', min: -200, max: 200),
      ],
    );
  }

  /// Mobile block with font size + offsets (text elements + CTA).
  Widget _buildMobileBlock(
    String label,
    String prefix, {
    int fontSizeFallback = 16,
  }) {
    return ExpansionTile(
      title: Text(label),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        _buildSlider(
          '${prefix}MobileFontSize',
          'Tamaño fuente',
          min: 8,
          max: 120,
          fallback: fontSizeFallback,
        ),
        _buildSlider(
          '${prefix}MobileOffsetX',
          'Desplazar X',
          min: -200,
          max: 200,
        ),
        _buildSlider(
          '${prefix}MobileOffsetY',
          'Desplazar Y',
          min: -200,
          max: 200,
        ),
      ],
    );
  }

  /// Mobile block with offset only (hero image).
  Widget _buildMobileBlockOffset(String label, String prefix) {
    return ExpansionTile(
      title: Text(label),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        _buildSlider(
          '${prefix}MobileOffsetX',
          'Desplazar X',
          min: -200,
          max: 200,
        ),
        _buildSlider(
          '${prefix}MobileOffsetY',
          'Desplazar Y',
          min: -200,
          max: 200,
        ),
      ],
    );
  }

  /// Mobile block for illustration (offset + size + rotation).
  Widget _buildMobileBlockIllustration() {
    return ExpansionTile(
      title: const Text('Ilustración'),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        _buildSlider(
          'illustrationMobileOffsetX',
          'Desplazar X',
          min: -200,
          max: 200,
        ),
        _buildSlider(
          'illustrationMobileOffsetY',
          'Desplazar Y',
          min: -200,
          max: 200,
        ),
        _buildSlider(
          'illustrationMobileSize',
          'Tamaño',
          min: 10,
          max: 200,
          fallback: 60,
          suffix: '%',
        ),
        _buildSlider(
          'illustrationMobileRotation',
          'Rotación',
          min: -180,
          max: 180,
          suffix: '°',
        ),
      ],
    );
  }

  /// Labeled slider backed by _vals[key].
  Widget _buildSlider(
    String key,
    String label, {
    required double min,
    required double max,
    int fallback = 0,
    String suffix = 'px',
  }) {
    final val = _intVal(key, fallback);
    final clamped = val.toDouble().clamp(min, max);
    final colorScheme = Theme.of(context).colorScheme;

    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: Theme.of(context).textTheme.labelLarge),
              Text(
                '$val $suffix',
                style: Theme.of(context).textTheme.labelMedium?.copyWith(
                  color: colorScheme.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          Slider(
            value: clamped,
            min: min,
            max: max,
            divisions: (max - min).round(),
            onChanged: (v) => _setVal(key, v.round()),
          ),
        ],
      ),
    );
  }

  // ── Hero Preview ──────────────────────────────────────────────────────────

  // ── Hero Preview ──────────────────────────────────────────────────────────

  Widget _buildHeroPreview(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final theme = Theme.of(context);

    // Toolbar superior con controles de Dispositivo y Tema
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
                // Toggle Dark/Light Mode
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
                // Segmented Button para Devices
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

  // ── Form layout ──────────────────────────────────────────────────────────

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
              // ── Tablet: form izquierda + preview derecha ────────────
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
              // ── Mobile/medium: form + preview colapsable ────────────
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Preview colapsable en mobile
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
