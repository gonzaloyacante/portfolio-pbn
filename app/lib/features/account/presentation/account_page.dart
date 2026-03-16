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
import '../../../shared/widgets/app_card.dart';
import '../../../shared/widgets/shimmer_loader.dart';
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
            constraints: BoxConstraints(
              maxWidth: isExpanded ? 640.0 : double.infinity,
            ),
            child: ListView(
              padding: EdgeInsets.symmetric(
                horizontal: hPad,
                vertical: AppSpacing.xl,
              ),
              children: [
                // ── Perfil ────────────────────────────────────────────────────
                _ProfileCard(user: user),
                const SizedBox(height: 24),
                // ── Cambiar contraseña ────────────────────────────────────────
                AppCard(
                  borderRadius: AppRadius.forCard,
                  padding: const EdgeInsets.all(20),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Cambiar contraseña',
                          style: Theme.of(context).textTheme.titleMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),
                        _PasswordField(
                          controller: _currentPwCtrl,
                          label: 'Contraseña actual',
                          show: _showCurrent,
                          onToggle: () =>
                              setState(() => _showCurrent = !_showCurrent),
                          validator: (v) =>
                              (v == null || v.isEmpty) ? 'Requerido' : null,
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
                          onToggle: () =>
                              setState(() => _showConfirm = !_showConfirm),
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
                          child: FilledButton(
                            onPressed: _changePassword,
                            child: const Text('Actualizar contraseña'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // ── Google Calendar ───────────────────────────────────────────
                _GoogleCalendarCard(),
                const SizedBox(height: 12),
                // ── Cerrar sesión ─────────────────────────────────────────────
                AppCard(
                  borderRadius: AppRadius.forCard,
                  onTap: _logout,
                  child: ListTile(
                    leading: Icon(Icons.logout, color: colorScheme.error),
                    title: Text(
                      'Cerrar sesión',
                      style: TextStyle(
                        color: colorScheme.error,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
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
                          style: Theme.of(context).textTheme.bodySmall
                              ?.copyWith(
                                color: Theme.of(context).colorScheme.outline,
                              ),
                        ),
                      ),
                      loading: () => Center(
                        child: ShimmerBox(
                          width: 120,
                          height: 12,
                          borderRadius: 4,
                        ),
                      ),
                      error: (_, _) => Text(
                        'v—',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Theme.of(context).colorScheme.outline,
                        ),
                      ),
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

class _ProfileCard extends ConsumerStatefulWidget {
  const _ProfileCard({required this.user});

  final UserProfile? user;

  @override
  ConsumerState<_ProfileCard> createState() => _ProfileCardState();
}

class _ProfileCardState extends ConsumerState<_ProfileCard> {
  late final TextEditingController _nameCtrl;
  bool _editing = false;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.user?.name ?? '');
  }

  @override
  void didUpdateWidget(covariant _ProfileCard oldWidget) {
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
      // Refrescar datos de usuario
      ref.invalidate(authProvider);
      if (!mounted) return;
      setState(() => _editing = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Nombre actualizado')));
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
        suffixIcon: IconButton(
          icon: Icon(show ? Icons.visibility_off : Icons.visibility),
          onPressed: onToggle,
        ),
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
      loading: () => AppCard(
        borderRadius: AppRadius.forCard,
        padding: EdgeInsets.zero,
        child: ShimmerLoader(
          child: ListTile(
            leading: const ShimmerBox(width: 24, height: 24, borderRadius: 4),
            title: const ShimmerBox(width: 180, height: 14, borderRadius: 4),
            subtitle: const ShimmerBox(width: 120, height: 12, borderRadius: 4),
          ),
        ),
      ),
      error: (_, _) => AppCard(
        borderRadius: AppRadius.forCard,
        padding: EdgeInsets.zero,
        child: ListTile(
          leading: const Icon(Icons.calendar_month_outlined),
          title: const Text(
            'Google Calendar',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text('No se pudo cargar el estado'),
          trailing: IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => ref.invalidate(googleCalendarProvider),
          ),
        ),
      ),
      data: (gcState) {
        final isConnected = gcState is GoogleAuthConnected;
        final isConnecting = gcState is GoogleAuthConnecting;
        final email = switch (gcState) {
          GoogleAuthConnected(:final email) => email,
          _ => null,
        };

        return AppCard(
          borderRadius: AppRadius.forCard,
          padding: EdgeInsets.zero,
          onTap: isConnected || isConnecting
              ? null
              : () => ref.read(googleCalendarProvider.notifier).signIn(),
          child: ListTile(
            leading: const Icon(Icons.calendar_month_outlined),
            title: Text(
              isConnected
                  ? 'Google Calendar conectado'
                  : 'Conectar Google Calendar',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            subtitle: email != null ? Text(email) : null,
            trailing: isConnecting
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : isConnected
                ? TextButton(
                    onPressed: () =>
                        ref.read(googleCalendarProvider.notifier).signOut(),
                    style: TextButton.styleFrom(
                      foregroundColor: colorScheme.error,
                    ),
                    child: const Text('Desconectar'),
                  )
                : null,
          ),
        );
      },
    );
  }
}
