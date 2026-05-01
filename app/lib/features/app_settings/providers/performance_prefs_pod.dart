import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'app_preferences_types.dart';
import 'shared_preferences_pod.dart';

part 'performance_prefs_pod.g.dart';

@Riverpod(keepAlive: true)
class AnimationsEnabled extends _$AnimationsEnabled {
  @override
  bool build() {
    _load();
    return true;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getBool(AppPrefKeys.animationsEnabled);
    if (stored != null) state = stored;
  }

  Future<void> set(bool value) async {
    state = value;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setBool(AppPrefKeys.animationsEnabled, value);
  }

  Future<void> toggle() => set(!state);
}

@Riverpod(keepAlive: true)
class AnimationSpeedPref extends _$AnimationSpeedPref {
  @override
  AnimationSpeed build() {
    _load();
    return AnimationSpeed.normal;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getString(AppPrefKeys.animationSpeed);
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
    await prefs.setString(AppPrefKeys.animationSpeed, speed.name);
  }
}

@Riverpod(keepAlive: true)
class CompactMode extends _$CompactMode {
  @override
  bool build() {
    _load();
    return false;
  }

  Future<void> _load() async {
    final prefs = await ref.read(sharedPreferencesProvider.future);
    final stored = prefs.getBool(AppPrefKeys.compactMode);
    if (stored != null) state = stored;
  }

  Future<void> set(bool value) async {
    state = value;
    final prefs = await ref.read(sharedPreferencesProvider.future);
    await prefs.setBool(AppPrefKeys.compactMode, value);
  }

  Future<void> toggle() => set(!state);
}
