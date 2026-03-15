import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:table_calendar/table_calendar.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_filter_chips.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';

import '../../../shared/widgets/app_card.dart';
import 'widgets/booking_card.dart';
import 'widgets/empty_day.dart';
import '../../../core/router/route_names.dart';
import '../data/booking_model.dart';
import '../providers/calendar_provider.dart';

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

  Widget _buildContent(
    BuildContext context,
    ColorScheme colorScheme,
    List<BookingItem>? bookings, {
    bool loading = false,
  }) {
    // Agrupar reservas por día — "yyyy-MM-dd" → list<BookingItem>
    final Map<String, List<BookingItem>> eventMap = {};
    if (bookings != null) {
      for (final b in bookings) {
        final key =
            '${b.date.year}-${b.date.month.toString().padLeft(2, '0')}-${b.date.day.toString().padLeft(2, '0')}';
        eventMap.putIfAbsent(key, () => []).add(b);
      }
    }

    List<BookingItem> dayBookings(DateTime day) {
      final key =
          '${day.year}-${day.month.toString().padLeft(2, '0')}-${day.day.toString().padLeft(2, '0')}';
      return eventMap[key] ?? [];
    }

    final selected = _selectedDay ?? _focusedDay;
    final dayItems = dayBookings(selected);
    final hPad = AppBreakpoints.pageMargin(context);
    final isExpanded = AppBreakpoints.isExpanded(context);

    const filterOptions = <String?>[
      null,
      'PENDING',
      'CONFIRMED',
      'COMPLETED',
      'CANCELLED',
    ];
    final filterBar = AppFilterChips<String?>(
      options: filterOptions,
      selected: _statusFilter,
      labelBuilder: (s) => switch (s) {
        null => 'Todos',
        'PENDING' => 'Pendiente',
        'CONFIRMED' => 'Confirmado',
        'COMPLETED' => 'Completado',
        'CANCELLED' => 'Cancelado',
        _ => s,
      },
      onSelected: (s) => setState(() => _statusFilter = s),
    );

    final calendarCard = Padding(
      padding: EdgeInsets.symmetric(horizontal: hPad, vertical: AppSpacing.xs),
      child: AppCard(
        borderRadius: AppRadius.forCard,
        padding: EdgeInsets.zero,
        child: TableCalendar<BookingItem>(
          locale: 'es_ES',
          firstDay: DateTime(2020),
          lastDay: DateTime(2030),
          focusedDay: _focusedDay,
          selectedDayPredicate: (d) =>
              _selectedDay != null && isSameDay(d, _selectedDay!),
          onDaySelected: (selected, focused) {
            setState(() {
              _selectedDay = selected;
              _focusedDay = focused;
            });
          },
          onPageChanged: (focused) {
            setState(() {
              _focusedDay = focused;
              _selectedDay = null;
            });
            ref.invalidate(bookingsListProvider);
          },
          eventLoader: dayBookings,
          calendarStyle: CalendarStyle(
            markerDecoration: BoxDecoration(
              color: colorScheme.primary,
              shape: BoxShape.circle,
            ),
            selectedDecoration: BoxDecoration(
              color: colorScheme.primary,
              shape: BoxShape.circle,
            ),
            todayDecoration: BoxDecoration(
              color: colorScheme.primary.withValues(alpha: 0.35),
              shape: BoxShape.circle,
            ),
            outsideDaysVisible: false,
          ),
          headerStyle: const HeaderStyle(
            formatButtonVisible: false,
            titleCentered: true,
            leftChevronIcon: Icon(Icons.chevron_left_rounded),
            rightChevronIcon: Icon(Icons.chevron_right_rounded),
          ),
        ),
      ),
    );

    final dayHeader = Padding(
      padding: EdgeInsets.symmetric(horizontal: hPad),
      child: Row(
        children: [
          Text(
            _dayLabel(selected),
            style: Theme.of(
              context,
            ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(width: 8),
          if (!loading)
            Text(
              '${dayItems.length} reserva${dayItems.length == 1 ? '' : 's'}',
              style: Theme.of(
                context,
              ).textTheme.bodySmall?.copyWith(color: colorScheme.outline),
            ),
        ],
      ),
    );
    final dayListContent = loading
        ? const SkeletonCalendarList()
        : dayItems.isEmpty
        ? EmptyDay()
        : ListView.separated(
            padding: EdgeInsets.fromLTRB(hPad, 0, hPad, AppSpacing.xl),
            itemCount: dayItems.length,
            separatorBuilder: (_, _) => const SizedBox(height: 8),
            itemBuilder: (_, i) => BookingCard(dayItems[i]),
          );

    if (isExpanded) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 360,
            child: Column(
              children: [
                Padding(
                  padding: EdgeInsets.fromLTRB(hPad, AppSpacing.sm, hPad, 0),
                  child: filterBar,
                ),
                calendarCard,
              ],
            ),
          ),
          const VerticalDivider(width: 1, thickness: 1),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: AppSpacing.base),
                dayHeader,
                const SizedBox(height: AppSpacing.sm),
                Expanded(child: dayListContent),
              ],
            ),
          ),
        ],
      );
    }

    return Column(
      children: [
        Padding(
          padding: EdgeInsets.fromLTRB(hPad, AppSpacing.sm, hPad, 0),
          child: filterBar,
        ),
        calendarCard,
        const SizedBox(height: AppSpacing.sm),
        dayHeader,
        const SizedBox(height: AppSpacing.sm),
        Expanded(child: dayListContent),
      ],
    );
  }

  String _dayLabel(DateTime d) {
    const months = [
      '',
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    return '${d.day} de ${months[d.month]}';
  }
}
