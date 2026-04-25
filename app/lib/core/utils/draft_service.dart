import 'dart:async';
import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'draft_service.g.dart';

/// Persists form drafts in SharedPreferences so the user can resume
/// editing after the app crashes or is backgrounded.
///
/// Key format : `form_draft__{scope}` (e.g. `form_draft__category_new`)
/// Drafts expire automatically after [_maxAgeDays] days.
class DraftService {
  static const _prefix = 'form_draft__';
  static const _maxAgeDays = 7;

  /// Saves [data] under [scope].
  Future<void> save(String scope, Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    final envelope = {
      'savedAt': DateTime.now().toIso8601String(),
      'data': data,
    };
    await prefs.setString('$_prefix$scope', jsonEncode(envelope));
  }

  /// Returns the saved draft for [scope], or `null` when absent / expired.
  Future<Map<String, dynamic>?> load(String scope) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('$_prefix$scope');
    if (raw == null) return null;
    try {
      final envelope = jsonDecode(raw) as Map<String, dynamic>;
      final savedAt = DateTime.tryParse(envelope['savedAt'] as String? ?? '');
      if (savedAt == null ||
          DateTime.now().difference(savedAt).inDays > _maxAgeDays) {
        await clear(scope);
        return null;
      }
      return envelope['data'] as Map<String, dynamic>?;
    } catch (_) {
      await clear(scope);
      return null;
    }
  }

  /// Returns `true` when a non-expired draft exists for [scope].
  Future<bool> hasDraft(String scope) async {
    final data = await load(scope);
    return data != null;
  }

  /// Removes the draft for [scope].
  Future<void> clear(String scope) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('$_prefix$scope');
  }
}

@Riverpod(keepAlive: true)
DraftService draftService(Ref ref) => DraftService();
