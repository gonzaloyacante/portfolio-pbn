import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../shared/widgets/widgets.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/app_update_provider.dart';
import '../providers/app_update_state.dart';

part 'app_update_page_builders.dart';

/// Pantalla moderna para gestionar las actualizaciones In-App.
/// Separada en Page, Builders y Provider para cumplir con la arquitectura.
class AppUpdatePage extends ConsumerWidget {
  const AppUpdatePage({super.key});

  bool _canPop(AppUpdateState state) {
    if (state.isMandatory && state.phase != UpdatePhase.upToDate) return false;
    if (state.phase == UpdatePhase.downloading ||
        state.phase == UpdatePhase.verifying) {
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appUpdatePageProvider);
    final notifier = ref.read(appUpdatePageProvider.notifier);
    final theme = Theme.of(context);
    final size = MediaQuery.sizeOf(context);
    final canPop = _canPop(state);

    return PopScope(
      canPop: canPop,
      child: Scaffold(
        backgroundColor: theme.colorScheme.surface,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: canPop
              ? IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () => context.pop(),
                )
              : const SizedBox.shrink(),
          title: const Text(
            'Actualización',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.normal),
          ),
        ),
        body: Center(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(
              horizontal: size.width > 600 ? size.width * 0.2 : 24.0,
              vertical: 24.0,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Icon(
                  Icons.system_update_rounded,
                  size: 80,
                  color: theme.colorScheme.primary.withValues(alpha: 0.8),
                ),
                const SizedBox(height: 32),
                AppCard(
                  padding: const EdgeInsets.all(32),
                  child: AnimatedSize(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                    child: _buildPhaseContent(context, state, notifier),
                  ),
                ),
                if (state.isMandatory && state.phase == UpdatePhase.error) ...[
                  const SizedBox(height: 16),
                  TextButton(
                    onPressed: () => context.goNamed(RouteNames.dashboard),
                    child: Text(
                      'Deseo omitir esta actualización por ahora',
                      style: TextStyle(
                        color: theme.colorScheme.onSurface.withValues(
                          alpha: 0.5,
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
