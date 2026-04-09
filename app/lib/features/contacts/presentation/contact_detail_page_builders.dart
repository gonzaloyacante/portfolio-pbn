part of 'contact_detail_page.dart';

extension _ContactDetailPageBuilders on _ContactDetailPageState {
  Widget _buildContent(BuildContext context) {
    final async = ref.watch(contactDetailProvider(widget.contactId));
    final isImportant = async.value?.isImportant ?? false;

    return LoadingOverlay(
      isLoading: _loading,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
            tooltip: 'Volver',
          ),
          title: const Text('Detalle del contacto'),
          actions: [
            IconButton(
              icon: Icon(
                isImportant ? Icons.star_rounded : Icons.star_border_rounded,
                color: isImportant ? AppColors.warning : null,
              ),
              tooltip: isImportant ? 'Quitar importante' : 'Marcar importante',
              onPressed: _loading ? null : () => _toggleImportant(isImportant),
            ),
          ],
        ),
        body: async.when(
          loading: () => const SkeletonContactDetail(),
          error: (e, _) => Center(child: Text('Error: $e')),
          data: (detail) {
            _populate(detail);
            final theme = Theme.of(context);
            return RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(contactDetailProvider(widget.contactId));
                await ref.read(contactDetailProvider(widget.contactId).future);
              },
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ── Cabecera ────────────────────────────────────────────
                    AppCard(
                      borderRadius: BorderRadius.circular(16),
                      elevation: 2,
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 56,
                                height: 56,
                                decoration: BoxDecoration(
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.primary.withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Center(
                                  child: Text(
                                    detail.name.isNotEmpty
                                        ? detail.name[0].toUpperCase()
                                        : '?',
                                    style: theme.textTheme.titleLarge?.copyWith(
                                      fontSize: 20,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      detail.name,
                                      style: theme.textTheme.titleMedium
                                          ?.copyWith(
                                            fontWeight: FontWeight.bold,
                                          ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      detail.email,
                                      style: theme.textTheme.bodySmall,
                                    ),
                                    if (detail.phone != null) ...[
                                      const SizedBox(height: 4),
                                      Text(
                                        detail.phone!,
                                        style: theme.textTheme.bodySmall,
                                      ),
                                    ],
                                    if (detail.instagramUser != null) ...[
                                      const SizedBox(height: 4),
                                      GestureDetector(
                                        onTap: () => launchUrl(
                                          Uri.parse(
                                            'https://instagram.com/${detail.instagramUser}',
                                          ),
                                          mode: LaunchMode.externalApplication,
                                        ),
                                        child: Row(
                                          children: [
                                            const Icon(
                                              Icons.camera_alt_outlined,
                                              size: 12,
                                              color: AppColors.instagramPink,
                                            ),
                                            const SizedBox(width: 4),
                                            Text(
                                              '@${detail.instagramUser}',
                                              style: theme.textTheme.bodySmall
                                                  ?.copyWith(
                                                    color: AppColors.instagramPink,
                                                    decoration: TextDecoration
                                                        .underline,
                                                  ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    AppDateUtils.toRelative(detail.createdAt),
                                    style: theme.textTheme.labelSmall,
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      StatusChip(
                                        label: _statusLabel(detail.status),
                                        color: _statusColor(detail.status),
                                      ),
                                      const SizedBox(width: 8),
                                      PriorityChip(priority: detail.priority),
                                    ],
                                  ),
                                ],
                              ),
                            ],
                          ),
                          if (detail.subject != null) ...[
                            const SizedBox(height: 12),
                            Text(
                              'Asunto: ${detail.subject}',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // ── Mensaje ─────────────────────────────────────────────
                    Text('Mensaje', style: theme.textTheme.titleSmall),
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surfaceVariant.withValues(
                          alpha: 0.03,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: theme.colorScheme.outline.withValues(
                            alpha: 0.06,
                          ),
                        ),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: SelectableText(
                        detail.message,
                        style: theme.textTheme.bodyMedium,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // ── Acciones de estado ────────────────────────────────
                    Text('Estado', style: theme.textTheme.titleSmall),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final s in [
                          'NEW',
                          'IN_PROGRESS',
                          'REPLIED',
                          'CLOSED',
                          'SPAM',
                        ])
                          ChoiceChip(
                            label: Text(_statusLabel(s)),
                            selected: detail.status == s,
                            onSelected: (_) => _save(status: s),
                          ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // ── Prioridad ──────────────────────────────────────────
                    Text('Prioridad', style: theme.textTheme.titleSmall),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: [
                        for (final p in ['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
                          ChoiceChip(
                            label: Text(_priorityLabel(p)),
                            selected: detail.priority == p,
                            onSelected: (_) => _save(priority: p),
                          ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // ── Preferencia de respuesta ───────────────────────────
                    Text(
                      'Preferencia de respuesta',
                      style: theme.textTheme.titleSmall,
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(
                          _responsePreferenceIcon(detail.responsePreference),
                          size: 18,
                          color: theme.colorScheme.primary,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _responsePreferenceLabel(detail.responsePreference),
                          style: theme.textTheme.bodyMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // ── Nota interna ───────────────────────────────────────
                    Text('Nota interna', style: theme.textTheme.titleSmall),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _noteCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Nota privada',
                        hintText: 'Solo visible para administradores',
                      ),
                      maxLines: 3,
                    ),
                    const SizedBox(height: 16),

                    // ── UTM / tracking ─────────────────────────────────────
                    if (detail.utmSource != null ||
                        detail.utmMedium != null ||
                        detail.utmCampaign != null ||
                        detail.referrer != null) ...[
                      Text(
                        'Origen del tráfico',
                        style: theme.textTheme.titleSmall,
                      ),
                      const SizedBox(height: 8),
                      AppCard(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (detail.referrer != null)
                              TrackingRow(
                                label: 'Referrer',
                                value: detail.referrer!,
                              ),
                            if (detail.utmSource != null)
                              TrackingRow(
                                label: 'UTM Source',
                                value: detail.utmSource!,
                              ),
                            if (detail.utmMedium != null)
                              TrackingRow(
                                label: 'UTM Medium',
                                value: detail.utmMedium!,
                              ),
                            if (detail.utmCampaign != null)
                              TrackingRow(
                                label: 'UTM Campaign',
                                value: detail.utmCampaign!,
                              ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    FilledButton.icon(
                      onPressed: _save,
                      icon: const Icon(Icons.save),
                      label: const Text('Guardar cambios'),
                    ),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  String _statusLabel(String s) => switch (s) {
    'IN_PROGRESS' => 'En curso',
    'REPLIED' => 'Respondido',
    'CLOSED' => 'Cerrado',
    'SPAM' => 'Spam',
    _ => 'Nuevo',
  };

  Color _statusColor(String s) => switch (s) {
    'REPLIED' => AppColors.success,
    'CLOSED' => AppColors.neutral,
    'SPAM' => AppColors.destructive,
    'IN_PROGRESS' => AppColors.warning,
    _ => AppColors.info,
  };

  String _priorityLabel(String p) => switch (p) {
    'LOW' => 'Baja',
    'HIGH' => 'Alta',
    'URGENT' => 'Urgente',
    _ => 'Media',
  };

  String _responsePreferenceLabel(String pref) => switch (pref) {
    'PHONE' => 'Teléfono',
    'WHATSAPP' => 'WhatsApp',
    _ => 'Email',
  };

  IconData _responsePreferenceIcon(String pref) => switch (pref) {
    'PHONE' => Icons.phone_outlined,
    'WHATSAPP' => Icons.chat_outlined,
    _ => Icons.email_outlined,
  };
}
