import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/auth/auth_provider.dart';
import '../../../core/auth/auth_state.dart';
import '../../../core/debug/debug_provider.dart';
import '../../../core/notifications/push_provider.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../calendar/data/google_calendar_models.dart';
import '../../calendar/providers/google_calendar_provider.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../providers/account_provider.dart';

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
          .changePassword(currentPassword: _currentPwCtrl.text.trim(), newPassword: _newPwCtrl.text.trim());
      if (!mounted) return;
      _currentPwCtrl.clear();
      _newPwCtrl.clear();
      _confirmPwCtrl.clear();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Contraseña actualizada correctamente')));
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
  Widget build(BuildContext context) {
    final authAsync = ref.watch(authProvider);
    final authState = authAsync.whenOrNull(data: (v) => v);
    final user = authState is Authenticated ? authState.user : null;
    final colorScheme = Theme.of(context).colorScheme;

    final hPad = AppBreakpoints.pageMargin(context);
    final isExpanded = AppBreakpoints.isExpanded(context);

    return LoadingOverlay(
      isLoading: _loading,
      child: AppScaffold(
        title: 'Mi cuenta',
        body: Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: isExpanded ? 640.0 : double.infinity),
            child: ListView(
              padding: EdgeInsets.symmetric(horizontal: hPad, vertical: AppSpacing.xl),
              children: [
                // ── Perfil ────────────────────────────────────────────────────
                _ProfileCard(user: user),
                const SizedBox(height: 24),
                // ── Cambiar contraseña ────────────────────────────────────────
                Card(
                  shape: RoundedRectangleBorder(borderRadius: AppRadius.forCard),
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Cambiar contraseña',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16),
                          _PasswordField(
                            controller: _currentPwCtrl,
                            label: 'Contraseña actual',
                            show: _showCurrent,
                            onToggle: () => setState(() => _showCurrent = !_showCurrent),
                            validator: (v) => (v == null || v.isEmpty) ? 'Requerido' : null,
                          ),
                          const SizedBox(height: 12),
                          _PasswordField(
                            controller: _newPwCtrl,
                            label: 'Nueva contraseña',
                            show: _showNew,
                            onToggle: () => setState(() => _showNew = !_showNew),
                            validator: (v) {
                              if (v == null || v.isEmpty) return 'Requerido';
                              if (v.length < 8) {
                                return 'Mínimo 8 caracteres';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 12),
                          _PasswordField(
                            controller: _confirmPwCtrl,
                            label: 'Confirmar nueva contraseña',
                            show: _showConfirm,
                            onToggle: () => setState(() => _showConfirm = !_showConfirm),
                            validator: (v) {
                              if (v == null || v.isEmpty) return 'Requerido';
                              if (v != _newPwCtrl.text) {
                                return 'Las contraseñas no coinciden';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 20),
                          SizedBox(
                            width: double.infinity,
                            child: FilledButton(onPressed: _changePassword, child: const Text('Actualizar contraseña')),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // ── Google Calendar ───────────────────────────────────────────
                _GoogleCalendarCard(),
                const SizedBox(height: 12),
                // ── Cerrar sesión ─────────────────────────────────────────────
                Card(
                  shape: RoundedRectangleBorder(borderRadius: AppRadius.forCard),
                  child: ListTile(
                    leading: Icon(Icons.logout, color: colorScheme.error),
                    title: Text(
                      'Cerrar sesión',
                      style: TextStyle(color: colorScheme.error, fontWeight: FontWeight.w600),
                    ),
                    onTap: _logout,
                  ),
                ),
                const SizedBox(height: 24),
                // ── Versión ───────────────────────────────────────────────────
                ref
                    .watch(appBuildInfoProvider)
                    .when(
                      data: (info) => Center(
                        child: Text(
                          'Versión ${info.fullVersion}',
                          style: Theme.of(
                            context,
                          ).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.outline),
                        ),
                      ),
                      loading: () => const SizedBox.shrink(),
                      error: (_, _) => const SizedBox.shrink(),
                    ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── Subwidgets ─────────────────────────────────────────────────────────────────

class _ProfileCard extends StatelessWidget {
  const _ProfileCard({required this.user});

  final UserProfile? user;

  @override
  Widget build(BuildContext context) {
    final name = user?.name ?? '—';
    final email = user?.email ?? '—';

    return Card(
      shape: RoundedRectangleBorder(borderRadius: AppRadius.forCard),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            CircleAvatar(
              radius: 32,
              backgroundColor: Theme.of(context).colorScheme.primaryContainer,
              child: Text(
                name.isNotEmpty ? name[0].toUpperCase() : 'A',
                style: Theme.of(
                  context,
                ).textTheme.headlineMedium?.copyWith(color: Theme.of(context).colorScheme.onPrimaryContainer),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(email, style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PasswordField extends StatelessWidget {
  const _PasswordField({
    required this.controller,
    required this.label,
    required this.show,
    required this.onToggle,
    required this.validator,
  });

  final TextEditingController controller;
  final String label;
  final bool show;
  final VoidCallback onToggle;
  final String? Function(String?) validator;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: !show,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
        suffixIcon: IconButton(icon: Icon(show ? Icons.visibility_off : Icons.visibility), onPressed: onToggle),
      ),
      validator: validator,
    );
  }
}

// ── _GoogleCalendarCard ────────────────────────────────────────────────────────

/// Tarjeta para conectar o desconectar la integración con Google Calendar.
class _GoogleCalendarCard extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gcAsync = ref.watch(googleCalendarProvider);
    final colorScheme = Theme.of(context).colorScheme;

    return gcAsync.when(
      loading: () => const SizedBox.shrink(),
      error: (_, _) => const SizedBox.shrink(),
      data: (gcState) {
        final isConnected = gcState is GoogleAuthConnected;
        final isConnecting = gcState is GoogleAuthConnecting;
        final email = switch (gcState) {
          GoogleAuthConnected(:final email) => email,
          _ => null,
        };

        return Card(
          shape: RoundedRectangleBorder(borderRadius: AppRadius.forCard),
          child: ListTile(
            leading: const Icon(Icons.calendar_month_outlined),
            title: Text(
              isConnected ? 'Google Calendar conectado' : 'Conectar Google Calendar',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            subtitle: email != null ? Text(email) : null,
            trailing: isConnecting
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                : isConnected
                ? TextButton(
                    onPressed: () => ref.read(googleCalendarProvider.notifier).signOut(),
                    style: TextButton.styleFrom(foregroundColor: colorScheme.error),
                    child: const Text('Desconectar'),
                  )
                : null,
            onTap: isConnected || isConnecting ? null : () => ref.read(googleCalendarProvider.notifier).signIn(),
          ),
        );
      },
    );
  }
}
