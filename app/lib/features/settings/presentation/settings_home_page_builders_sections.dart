part of 'settings_home_page.dart';

extension _SettingsHomeSections on _SettingsHomePageState {
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
}
