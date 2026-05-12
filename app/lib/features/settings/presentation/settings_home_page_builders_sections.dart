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

  // ── Immersive backdrop (paridad web HeroBackdropPropertyEditor) ───────────

  Widget _buildImmersiveSection() {
    final cs = Theme.of(context).colorScheme;

    return SettingsFormCard(
      title: 'Fondo inmersivo',
      leadingIcon: Icons.wallpaper_outlined,
      children: [
        Text(
          'Imagen, GIF o vídeo detrás del contenido (sin parallax). '
          'URL vídeo Cloudinary o .mp4 pegado; poster opcional.',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: cs.onSurface.withValues(alpha: 0.65),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Hero inmersivo'),
          subtitle: const Text(
            'Medio a pantalla detrás del hero y bajo la barra (como la web)',
          ),
          value: (_vals['heroImmersiveEnabled'] as bool?) ?? true,
          onChanged: (v) => _rebuild(() {
            _vals['heroImmersiveEnabled'] = v;
            _isDirty = true;
          }),
        ),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Mostrar retrato en columna'),
          subtitle: const Text(
            'Desactivar si el retrato va solo en el vídeo/GIF de fondo',
          ),
          value: (_vals['heroForegroundPortraitShow'] as bool?) ?? true,
          onChanged: (v) => _rebuild(() {
            _vals['heroForegroundPortraitShow'] = v;
            _isDirty = true;
          }),
        ),
        const Divider(height: AppSpacing.lg),
        DropdownButtonFormField<String>(
          value: _strVal('heroBackdropMediaKind', 'auto'),
          decoration: const InputDecoration(
            labelText: 'Tipo de medio',
            prefixIcon: Icon(Icons.perm_media_outlined),
          ),
          items: const [
            DropdownMenuItem(value: 'auto', child: Text('Auto (detectar)')),
            DropdownMenuItem(value: 'image', child: Text('Imagen / GIF')),
            DropdownMenuItem(value: 'video', child: Text('Vídeo')),
          ],
          onChanged: (v) => _setVal('heroBackdropMediaKind', v),
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ctrl('heroBackdropUrl'),
          decoration: const InputDecoration(
            labelText: 'URL del medio (Cloudinary o pegar .mp4)',
            hintText: 'https://res.cloudinary.com/…',
            prefixIcon: Icon(Icons.link_rounded),
          ),
          keyboardType: TextInputType.url,
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ctrl('heroBackdropPosterUrl'),
          decoration: const InputDecoration(
            labelText: 'Poster del vídeo (opcional)',
            hintText: 'URL imagen',
            prefixIcon: Icon(Icons.image_outlined),
          ),
          keyboardType: TextInputType.url,
        ),
        const SizedBox(height: AppSpacing.md),
        Wrap(
          spacing: AppSpacing.md,
          runSpacing: AppSpacing.sm,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            FilterChip(
              label: const Text('Loop'),
              selected: (_vals['heroBackdropLoop'] as bool?) ?? true,
              onSelected: (v) => _setVal('heroBackdropLoop', v),
            ),
            FilterChip(
              label: const Text('Silenciado'),
              selected: (_vals['heroBackdropMuted'] as bool?) ?? true,
              onSelected: (v) => _setVal('heroBackdropMuted', v),
            ),
            FilterChip(
              label: const Text('Inline iOS'),
              selected: (_vals['heroBackdropPlaysInline'] as bool?) ?? true,
              onSelected: (v) => _setVal('heroBackdropPlaysInline', v),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        DropdownButtonFormField<String>(
          value: _strVal('heroBackdropObjectFit', 'cover'),
          decoration: const InputDecoration(
            labelText: 'Ajuste del medio',
            prefixIcon: Icon(Icons.aspect_ratio_outlined),
          ),
          items: const [
            DropdownMenuItem(value: 'cover', child: Text('Cubrir (cover)')),
            DropdownMenuItem(
              value: 'contain',
              child: Text('Contener (contain)'),
            ),
          ],
          onChanged: (v) => _setVal('heroBackdropObjectFit', v),
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ctrl('heroBackdropObjectPosition'),
          decoration: const InputDecoration(
            labelText: 'Posición (object-position)',
            hintText: 'center / 50% 20%',
            prefixIcon: Icon(Icons.center_focus_strong_outlined),
          ),
        ),
        const Divider(height: AppSpacing.xl),
        Text(
          'Overrides móvil',
          style: Theme.of(
            context,
          ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: AppSpacing.sm),
        TextFormField(
          controller: _ctrl('heroBackdropMobileUrl'),
          decoration: const InputDecoration(
            labelText: 'Fondo distinto en móvil (opcional)',
            prefixIcon: Icon(Icons.smartphone_outlined),
          ),
          keyboardType: TextInputType.url,
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ctrl('heroBackdropMobileObjectPosition'),
          decoration: const InputDecoration(
            labelText: 'Posición en móvil (vacío = mismo que escritorio)',
            prefixIcon: Icon(Icons.phone_android_outlined),
          ),
        ),
        const Divider(height: AppSpacing.xl),
        Text(
          'Degradado lateral (legibilidad)',
          style: Theme.of(
            context,
          ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: AppSpacing.sm),
        DropdownButtonFormField<String>(
          value: _strVal('heroScrimEdge', 'left'),
          decoration: const InputDecoration(
            labelText: 'Dirección',
            prefixIcon: Icon(Icons.gradient_outlined),
          ),
          items: const [
            DropdownMenuItem(value: 'left', child: Text('Izquierda → derecha')),
            DropdownMenuItem(
              value: 'right',
              child: Text('Derecha → izquierda'),
            ),
            DropdownMenuItem(value: 'both', child: Text('Ambos lados')),
            DropdownMenuItem(
              value: 'none',
              child: Text('Sin degradado lateral'),
            ),
          ],
          onChanged: (v) => _setVal('heroScrimEdge', v),
        ),
        const SizedBox(height: AppSpacing.sm),
        _buildSlider(
          'heroScrimExtentPercent',
          'Alcance (% del ancho)',
          min: 5,
          max: 100,
          fallback: 45,
          suffix: '%',
        ),
        _buildSlider(
          'heroScrimMobileExtentPercent',
          'Alcance móvil (opcional)',
          min: 5,
          max: 100,
          fallback: _intVal('heroScrimExtentPercent', 45),
          suffix: '%',
        ),
        _buildSlider(
          'heroScrimOpacity',
          'Opacidad máxima en el borde',
          min: 0,
          max: 100,
          fallback: 80,
          suffix: '%',
        ),
        _buildSlider(
          'heroScrimMobileOpacity',
          'Opacidad borde móvil (opcional)',
          min: 0,
          max: 100,
          fallback: _intVal('heroScrimOpacity', 80),
          suffix: '%',
        ),
        _buildSlider(
          'heroScrimFeatherPercent',
          'Suavidad del degradado',
          min: 0,
          max: 100,
          fallback: 50,
          suffix: '%',
        ),
        _buildSlider(
          'heroBackdropTintOpacity',
          'Tinte oscuro uniforme',
          min: 0,
          max: 100,
          fallback: 0,
          suffix: '%',
        ),
        const SizedBox(height: AppSpacing.sm),
        ColorPickerField(
          controller: _ctrl('heroScrimColor'),
          label: 'Color degradado (claro)',
        ),
        const SizedBox(height: AppSpacing.sm),
        ColorPickerField(
          controller: _ctrl('heroScrimColorDark'),
          label: 'Color degradado (oscuro)',
        ),
      ],
    );
  }
}
