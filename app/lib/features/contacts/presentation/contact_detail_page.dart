// ignore_for_file: use_null_aware_elements
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../../../shared/widgets/app_card.dart';
import '../data/contact_model.dart';
import '../providers/contacts_provider.dart';
import '../../../core/utils/date_utils.dart';
import 'widgets/contact_chips.dart';

class ContactDetailPage extends ConsumerStatefulWidget {
  const ContactDetailPage({super.key, required this.contactId});

  final String contactId;

  @override
  ConsumerState<ContactDetailPage> createState() => _ContactDetailPageState();
}

class _ContactDetailPageState extends ConsumerState<ContactDetailPage> {
  final _replyCtrl = TextEditingController();
  final _noteCtrl = TextEditingController();
  bool _loading = false;
  bool _populated = false;

  @override
  void dispose() {
    _replyCtrl.dispose();
    _noteCtrl.dispose();
    super.dispose();
  }

  void _populate(ContactDetail detail) {
    if (_populated) return;
    _populated = true;
    _replyCtrl.text = detail.replyText ?? '';
    _noteCtrl.text = detail.adminNote ?? '';
  }

  Future<void> _save({String? status, String? priority}) async {
    setState(() => _loading = true);
    try {
      final updates = <String, dynamic>{
        if (_replyCtrl.text.trim().isNotEmpty)
          'replyText': _replyCtrl.text.trim(),
        if (_noteCtrl.text.trim().isNotEmpty)
          'adminNote': _noteCtrl.text.trim(),
        if (status != null) 'status': status,
        if (priority != null) 'priority': priority,
      };
      await ref
          .read(contactsRepositoryProvider)
          .updateContact(widget.contactId, updates);
      ref
        ..invalidate(contactsListProvider)
        ..invalidate(contactDetailProvider(widget.contactId));
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Cambios guardados')));
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'No se pudieron guardar los cambios. Inténtalo de nuevo.',
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final async = ref.watch(contactDetailProvider(widget.contactId));

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
        ),
        body: async.when(
          loading: () => const SkeletonContactDetail(),
          error: (e, _) => Center(child: Text('Error: $e')),
          data: (detail) {
            _populate(detail);
            return SingleChildScrollView(
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
                                        ?.copyWith(fontWeight: FontWeight.bold),
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

                  // ── Respuesta ──────────────────────────────────────────
                  Text('Respuesta', style: theme.textTheme.titleSmall),
                  const SizedBox(height: 8),
                  if (detail.isReplied)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.check_circle,
                            size: 16,
                            color: Colors.green,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Respondido ${detail.repliedAt != null ? _formatDate(detail.repliedAt!) : ""}',
                            style: theme.textTheme.labelSmall?.copyWith(
                              color: Colors.green,
                            ),
                          ),
                        ],
                      ),
                    ),
                  TextFormField(
                    controller: _replyCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Texto de respuesta',
                      hintText: 'Escribe la respuesta enviada al cliente…',
                    ),
                    maxLines: 4,
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
    'REPLIED' => Colors.green,
    'CLOSED' => Colors.grey,
    'SPAM' => Colors.red,
    'IN_PROGRESS' => Colors.orange,
    _ => Colors.blue,
  };

  String _priorityLabel(String p) => switch (p) {
    'LOW' => 'Baja',
    'HIGH' => 'Alta',
    'URGENT' => 'Urgente',
    _ => 'Media',
  };

  String _formatDate(DateTime dt) {
    return '${dt.day.toString().padLeft(2, '0')}/'
        '${dt.month.toString().padLeft(2, '0')}/'
        '${dt.year}';
  }

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
