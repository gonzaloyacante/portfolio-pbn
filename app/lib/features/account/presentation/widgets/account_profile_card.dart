import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../../core/auth/auth_provider.dart';
import '../../../../core/auth/auth_state.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../shared/widgets/widgets.dart';
import '../../providers/account_provider.dart';

class AccountProfileCard extends ConsumerStatefulWidget {
  const AccountProfileCard({super.key, required this.user});

  final UserProfile? user;

  @override
  ConsumerState<AccountProfileCard> createState() => _AccountProfileCardState();
}

class _AccountProfileCardState extends ConsumerState<AccountProfileCard> {
  late final TextEditingController _nameCtrl;
  bool _editing = false;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.user?.name ?? '');
  }

  @override
  void didUpdateWidget(covariant AccountProfileCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!_editing && widget.user?.name != oldWidget.user?.name) {
      _nameCtrl.text = widget.user?.name ?? '';
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    super.dispose();
  }

  Future<void> _saveName() async {
    final trimmed = _nameCtrl.text.trim();
    if (trimmed.isEmpty || trimmed.length < 2) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('El nombre debe tener al menos 2 caracteres'),
        ),
      );
      return;
    }
    setState(() => _saving = true);
    try {
      await ref.read(accountRepositoryProvider).updateProfile(name: trimmed);
      ref.invalidate(authProvider);
      if (!mounted) return;
      setState(() => _editing = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nombre actualizado')),
      );
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No se pudo actualizar el nombre')),
      );
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final name = widget.user?.name ?? '—';
    final email = widget.user?.email ?? '—';

    final Widget trailingAction = _saving
        ? const SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(strokeWidth: 2),
          )
        : _editing
        ? Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () {
                  _nameCtrl.text = widget.user?.name ?? '';
                  setState(() => _editing = false);
                },
              ),
              IconButton(icon: const Icon(Icons.check), onPressed: _saveName),
            ],
          )
        : IconButton(
            icon: const Icon(Icons.edit_outlined),
            onPressed: () => setState(() => _editing = true),
          );

    return AppCard(
      borderRadius: AppRadius.forCard,
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          CircleAvatar(
            radius: 32,
            backgroundColor: Theme.of(context).colorScheme.primaryContainer,
            child: Text(
              name.isNotEmpty ? name[0].toUpperCase() : 'A',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: Theme.of(context).colorScheme.onPrimaryContainer,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _editing
                    ? TextField(
                        controller: _nameCtrl,
                        autofocus: true,
                        decoration: const InputDecoration(
                          labelText: 'Nombre',
                          isDense: true,
                        ),
                        onSubmitted: (_) => _saveName(),
                      )
                    : Text(
                        name,
                        style: Theme.of(context).textTheme.titleMedium
                            ?.copyWith(fontWeight: FontWeight.bold),
                      ),
                const SizedBox(height: 4),
                Text(email, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
          trailingAction,
        ],
      ),
    );
  }
}
