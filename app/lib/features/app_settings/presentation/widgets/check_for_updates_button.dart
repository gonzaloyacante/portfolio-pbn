import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/route_names.dart';

/// Botón en la sección "Información" para abrir la pantalla de
/// verificación de actualizaciones.
class CheckForUpdatesButton extends StatelessWidget {
  const CheckForUpdatesButton({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return ListTile(
      dense: true,
      visualDensity: VisualDensity.compact,
      contentPadding: EdgeInsets.zero,
      leading: Icon(
        Icons.system_update_alt_outlined,
        color: colorScheme.primary,
      ),
      title: const Text('Buscar actualizaciones'),
      subtitle: Text(
        'Comprobar si hay una nueva versión',
        style: TextStyle(
          fontSize: 12,
          color: colorScheme.onSurface.withValues(alpha: 0.5),
        ),
      ),
      onTap: () {
        context.pushNamed(RouteNames.appUpdate);
      },
    );
  }
}
