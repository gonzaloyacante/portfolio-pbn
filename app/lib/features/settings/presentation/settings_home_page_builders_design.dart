part of 'settings_home_page.dart';

/// Helpers reutilizables (tipografía, sliders, bloques posición/móvil).
extension _SettingsHomeDesignHelpers on _SettingsHomePageState {
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
}
