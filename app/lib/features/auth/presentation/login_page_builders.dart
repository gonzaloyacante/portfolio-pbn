part of 'login_page.dart';

// ── _TwoColumnLayout ──────────────────────────────────────────────────────────

/// Layout de dos columnas para pantallas expanded (tablet/desktop).
/// Columna izquierda: panel de marca con gradiente oscuro. Columna derecha: formulario.
class _TwoColumnLayout extends StatelessWidget {
  const _TwoColumnLayout({required this.formContent});
  final Widget formContent;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // Lado izquierdo — panel de marca con gradiente oscuro
        Expanded(
          child: DecoratedBox(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppColors.darkBackground,
                  AppColors.darkCard,
                  AppColors.darkSecondary,
                ],
                stops: [0.0, 0.55, 1.0],
              ),
            ),
            child: Stack(
              children: [
                // Elemento decorativo: círculo difuso en la esquina superior derecha
                Positioned(
                  top: -60,
                  right: -60,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.darkPrimary.withValues(alpha: 0.08),
                    ),
                    child: const SizedBox(width: 220, height: 220),
                  ),
                ),
                // Elemento decorativo: círculo difuso en la esquina inferior izquierda
                Positioned(
                  bottom: -80,
                  left: -80,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.darkPrimary.withValues(alpha: 0.06),
                    ),
                    child: const SizedBox(width: 280, height: 280),
                  ),
                ),
                // Contenido principal centrado
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(AppSpacing.xxxl),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const PbnSplashLogo(size: 80),
                        const SizedBox(height: AppSpacing.xl),
                        Text(
                          'Paola Bolívar Nievas',
                          style: AppTypography.decorativeTitle(
                            AppColors.darkPrimary,
                            fontSize: 32,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          'Panel de administración',
                          style: TextStyle(
                            color: AppColors.darkForeground.withValues(
                              alpha: 0.55,
                            ),
                            fontSize: 13,
                            letterSpacing: 1.5,
                            fontWeight: FontWeight.w400,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        // Lado derecho — formulario con scroll
        Expanded(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.xxxl,
                vertical: AppSpacing.xxxl,
              ),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 400),
                child: formContent,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

// ── _Brand ────────────────────────────────────────────────────────────────────

class _Brand extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Column(
      children: [
        Text(
          'Paola Bolívar',
          style: AppTypography.decorativeTitle(scheme.primary, fontSize: 48),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 4),
        Text(
          'Panel de administración',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: scheme.outline,
            letterSpacing: 0.5,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

// ── _LoginCard ────────────────────────────────────────────────────────────────

class _LoginCard extends StatelessWidget {
  const _LoginCard({
    required this.formKey,
    required this.emailController,
    required this.passwordController,
    required this.obscurePassword,
    required this.onTogglePassword,
    required this.onSubmit,
    required this.isLoading,
  });

  final GlobalKey<FormState> formKey;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final bool obscurePassword;
  final VoidCallback onTogglePassword;
  final VoidCallback onSubmit;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return AppCard(
      borderRadius: AppRadius.forCard,
      elevation: 0,
      color: scheme.surface,
      padding: const EdgeInsets.all(28),
      child: Form(
        key: formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Iniciar sesión',
              style: Theme.of(
                context,
              ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w600),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            // Email
            TextFormField(
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              autocorrect: false,
              autofillHints: const [AutofillHints.email],
              decoration: const InputDecoration(
                labelText: 'Correo electrónico',
                prefixIcon: Icon(Icons.mail_outline_rounded),
              ),
              validator: AppValidators.compose([
                AppValidators.required,
                AppValidators.email,
              ]),
            ),
            const SizedBox(height: 16),
            // Password
            TextFormField(
              controller: passwordController,
              obscureText: obscurePassword,
              textInputAction: TextInputAction.done,
              autofillHints: const [AutofillHints.password],
              onFieldSubmitted: (_) => onSubmit(),
              decoration: InputDecoration(
                labelText: 'Contraseña',
                prefixIcon: const Icon(Icons.lock_outline_rounded),
                suffixIcon: IconButton(
                  icon: Icon(
                    obscurePassword
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                  ),
                  onPressed: onTogglePassword,
                  tooltip: obscurePassword
                      ? 'Mostrar contraseña'
                      : 'Ocultar contraseña',
                ),
              ),
              validator: AppValidators.compose([
                AppValidators.required,
                AppValidators.minLength(6),
              ]),
            ),
            const SizedBox(height: 28),
            // Submit
            FilledButton(
              onPressed: isLoading ? null : onSubmit,
              style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(52),
                shape: RoundedRectangleBorder(
                  borderRadius: AppRadius.forButton,
                ),
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
              ),
              child: const Text(
                'Entrar',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
