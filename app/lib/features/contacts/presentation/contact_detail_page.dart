// ignore_for_file: use_null_aware_elements
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../shared/widgets/widgets.dart';
import '../../../core/theme/app_colors.dart';
import '../data/contact_model.dart';
import '../providers/contacts_provider.dart';
import '../../../core/utils/date_utils.dart';
import 'widgets/contact_chips.dart';

part 'contact_detail_page_builders.dart';

class ContactDetailPage extends ConsumerStatefulWidget {
  const ContactDetailPage({super.key, required this.contactId});

  final String contactId;

  @override
  ConsumerState<ContactDetailPage> createState() => _ContactDetailPageState();
}

class _ContactDetailPageState extends ConsumerState<ContactDetailPage> {
  final _noteCtrl = TextEditingController();
  bool _loading = false;
  bool _populated = false;

  @override
  void dispose() {
    _noteCtrl.dispose();
    super.dispose();
  }

  void _populate(ContactDetail detail) {
    if (_populated) return;
    _populated = true;
    _noteCtrl.text = detail.adminNote ?? '';
  }

  Future<void> _save({String? status, String? priority}) async {
    setState(() => _loading = true);
    try {
      final updates = <String, dynamic>{
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
  Widget build(BuildContext context) => _buildContent(context);
}
