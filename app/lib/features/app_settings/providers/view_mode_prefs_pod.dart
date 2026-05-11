import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'app_preferences_types.dart';
import 'shared_preferences_pod.dart';

part 'view_mode_prefs_pod.g.dart';

@riverpod
class ServicesViewMode extends _$ServicesViewMode {
  @override
  ViewMode build() {
    _load();
    return ViewMode.list;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getString(AppPrefKeys.servicesViewMode);
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
    await prefs.setString(AppPrefKeys.servicesViewMode, next.name);
  }
}

@riverpod
class CategoriesViewMode extends _$CategoriesViewMode {
  @override
  ViewMode build() {
    _load();
    return ViewMode.grid;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getString(AppPrefKeys.categoriesViewMode);
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
    await prefs.setString(AppPrefKeys.categoriesViewMode, next.name);
  }

  Future<void> set(ViewMode mode) async {
    state = mode;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setString(AppPrefKeys.categoriesViewMode, mode.name);
  }
}

@riverpod
class CategoryGalleryViewMode extends _$CategoryGalleryViewMode {
  @override
  ViewMode build() {
    _load();
    return ViewMode.list;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getString(AppPrefKeys.categoryGalleryViewMode);
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
    await prefs.setString(AppPrefKeys.categoryGalleryViewMode, next.name);
  }
}

@riverpod
class TestimonialsViewMode extends _$TestimonialsViewMode {
  @override
  ViewMode build() {
    _load();
    return ViewMode.list;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getString(AppPrefKeys.testimonialsViewMode);
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
    await prefs.setString(AppPrefKeys.testimonialsViewMode, next.name);
  }
}
