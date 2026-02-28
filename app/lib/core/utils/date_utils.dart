import 'package:intl/intl.dart';

/// Utilidades de formateo de fechas en español.
class AppDateUtils {
  AppDateUtils._();

  static final DateFormat _fullDate = DateFormat("d 'de' MMMM 'de' yyyy", 'es');
  static final DateFormat _shortDate = DateFormat('dd/MM/yyyy', 'es');
  static final DateFormat _shortDateTime = DateFormat('dd/MM/yyyy HH:mm', 'es');
  static final DateFormat _timeOnly = DateFormat('HH:mm', 'es');
  static final DateFormat _monthYear = DateFormat("MMMM 'de' yyyy", 'es');

  /// "22 de febrero de 2026"
  static String toFullDate(DateTime date) => _fullDate.format(date);

  /// "22/02/2026"
  static String toShortDate(DateTime date) => _shortDate.format(date);

  /// "22/02/2026 14:30"
  static String toShortDateTime(DateTime date) => _shortDateTime.format(date);

  /// "14:30"
  static String toTimeOnly(DateTime date) => _timeOnly.format(date);

  /// "febrero de 2026"
  static String toMonthYear(DateTime date) => _monthYear.format(date);

  /// Texto relativo: "hace 5 minutos", "ayer", "hace 3 días"
  static String toRelative(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inSeconds < 60) return 'hace un momento';
    if (diff.inMinutes < 60) {
      return 'hace ${diff.inMinutes} minuto${diff.inMinutes == 1 ? '' : 's'}';
    }
    if (diff.inHours < 24) {
      return 'hace ${diff.inHours} hora${diff.inHours == 1 ? '' : 's'}';
    }
    if (diff.inDays == 1) return 'ayer';
    if (diff.inDays < 7) return 'hace ${diff.inDays} días';
    if (diff.inDays < 30) {
      return 'hace ${(diff.inDays / 7).floor()} semana${(diff.inDays / 7).floor() == 1 ? '' : 's'}';
    }
    if (diff.inDays < 365) {
      return 'hace ${(diff.inDays / 30).floor()} mes${(diff.inDays / 30).floor() == 1 ? '' : 'es'}';
    }
    return 'hace ${(diff.inDays / 365).floor()} año${(diff.inDays / 365).floor() == 1 ? '' : 's'}';
  }

  /// Rango de tiempo para un evento: "14:00 – 15:30"
  static String toTimeRange(DateTime start, DateTime end) => '${toTimeOnly(start)} – ${toTimeOnly(end)}';
}
