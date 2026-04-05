part of 'calendar_page.dart';

extension _CalendarPageBuilders on _CalendarPageState {
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
              _selectedDay != null && isSameDay(d, _selectedDay),
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
        : (bookings?.isEmpty ?? false)
        ? ListView(
            physics: const AlwaysScrollableScrollPhysics(),
            children: const [
              EmptyState(
                icon: Icons.calendar_today_outlined,
                title: 'Sin reservas',
                subtitle: 'No hay reservas en el período seleccionado',
              ),
            ],
          )
        : dayItems.isEmpty
        ? ListView(
            physics: const AlwaysScrollableScrollPhysics(),
            children: const [EmptyDay()],
          )
        : ListView.separated(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: EdgeInsets.fromLTRB(hPad, 0, hPad, AppSpacing.xl),
            itemCount: dayItems.length,
            separatorBuilder: (_, _) => const SizedBox(height: 8),
            itemBuilder: (_, i) =>
                RepaintBoundary(child: BookingCard(dayItems[i])),
          );
    final refreshedDayList = RefreshIndicator(
      onRefresh: () async => ref.invalidate(bookingsListProvider),
      child: dayListContent,
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
                Expanded(child: refreshedDayList),
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
        Expanded(child: refreshedDayList),
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
