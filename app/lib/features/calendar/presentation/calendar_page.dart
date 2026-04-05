import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:table_calendar/table_calendar.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';

import 'widgets/booking_card.dart';
import 'widgets/empty_day.dart';
import '../../../core/router/route_names.dart';
import '../data/booking_model.dart';
import '../providers/calendar_provider.dart';
part 'calendar_page_builders.dart';

class CalendarPage extends ConsumerStatefulWidget {
  const CalendarPage({super.key});

  @override
  ConsumerState<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends ConsumerState<CalendarPage> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  DateTime get _monthStart => DateTime(_focusedDay.year, _focusedDay.month, 1);
  DateTime get _monthEnd =>
      DateTime(_focusedDay.year, _focusedDay.month + 1, 0, 23, 59, 59);

  String? _statusFilter;

  @override
  void initState() {
    super.initState();
    _selectedDay = DateTime.now();
  }

  // ── UI ─────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    final bookingsAsync = ref.watch(
      bookingsListProvider(
        dateFrom: _monthStart,
        dateTo: _monthEnd,
        status: _statusFilter,
      ),
    );

    return AppScaffold(
      title: 'Calendario',
      actions: [
        IconButton(
          icon: const Icon(Icons.refresh),
          tooltip: 'Actualizar',
          onPressed: () => ref.invalidate(bookingsListProvider),
        ),
        IconButton(
          icon: const Icon(Icons.add),
          tooltip: 'Nueva reserva',
          onPressed: () => context.pushNamed(RouteNames.bookingNew),
        ),
      ],
      body: bookingsAsync.when(
        loading: () => _buildContent(context, colorScheme, null, loading: true),
        error: (e, _) => ErrorState(
          message: e.toString(),
          onRetry: () => ref.invalidate(bookingsListProvider),
        ),
        data: (paged) => _buildContent(context, colorScheme, paged.data),
      ),
    );
  }
}
