part of 'booking_detail_page.dart';

extension _BookingDetailPageBuilders on _BookingDetailPageState {
  Widget _buildContent(BuildContext context) {
    final async = ref.watch(bookingDetailProvider(widget.bookingId));

    return LoadingOverlay(
      isLoading: _saving,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
            tooltip: 'Volver',
          ),
          title: const Text('Detalle de reserva'),
          centerTitle: false,
          actions: [
            IconButton(
              icon: const Icon(Icons.edit_outlined),
              tooltip: 'Editar',
              onPressed: () => context.pushNamed(
                RouteNames.bookingEdit,
                pathParameters: {'id': widget.bookingId},
              ),
            ),
            IconButton(
              icon: const Icon(Icons.delete_outline),
              tooltip: 'Eliminar',
              onPressed: _delete,
            ),
            IconButton(
              icon: const Icon(Icons.save_outlined),
              tooltip: 'Guardar',
              onPressed: _save,
            ),
          ],
        ),
        body: async.when(
          loading: () =>
              const SkeletonSettingsPage(cardCount: 3, fieldsPerCard: 3),
          error: (e, _) => ErrorState(
            message: e.toString(),
            onRetry: () =>
                ref.invalidate(bookingDetailProvider(widget.bookingId)),
          ),
          data: (detail) {
            _populate(detail);
            return _buildDetail(context, detail);
          },
        ),
      ),
    );
  }

  Widget _buildDetail(BuildContext context, BookingDetail detail) {
    final theme = Theme.of(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Cabecera ──────────────────────────────────────────────────────
          SectionCard(
            children: [
              InfoRow(
                icon: Icons.person_outline,
                label: 'Cliente',
                value: detail.clientName,
              ),
              InfoRow(
                icon: Icons.email_outlined,
                label: 'Email',
                value: detail.clientEmail,
              ),
              if (detail.clientPhone != null)
                InfoRow(
                  icon: Icons.phone_outlined,
                  label: 'Teléfono',
                  value: detail.clientPhone!,
                ),
              if (detail.guestCount > 0)
                InfoRow(
                  icon: Icons.people_outline,
                  label: 'Asistentes',
                  value: '${detail.guestCount}',
                ),
            ],
          ),
          const SizedBox(height: 12),
          // ── Servicio y fecha ──────────────────────────────────────────────
          SectionCard(
            children: [
              InfoRow(
                icon: Icons.design_services_outlined,
                label: 'Servicio',
                value: detail.service?.name ?? '—',
              ),
              InfoRow(
                icon: Icons.calendar_today_outlined,
                label: 'Fecha',
                value: _formatDate(detail.date),
              ),
              if (detail.endDate != null)
                InfoRow(
                  icon: Icons.schedule_outlined,
                  label: 'Fin',
                  value: _formatDate(detail.endDate!),
                ),
            ],
          ),
          const SizedBox(height: 12),
          // ── Pago ─────────────────────────────────────────────────────────
          SectionCard(
            title: 'Pago',
            children: [
              InfoRow(
                icon: Icons.euro_outlined,
                label: 'Total',
                value: detail.totalAmount != null
                    ? '${currencySymbol(null)}${detail.totalAmount}'
                    : '—',
              ),
              InfoRow(
                icon: Icons.paid_outlined,
                label: 'Pagado',
                value: detail.paidAmount != null
                    ? '${currencySymbol(null)}${detail.paidAmount}'
                    : '—',
              ),
              InfoRow(
                icon: Icons.receipt_outlined,
                label: 'Estado pago',
                value: _paymentLabel(detail.paymentStatus),
              ),
              if (detail.paymentMethod != null)
                InfoRow(
                  icon: Icons.credit_card_outlined,
                  label: 'Método',
                  value: detail.paymentMethod!,
                ),
            ],
          ),
          const SizedBox(height: 12),
          // ── Estado ────────────────────────────────────────────────────────
          AppCard(
            borderRadius: BorderRadius.circular(20),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Estado de la reserva',
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _kStatuses
                      .map(
                        (s) => ChoiceChip(
                          label: Text(s.$1),
                          selected: _status == s.$2,
                          onSelected: (_) => _rebuild(() => _status = s.$2),
                        ),
                      )
                      .toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          // ── Notas admin ───────────────────────────────────────────────────
          AppCard(
            borderRadius: BorderRadius.circular(20),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Notas internas',
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _notesController,
                  maxLines: 4,
                  decoration: const InputDecoration(
                    hintText: 'Añade notas internas sobre esta reserva…',
                    border: OutlineInputBorder(),
                  ),
                ),
              ],
            ),
          ),
          if (detail.clientNotes != null && detail.clientNotes!.isNotEmpty) ...[
            const SizedBox(height: 12),
            SectionCard(
              title: 'Notas del cliente',
              children: [
                Text(detail.clientNotes!, style: theme.textTheme.bodyMedium),
              ],
            ),
          ],
          const SizedBox(height: 24),
          // ── Botón guardar ─────────────────────────────────────────────────
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: _save,
              icon: const Icon(Icons.save_outlined),
              label: const Text('Guardar cambios'),
            ),
          ),
          const SizedBox(height: 12),
          // ── Google Calendar ───────────────────────────────────────────────
          GoogleCalendarSection(bookingDetail: detail),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  String _formatDate(DateTime d) {
    const months = [
      '',
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ];
    final h = d.hour.toString().padLeft(2, '0');
    final m = d.minute.toString().padLeft(2, '0');
    return '${d.day} ${months[d.month]} ${d.year}  $h:$m';
  }

  String _paymentLabel(String? s) => switch (s) {
    'PAID' => 'Pagado',
    'PARTIALLY_PAID' => 'Parcialmente pagado',
    'REFUNDED' => 'Reembolsado',
    _ => 'Pendiente',
  };

  static const _kStatuses = [
    ('Pendiente', 'PENDING'),
    ('Confirmado', 'CONFIRMED'),
    ('En curso', 'IN_PROGRESS'),
    ('Completado', 'COMPLETED'),
    ('Cancelado', 'CANCELLED'),
    ('No presentó', 'NO_SHOW'),
  ];
}
