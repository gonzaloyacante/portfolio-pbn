import 'package:flutter/material.dart';

// Patrón compilado una sola vez para toda la app
// ignore: deprecated_member_use
final _emailRegex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');

/// Extensions de Dart/Flutter usadas en toda la app.
extension StringExtensions on String {
  String get capitalize => isEmpty ? this : '${this[0].toUpperCase()}${substring(1)}';

  String get titleCase => split(' ').map((word) => word.capitalize).join(' ');

  bool get isValidEmail => _emailRegex.hasMatch(this);

  /// Trunca con elipsis si supera [maxLength].
  String truncate(int maxLength) => length <= maxLength ? this : '${substring(0, maxLength)}…';
}

extension NullableStringExtensions on String? {
  bool get isNullOrEmpty => this == null || this!.isEmpty;
  bool get isNotNullOrEmpty => !isNullOrEmpty;
}

extension DateTimeExtensions on DateTime {
  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }

  bool get isYesterday {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return year == yesterday.year && month == yesterday.month && day == yesterday.day;
  }

  DateTime get startOfDay => DateTime(year, month, day);
  DateTime get endOfDay => DateTime(year, month, day, 23, 59, 59, 999);
}

extension BuildContextExtensions on BuildContext {
  ThemeData get theme => Theme.of(this);
  TextTheme get textTheme => Theme.of(this).textTheme;
  ColorScheme get colorScheme => Theme.of(this).colorScheme;
  Size get screenSize => MediaQuery.sizeOf(this);
  double get screenWidth => screenSize.width;
  double get screenHeight => screenSize.height;
  bool get isTablet => screenWidth >= 768;
  bool get isMobile => screenWidth < 768;

  void showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Theme.of(this).colorScheme.error : Theme.of(this).colorScheme.primary,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}

extension ListExtensions<T> on List<T> {
  /// Retorna null si la lista está vacía.
  T? get firstOrNull => isEmpty ? null : first;

  /// Retorna null si el índice está fuera de rango.
  T? tryGet(int index) => (index >= 0 && index < length) ? this[index] : null;
}
