part of 'settings_home_page.dart';

extension _SettingsHomeLayout on _SettingsHomePageState {
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
}
