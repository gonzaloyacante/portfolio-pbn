part of 'login_page.dart';

extension _LoginPageBuilders on _LoginPageState {
  // ── Actions ──────────────────────────────────────────────────────────────

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

  // ── Builders ─────────────────────────────────────────────────────────────

  Widget _buildPage(BuildContext context) {
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
        LoginCard(
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

    return Scaffold(
      body: SafeArea(
        child: isExpanded
            ? LoginTwoColumnLayout(formContent: formContent)
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
                        const LoginBrand(),
                        const SizedBox(height: AppSpacing.xxxl),
                        formContent,
                      ],
                    ),
                  ),
                ),
              ),
      ),
    );
  }
}
