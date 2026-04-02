import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'app_preferences_provider.g.dart';

// ── Keys ─────────────────────────────────────────────────────────────────────

abstract class _PrefKeys {
  static const String servicesViewMode = 'pref_services_view_mode';
  static const String categoriesViewMode = 'pref_categories_view_mode';
  static const String categoryGalleryViewMode =
      'pref_category_gallery_view_mode';
  static const String testimonialsViewMode = 'pref_testimonials_view_mode';
  // Performance
  static const String animationsEnabled = 'pref_animations_enabled';
  static const String animationSpeed = 'pref_animation_speed';
  static const String compactMode = 'pref_compact_mode';
}

// ── ViewMode enum ─────────────────────────────────────────────────────────────

enum ViewMode { grid, list }

// ── AnimationSpeed enum ───────────────────────────────────────────────────────

/// Velocidad de las animaciones de la app.
///
/// El valor [dilation] es el factor aplicado a [timeDilation]:
/// < 1 → más rápido, > 1 → más lento, 1 → velocidad estándar de Flutter.
enum AnimationSpeed {
  fast(0.5, 'Rápidas'),
  normal(1.0, 'Normales'),
  slow(2.0, 'Lentas');

  const AnimationSpeed(this.dilation, this.label);

  /// Factor de dilatación para [schedulerBinding.timeDilation].
  final double dilation;

  /// Etiqueta legible para mostrar en la UI.
  final String label;
}

// ── SharedPreferences singleton ───────────────────────────────────────────────

@Riverpod(keepAlive: true)
Future<SharedPreferences> sharedPreferences(Ref ref) =>
    SharedPreferences.getInstance();

// ── ViewMode providers ────────────────────────────────────────────────────────

/// Vista seleccionada para la lista de servicios (grid o list).
@riverpod
class ServicesViewMode extends _$ServicesViewMode {
  @override
  ViewMode build() {
    _load();
    return ViewMode.list;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getString(_PrefKeys.servicesViewMode);
    if (stored != null) {
      state = ViewMode.values.firstWhere(
        (e) => e.name == stored,
        orElse: () => ViewMode.list,
      );
    }
  }

  Future<void> toggle() async {
    final next = state == ViewMode.grid ? ViewMode.list : ViewMode.grid;
    state = next;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setString(_PrefKeys.servicesViewMode, next.name);
  }
}

/// Vista seleccionada para la lista de categorías (grid o list).
@riverpod
class CategoriesViewMode extends _$CategoriesViewMode {
  @override
  ViewMode build() {
    _load();
    return ViewMode.grid;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getString(_PrefKeys.categoriesViewMode);
    if (stored != null) {
      state = ViewMode.values.firstWhere(
        (e) => e.name == stored,
        orElse: () => ViewMode.grid,
      );
    }
  }

  Future<void> toggle() async {
    final next = state == ViewMode.grid ? ViewMode.list : ViewMode.grid;
    state = next;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setString(_PrefKeys.categoriesViewMode, next.name);
  }

  Future<void> set(ViewMode mode) async {
    state = mode;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setString(_PrefKeys.categoriesViewMode, mode.name);
  }
}

/// Vista seleccionada para la galería de imágenes de una categoría (grid o list).
@riverpod
class CategoryGalleryViewMode extends _$CategoryGalleryViewMode {
  @override
  ViewMode build() {
    _load();
    return ViewMode.list;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getString(_PrefKeys.categoryGalleryViewMode);
    if (stored != null) {
      state = ViewMode.values.firstWhere(
        (e) => e.name == stored,
        orElse: () => ViewMode.list,
      );
    }
  }

  Future<void> toggle() async {
    final next = state == ViewMode.grid ? ViewMode.list : ViewMode.grid;
    state = next;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setString(_PrefKeys.categoryGalleryViewMode, next.name);
  }
}

/// Vista seleccionada para la lista de testimonios (grid o list).
@riverpod
class TestimonialsViewMode extends _$TestimonialsViewMode {
  @override
  ViewMode build() {
    _load();
    return ViewMode.list;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getString(_PrefKeys.testimonialsViewMode);
    if (stored != null) {
      state = ViewMode.values.firstWhere(
        (e) => e.name == stored,
        orElse: () => ViewMode.list,
      );
    }
  }

  Future<void> toggle() async {
    final next = state == ViewMode.grid ? ViewMode.list : ViewMode.grid;
    state = next;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setString(_PrefKeys.testimonialsViewMode, next.name);
  }
}

// ── Performance providers ─────────────────────────────────────────────────────

/// Habilita o deshabilita todas las animaciones de la app.
///
/// Cuando está en `false` se usa un [timeDilation] próximo a cero y
/// [MediaQueryData.disableAnimations] = true, lo que detiene todos los
/// cursores, transiciones y efectos shimmer.
@Riverpod(keepAlive: true)
class AnimationsEnabled extends _$AnimationsEnabled {
  @override
  bool build() {
    _load();
    return true;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getBool(_PrefKeys.animationsEnabled);
    if (stored != null) state = stored;
  }

  Future<void> set(bool value) async {
    state = value;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setBool(_PrefKeys.animationsEnabled, value);
  }

  Future<void> toggle() => set(!state);
}

/// Velocidad global de las animaciones cuando están habilitadas.
///
/// Se mapea a [timeDilation] para ralentizar o acelerar todas las
/// animaciones de Flutter sin tocar cada widget individualmente.
@Riverpod(keepAlive: true)
class AnimationSpeedPref extends _$AnimationSpeedPref {
  @override
  AnimationSpeed build() {
    _load();
    return AnimationSpeed.normal;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getString(_PrefKeys.animationSpeed);
    if (stored != null) {
      state = AnimationSpeed.values.firstWhere(
        (e) => e.name == stored,
        orElse: () => AnimationSpeed.normal,
      );
    }
  }

  Future<void> set(AnimationSpeed speed) async {
    state = speed;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setString(_PrefKeys.animationSpeed, speed.name);
  }
}

/// Modo compacto: reduce la densidad visual (padding, altura de tiles).
///
/// Útil en dispositivos con pantallas pequeñas o para usuarios que
/// prefieren ver más contenido sin hacer scroll.
@Riverpod(keepAlive: true)
class CompactMode extends _$CompactMode {
  @override
  bool build() {
    _load();
    return false;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getBool(_PrefKeys.compactMode);
    if (stored != null) state = stored;
  }

  Future<void> set(bool value) async {
    state = value;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setBool(_PrefKeys.compactMode, value);
  }

  Future<void> toggle() => set(!state);
}
