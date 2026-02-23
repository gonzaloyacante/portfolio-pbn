import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:table_calendar/table_calendar.dart';

import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../../../shared/widgets/status_badge.dart';
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

    return Column(
      children: [
        // ── Filtro de estado ─────────────────────────────────────────────────
        _StatusFilterBar(
          current: _statusFilter,
          onSelected: (s) => setState(() => _statusFilter = s),
        ),
        // ── Calendario ───────────────────────────────────────────────────────
        Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
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
            ),
            headerStyle: const HeaderStyle(
              formatButtonVisible: false,
              titleCentered: true,
            ),
          ),
        ),
        // ── Lista del día seleccionado ────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
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
        ),
        const SizedBox(height: 8),
        Expanded(
          child: loading
              ? _buildShimmer()
              : dayItems.isEmpty
              ? _EmptyDay()
              : ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                  itemCount: dayItems.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 8),
                  itemBuilder: (_, i) => _BookingCard(dayItems[i]),
                ),
        ),
      ],
    );
  }

  Widget _buildShimmer() {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
      itemCount: 3,
      separatorBuilder: (_, _) => const SizedBox(height: 8),
      itemBuilder: (_, _) => ShimmerLoader(
        child: ShimmerBox(width: double.infinity, height: 80, borderRadius: 20),
      ),
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

// ── Filtro de estado ──────────────────────────────────────────────────────────

class _StatusFilterBar extends StatelessWidget {
  const _StatusFilterBar({required this.current, required this.onSelected});

  final String? current;
  final ValueChanged<String?> onSelected;

  static const _options = [
    ('Todos', null),
    ('Pendiente', 'PENDING'),
    ('Confirmado', 'CONFIRMED'),
    ('Completado', 'COMPLETED'),
    ('Cancelado', 'CANCELLED'),
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        children: _options
            .map(
              (o) => Padding(
                padding: const EdgeInsets.only(right: 8),
                child: FilterChip(
                  label: Text(o.$1),
                  selected: current == o.$2,
                  onSelected: (_) => onSelected(o.$2),
                ),
              ),
            )
            .toList(),
      ),
    );
  }
}

// ── Tarjeta de reserva ────────────────────────────────────────────────────────

class _BookingCard extends ConsumerWidget {
  const _BookingCard(this.booking);
  final BookingItem booking;

  AppStatus _toAppStatus(String s) {
    return switch (s) {
      'CONFIRMED' || 'COMPLETED' => AppStatus.active,
      'CANCELLED' || 'NO_SHOW' => AppStatus.inactive,
      _ => AppStatus.pending,
    };
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final timeStr =
        '${booking.date.hour.toString().padLeft(2, '0')}:'
        '${booking.date.minute.toString().padLeft(2, '0')}';

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: CircleAvatar(
          backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.12),
          child: Text(
            timeStr,
            style: theme.textTheme.labelSmall?.copyWith(
              color: theme.colorScheme.primary,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
        ),
        title: Text(
          booking.clientName,
          style: theme.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        subtitle: Text(
          booking.service?.name ?? 'Sin servicio',
          style: theme.textTheme.bodySmall,
        ),
        trailing: StatusBadge(
          status: _toAppStatus(booking.status),
          compact: true,
        ),
        onTap: () => context.pushNamed(
          RouteNames.bookingDetail,
          pathParameters: {'id': booking.id},
        ),
      ),
    );
  }
}

// ── Empty state ───────────────────────────────────────────────────────────────

class _EmptyDay extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.event_available,
            size: 48,
            color: Theme.of(context).colorScheme.outline,
          ),
          const SizedBox(height: 12),
          Text(
            'Sin reservas para este día',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).colorScheme.outline,
            ),
          ),
        ],
      ),
    );
  }
}
