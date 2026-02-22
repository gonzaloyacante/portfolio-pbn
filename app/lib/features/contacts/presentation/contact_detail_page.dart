// ignore_for_file: use_null_aware_elements
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/widgets/loading_overlay.dart';
import '../data/contact_model.dart';
import '../providers/contacts_provider.dart';

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
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
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
        appBar: AppBar(title: const Text('Detalle del contacto')),
        body: async.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Center(child: Text('Error: $e')),
          data: (detail) {
            _populate(detail);
            return SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Cabecera ────────────────────────────────────────────
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 24,
                                child: Text(
                                  detail.name.isNotEmpty
                                      ? detail.name[0].toUpperCase()
                                      : '?',
                                  style: const TextStyle(fontSize: 20),
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
                                    Text(
                                      detail.email,
                                      style: theme.textTheme.bodySmall,
                                    ),
                                    if (detail.phone != null)
                                      Text(
                                        detail.phone!,
                                        style: theme.textTheme.bodySmall,
                                      ),
                                  ],
                                ),
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
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              _StatusChip(
                                label: _statusLabel(detail.status),
                                color: _statusColor(detail.status),
                              ),
                              const SizedBox(width: 8),
                              _PriorityChip(priority: detail.priority),
                              const Spacer(),
                              Text(
                                _formatDate(detail.createdAt),
                                style: theme.textTheme.labelSmall,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // ── Mensaje ─────────────────────────────────────────────
                  Text('Mensaje', style: theme.textTheme.titleSmall),
                  const SizedBox(height: 8),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(detail.message),
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
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (detail.referrer != null)
                              _TrackingRow(
                                label: 'Referrer',
                                value: detail.referrer!,
                              ),
                            if (detail.utmSource != null)
                              _TrackingRow(
                                label: 'UTM Source',
                                value: detail.utmSource!,
                              ),
                            if (detail.utmMedium != null)
                              _TrackingRow(
                                label: 'UTM Medium',
                                value: detail.utmMedium!,
                              ),
                            if (detail.utmCampaign != null)
                              _TrackingRow(
                                label: 'UTM Campaign',
                                value: detail.utmCampaign!,
                              ),
                          ],
                        ),
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
}

// ── Sub-widgets ───────────────────────────────────────────────────────────────

class _StatusChip extends StatelessWidget {
  const _StatusChip({required this.label, required this.color});
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _PriorityChip extends StatelessWidget {
  const _PriorityChip({required this.priority});
  final String priority;

  @override
  Widget build(BuildContext context) {
    final color = switch (priority) {
      'URGENT' => Colors.red,
      'HIGH' => Colors.orange,
      'LOW' => Colors.grey,
      _ => Theme.of(context).colorScheme.primary,
    };
    final label = switch (priority) {
      'URGENT' => 'Urgente',
      'HIGH' => 'Alta',
      'LOW' => 'Baja',
      _ => 'Media',
    };
    return _StatusChip(label: label, color: color);
  }
}

class _TrackingRow extends StatelessWidget {
  const _TrackingRow({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: Theme.of(
                context,
              ).textTheme.labelSmall?.copyWith(fontWeight: FontWeight.w600),
            ),
          ),
          Expanded(
            child: Text(value, style: Theme.of(context).textTheme.bodySmall),
          ),
        ],
      ),
    );
  }
}
