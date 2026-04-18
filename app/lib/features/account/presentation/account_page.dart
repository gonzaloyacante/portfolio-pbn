import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/auth/auth_provider.dart';
import '../../../core/auth/auth_state.dart';
import '../../../core/debug/debug_provider.dart';
import '../../../core/notifications/push_provider.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../providers/account_provider.dart';
import 'widgets/account_profile_card.dart';
import 'widgets/account_password_field.dart';
import 'widgets/account_google_calendar_card.dart';

part 'account_page_builders.dart';

// ── AccountPage ──────────────────────────────────────────────────────────────────

class AccountPage extends ConsumerStatefulWidget {
  const AccountPage({super.key});

  @override
  ConsumerState<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends ConsumerState<AccountPage> {
  final _formKey = GlobalKey<FormState>();
  final _currentPwCtrl = TextEditingController();
  final _newPwCtrl = TextEditingController();
  final _confirmPwCtrl = TextEditingController();

  bool _loading = false;
  bool _showCurrent = false;
  bool _showNew = false;
  bool _showConfirm = false;

  @override
  void dispose() {
    _currentPwCtrl.dispose();
    _newPwCtrl.dispose();
    _confirmPwCtrl.dispose();
    super.dispose();
  }

  Future<void> _changePassword() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);
    try {
      await ref
          .read(accountRepositoryProvider)
          .changePassword(
            currentPassword: _currentPwCtrl.text.trim(),
            newPassword: _newPwCtrl.text.trim(),
          );
      if (!mounted) return;
      _currentPwCtrl.clear();
      _newPwCtrl.clear();
      _confirmPwCtrl.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Contraseña actualizada correctamente')),
      );
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (!mounted) return;
      final msg = e.toString().contains('actual')
          ? 'Contraseña actual incorrecta'
          : 'No se pudo actualizar la contraseña';
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _logout() async {
    // Desregistrar token FCM antes de invalidar la sesión.
    await ref.read(pushRegistrationProvider.notifier).unregister();
    await ref.read(authProvider.notifier).logout();
  }

  @override
  Widget build(BuildContext context) => _buildContent(context);
}
