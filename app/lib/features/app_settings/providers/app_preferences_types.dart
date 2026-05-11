// ── ViewMode ──────────────────────────────────────────────────────────────────

enum ViewMode { grid, list }

// ── AnimationSpeed ─────────────────────────────────────────────────────────────

/// Velocidad de las animaciones de la app.
///
/// [dilation] es el factor de [timeDilation]: menor que 1 más rápido, mayor más lento.
enum AnimationSpeed {
  fast(0.5, 'Rápidas'),
  normal(1.0, 'Normales'),
  slow(2.0, 'Lentas');

  const AnimationSpeed(this.dilation, this.label);

  final double dilation;
  final String label;
}

// ── Keys SharedPreferences ───────────────────────────────────────────────────

abstract final class AppPrefKeys {
  static const String servicesViewMode = 'pref_services_view_mode';
  static const String categoriesViewMode = 'pref_categories_view_mode';
  static const String categoryGalleryViewMode =
      'pref_category_gallery_view_mode';
  static const String testimonialsViewMode = 'pref_testimonials_view_mode';
  static const String animationsEnabled = 'pref_animations_enabled';
  static const String animationSpeed = 'pref_animation_speed';
  static const String compactMode = 'pref_compact_mode';
}
