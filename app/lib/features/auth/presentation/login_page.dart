import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../core/auth/auth_provider.dart';
import '../../../core/auth/auth_state.dart';
import '../../../core/notifications/push_provider.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/app_logger.dart';
import '../../../core/utils/validators.dart';

part 'login_page_builders.dart';

// ── LoginPage ─────────────────────────────────────────────────────────────────

/// Pantalla de inicio de sesión del panel de administración.
///
/// Formulario con email + password, validación local con [AppValidators],
/// y login mediante [AuthNotifier]. El router redirige automáticamente al
/// dashboard cuando el estado cambia a [Authenticated].
class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  Future<void> _handleLogin() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    FocusScope.of(context).unfocus();

    // Obtener token FCM antes de iniciar sesión para registrarlo en el backend.
    // Si falla (sin permisos, Firebase no disponible) simplemente continúa sin él.
    String? fcmToken;
    try {
      // Usa el singleton de Riverpod — no crear instancias directas de PushService.
      final pushService = ref.read(pushServiceProvider);
      await pushService.init();
      fcmToken = await pushService.getToken();
      if (fcmToken != null) {
        AppLogger.info(
          'LoginPage: FCM token obtenido (${fcmToken.length} chars)',
        );
      }
    } catch (e) {
      AppLogger.warn('LoginPage: no se pudo obtener FCM token: $e');
    }

    await ref
        .read(authProvider.notifier)
        .login(
          email: _emailController.text.trim(),
          password: _passwordController.text,
          fcmToken: fcmToken,
        );
  }

  // ── Build ────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final authAsync = ref.watch(authProvider);
    final isLoading = authAsync.value == const AuthState.authenticating();
    final errorMsg = authAsync
        .whenOrNull(data: (v) => v)
        ?.mapOrNull(error: (e) => e.message);
    final isExpanded = AppBreakpoints.isExpanded(context);

    final formContent = Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _LoginCard(
          formKey: _formKey,
          emailController: _emailController,
          passwordController: _passwordController,
          obscurePassword: _obscurePassword,
          onTogglePassword: () =>
              setState(() => _obscurePassword = !_obscurePassword),
          onSubmit: _handleLogin,
          isLoading: isLoading,
        ),
        if (errorMsg != null) ...[
          const SizedBox(height: 16),
          InlineError(message: errorMsg),
        ],
        const SizedBox(height: AppSpacing.xl),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.lock_outline_rounded,
              size: 13,
              color: Theme.of(
                context,
              ).colorScheme.outline.withValues(alpha: 0.6),
            ),
            const SizedBox(width: 6),
            Text(
              'Acceso exclusivo para administradores',
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                color: Theme.of(
                  context,
                ).colorScheme.outline.withValues(alpha: 0.6),
              ),
            ),
          ],
        ),
      ],
    );

    return LoadingOverlay(
      isLoading: isLoading,
      message: 'Iniciando sesión…',
      child: Scaffold(
        body: SafeArea(
          child: isExpanded
              ? _TwoColumnLayout(formContent: formContent)
              : Center(
                  child: SingleChildScrollView(
                    padding: EdgeInsets.symmetric(
                      horizontal: AppBreakpoints.pageMargin(context),
                      vertical: AppSpacing.xxxl,
                    ),
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 420),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          _Brand(),
                          const SizedBox(height: AppSpacing.xxxl),
                          formContent,
                        ],
                      ),
                    ),
                  ),
                ),
        ),
      ),
    );
  }
}
