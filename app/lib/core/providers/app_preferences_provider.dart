import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'app_preferences_provider.g.dart';

// ── Keys ─────────────────────────────────────────────────────────────────────

abstract class _PrefKeys {
  static const String projectsViewMode = 'pref_projects_view_mode';
  static const String servicesViewMode = 'pref_services_view_mode';
}

// ── ViewMode enum ─────────────────────────────────────────────────────────────

enum ViewMode { grid, list }

// ── SharedPreferences singleton ───────────────────────────────────────────────

@Riverpod(keepAlive: true)
Future<SharedPreferences> sharedPreferences(Ref ref) => SharedPreferences.getInstance();

// ── ViewMode providers ────────────────────────────────────────────────────────

/// Vista seleccionada para la lista de proyectos (grid o list).
@riverpod
class ProjectsViewMode extends _$ProjectsViewMode {
  @override
  ViewMode build() {
    _load();
    return ViewMode.grid;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getString(_PrefKeys.projectsViewMode);
    if (stored != null) {
      state = ViewMode.values.firstWhere((e) => e.name == stored, orElse: () => ViewMode.grid);
    }
  }

  Future<void> toggle() async {
    final next = state == ViewMode.grid ? ViewMode.list : ViewMode.grid;
    state = next;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setString(_PrefKeys.projectsViewMode, next.name);
  }

  Future<void> set(ViewMode mode) async {
    state = mode;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setString(_PrefKeys.projectsViewMode, mode.name);
  }
}

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
      state = ViewMode.values.firstWhere((e) => e.name == stored, orElse: () => ViewMode.list);
    }
  }

  Future<void> toggle() async {
    final next = state == ViewMode.grid ? ViewMode.list : ViewMode.grid;
    state = next;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setString(_PrefKeys.servicesViewMode, next.name);
  }
}
