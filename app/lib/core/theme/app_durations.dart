/// Duraciones de animación centralizadas — réplica del sistema web.
///
/// La web usa `duration-500` (500ms) como transición principal.
/// En la app usamos la misma escala para mantener paridad visual.
///
/// Uso:
/// ```dart
/// AnimatedContainer(duration: AppDurations.normal, ...)
/// AnimatedOpacity(duration: AppDurations.fast, ...)
/// ```
abstract final class AppDurations {
  AppDurations._();

  // ── Escala ───────────────────────────────────────────────────────────────

  /// Transiciones instantáneas (tooltips, badges).
  static const Duration fastest = Duration(milliseconds: 100);

  /// Transiciones rápidas (hover, focus).
  static const Duration fast = Duration(milliseconds: 200);

  /// Transiciones normales (cards, fade, expand).
  /// Equivale a `duration-300` de Tailwind.
  static const Duration normal = Duration(milliseconds: 300);

  /// Transiciones principales (page transitions, hero).
  /// Equivale a `duration-500` de Tailwind — token principal de la web.
  static const Duration slow = Duration(milliseconds: 500);

  /// Transiciones lentas (splash, intro).
  static const Duration slowest = Duration(milliseconds: 700);

  // ── Semánticos ───────────────────────────────────────────────────────────

  /// Transición por defecto para cards y contenedores.
  static const Duration card = normal;

  /// Transición para theme toggle light ⟷ dark.
  static const Duration themeSwitch = slow;

  /// Transición para page route animations.
  static const Duration pageTransition = slow;

  /// Transición para shimmer/skeleton loaders.
  static const Duration shimmer = Duration(milliseconds: 1500);
}
