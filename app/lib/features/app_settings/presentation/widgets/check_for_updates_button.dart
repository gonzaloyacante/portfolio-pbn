import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import '../../../../core/updates/app_release_model.dart';
import '../../../../core/updates/app_update_provider.dart';
import '../../../../core/utils/app_logger.dart';
import '../../../../core/updates/presentation/app_update_dialog.dart';

/// Botón en la sección "Información" para verificar manualmente si hay una
/// nueva versión disponible.
///
/// En caso de actualización disponible, abre automáticamente el
/// [AppUpdateDialog] con la información de la nueva versión.
class CheckForUpdatesButton extends ConsumerStatefulWidget {
  const CheckForUpdatesButton({super.key});

  @override
  ConsumerState<CheckForUpdatesButton> createState() =>
      _CheckForUpdatesButtonState();
}

class _CheckForUpdatesButtonState extends ConsumerState<CheckForUpdatesButton> {
  bool _checking = false;

  Future<void> _check() async {
    if (_checking) return;
    setState(() => _checking = true);

    try {
      // Incrementar el trigger para forzar una nueva comprobación
      ref.read(appUpdateTriggerProvider.notifier).trigger();

      // Escuchar el primer resultado disponible
      final status = await ref.read(appUpdateStatusProvider.future);

      if (!mounted) return;

      if (status is AppUpdateAvailable) {
        // Mostrar el diálogo in-app directamente
        await AppUpdateDialog.show(
          context,
          release: status.release,
          forceUpdate: status.forceUpdate,
        );
      } else if (status is AppUpToDate) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ La app está actualizada'),
            duration: Duration(seconds: 3),
          ),
        );
      } else if (status is AppUpdateCheckFailed) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'No se pudo verificar actualizaciones: ${status.reason}',
            ),
            duration: const Duration(seconds: 4),
          ),
        );
      }
    } on Exception catch (e, st) {
      AppLogger.error('CheckForUpdatesButton: error — $e', e, st);
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Error al verificar actualizaciones'),
            duration: Duration(seconds: 3),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _checking = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return ListTile(
      dense: true,
      visualDensity: VisualDensity.compact,
      contentPadding: EdgeInsets.zero,
      leading: _checking
          ? SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2.5,
                color: colorScheme.primary,
              ),
            )
          : Icon(Icons.system_update_alt_outlined, color: colorScheme.primary),
      title: const Text('Buscar actualizaciones'),
      subtitle: Text(
        _checking ? 'Verificando...' : 'Comprobar si hay una nueva versión',
        style: TextStyle(
          fontSize: 12,
          color: colorScheme.onSurface.withValues(alpha: 0.5),
        ),
      ),
      onTap: _checking ? null : _check,
    );
  }
}
