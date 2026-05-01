import 'package:flutter/material.dart';

/// Franja fija bajo el área segura cuando no hay conectividad.
///
/// Se muestra desde [AppScaffold] para que todas las pantallas admin tengan
/// feedback explícito (la capa HTTP ya bloquea peticiones sin red).
class OfflineConnectivityBanner extends StatelessWidget {
  const OfflineConnectivityBanner({super.key});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Material(
      color: cs.tertiaryContainer,
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
              Icons.wifi_off_rounded,
              color: cs.onTertiaryContainer,
              size: 22,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Sin conexión. Las acciones que necesitan internet no están '
                'disponibles hasta que vuelvas a estar online.',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: cs.onTertiaryContainer,
                  height: 1.35,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
