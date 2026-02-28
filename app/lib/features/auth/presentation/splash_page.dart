import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/widgets/pbn_splash_logo.dart';

import '../../../core/auth/auth_provider.dart';
import '../../../core/auth/auth_state.dart';
import '../../../core/router/app_router.dart';

/// Pantalla de splash intermedia que muestra logo y loader mientras se
/// restaura la sesión. La decisión de navegación la realiza el router
/// mediante el guard (RouterNotifier) cuando el `authProvider` deje de
/// estar en estado loading.
class SplashPage extends ConsumerStatefulWidget {
  const SplashPage({super.key});

  @override
  ConsumerState<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends ConsumerState<SplashPage> with SingleTickerProviderStateMixin {
  @override
  void initState() {
    super.initState();
    // Reset signal so router will wait for the animation each time we show splash
    splashAnimationFinished.value = false;
  }

  @override
  Widget build(BuildContext context) {
    final authAsync = ref.watch(authProvider);
    final authState = authAsync.whenOrNull(data: (v) => v);

    String message;
    if (authAsync.isLoading) {
      message = 'Restaurando sesión...';
    } else if (authState is Authenticated) {
      message = 'Bienvenido, ${authState.user.name}';
    } else if (authState is Authenticating) {
      message = 'Iniciando sesión...';
    } else {
      message = 'Preparando la app...';
    }

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              PbnSplashLogo(size: 96, onCompleted: () => splashAnimationFinished.value = true),
              const SizedBox(height: 28),
              Text(
                message,
                style: Theme.of(
                  context,
                ).textTheme.bodyMedium?.copyWith(color: Theme.of(context).colorScheme.outline, letterSpacing: 0.3),
              ),
              const SizedBox(height: 20),
              if (authAsync.isLoading)
                SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(strokeWidth: 2.5, color: Theme.of(context).colorScheme.primary),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
