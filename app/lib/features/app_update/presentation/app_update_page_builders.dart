part of 'app_update_page.dart';

Widget _buildPhaseContent(
  BuildContext context,
  AppUpdateState state,
  AppUpdatePageNotifier notifier,
) {
  final theme = Theme.of(context);

  switch (state.phase) {
    case UpdatePhase.checking:
      return _buildCentered(
        theme,
        title: 'Buscando actualizaciones...',
        subtitle: 'Conectando con el servidor para revisar nuevas versiones...',
        child: const Padding(
          padding: EdgeInsets.only(top: 24),
          child: CircularProgressIndicator(),
        ),
      );

    case UpdatePhase.upToDate:
      return _buildCentered(
        theme,
        title: '¡Estás al día!',
        subtitle: 'Tienes la versión más reciente instalada.',
        icon: const Icon(
          Icons.check_circle_rounded,
          color: AppColors.success,
          size: 48,
        ),
        child: Padding(
          padding: const EdgeInsets.only(top: 32),
          child: FilledButton(
            onPressed: () {
              if (context.canPop()) {
                context.pop();
              } else {
                context.goNamed(RouteNames.dashboard);
              }
            },
            child: const Text('Volver al sistema'),
          ),
        ),
      );

    case UpdatePhase.error:
      return _buildCentered(
        theme,
        title: 'Vaya...',
        subtitle: state.errorMsg ?? 'Ocurrió un problema inesperado.',
        icon: Icon(
          Icons.error_outline,
          color: theme.colorScheme.error,
          size: 48,
        ),
        child: Padding(
          padding: const EdgeInsets.only(top: 32),
          child: FilledButton.icon(
            icon: const Icon(Icons.refresh),
            label: const Text('Intentar de nuevo'),
            onPressed: notifier.retry,
          ),
        ),
      );

    case UpdatePhase.available:
      final sizeMb = (state.release?.fileSizeBytes ?? 0) / 1024 / 1024;
      return _buildContentBlock(
        theme,
        title: 'Versión ${state.release?.version ?? ""}',
        subtitle:
            'Actualización importante recomendada. Tamaño: ${sizeMb.toStringAsFixed(1)} MB.',
        body: state.release?.releaseNotes,
        actionLabel: 'Descargar actualización',
        onAction: notifier.startDownload,
      );

    case UpdatePhase.downloading:
      return _buildCentered(
        theme,
        title: 'Descargando...',
        subtitle:
            'Por favor, espera amablemente. No cierres la aplicación hasta concluir el proceso.',
        child: Padding(
          padding: const EdgeInsets.only(top: 32),
          child: Column(
            children: [
              LinearProgressIndicator(
                value: state.progress > 0 ? state.progress : null,
                borderRadius: BorderRadius.circular(8),
                minHeight: 8,
              ),
              const SizedBox(height: 16),
              Text(
                '${(state.progress * 100).toStringAsFixed(0)} %',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.primary,
                ),
              ),
            ],
          ),
        ),
      );

    case UpdatePhase.verifying:
      return _buildCentered(
        theme,
        title: 'Verificando archivo...',
        subtitle:
            'Comprobando la integridad del paquete descargado para una instalación segura.',
        child: const Padding(
          padding: EdgeInsets.only(top: 24),
          child: CircularProgressIndicator(),
        ),
      );

    case UpdatePhase.ready:
      return _buildCentered(
        theme,
        title: '¡Listo para instalar!',
        subtitle:
            'Descarga finalizada con éxito y archivo verificado. El sistema Android te pedirá confirmación.',
        icon: Icon(
          Icons.offline_pin_rounded,
          color: theme.colorScheme.primary,
          size: 56,
        ),
        child: Padding(
          padding: const EdgeInsets.only(top: 32),
          child: FilledButton.icon(
            icon: const Icon(Icons.download_done_rounded),
            label: const Text('Instalar ahora'),
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            ),
            onPressed: notifier.install,
          ),
        ),
      );

    case UpdatePhase.needsPermission:
      return _buildCentered(
        theme,
        title: 'Permiso necesario',
        subtitle:
            'Para instalar actualizaciones directamente en tu dispositivo, Portfolio Admin necesita permiso para instalar aplicaciones.',
        icon: Icon(
          Icons.security_rounded,
          color: theme.colorScheme.primary,
          size: 56,
        ),
        child: Padding(
          padding: const EdgeInsets.only(top: 32),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primaryContainer.withValues(
                    alpha: 0.4,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.info_outline,
                          size: 16,
                          color: theme.colorScheme.primary,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Android requiere que actives manualmente "Instalar apps desconocidas" para esta app en Ajustes.',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: theme.colorScheme.onPrimaryContainer,
                              height: 1.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  icon: const Icon(Icons.settings_outlined),
                  label: const Text('Activar en Ajustes'),
                  style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  onPressed: notifier.requestInstallPermission,
                ),
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: notifier.skipPermission,
                  child: const Text('Ahora no'),
                ),
              ),
            ],
          ),
        ),
      );

    case UpdatePhase.installing:
      return _buildCentered(
        theme,
        title: 'Instalando actualización',
        subtitle:
            'El instalador nativo se ha ejecutado exitosamente. Puedes salir y dejar que Android finalice el proceso.',
        child: Padding(
          padding: const EdgeInsets.only(top: 32),
          child: OutlinedButton(
            onPressed: () {
              if (context.canPop()) {
                context.pop();
              } else {
                context.goNamed(RouteNames.dashboard);
              }
            },
            child: const Text('Ocultar y volver al menú'),
          ),
        ),
      );
  }
}

Widget _buildCentered(
  ThemeData theme, {
  required String title,
  required String subtitle,
  Widget? icon,
  Widget? child,
}) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.center,
    children: [
      if (icon != null) ...[icon, const SizedBox(height: 16)],
      Text(
        title,
        textAlign: TextAlign.center,
        style: theme.textTheme.headlineSmall?.copyWith(
          fontWeight: FontWeight.w600,
        ),
      ),
      const SizedBox(height: 12),
      Text(
        subtitle,
        textAlign: TextAlign.center,
        style: theme.textTheme.bodyMedium?.copyWith(
          height: 1.5,
          color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
        ),
      ),
      ?child,
    ],
  );
}

Widget _buildContentBlock(
  ThemeData theme, {
  required String title,
  required String subtitle,
  String? body,
  required String actionLabel,
  required VoidCallback onAction,
}) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        title,
        style: theme.textTheme.headlineSmall?.copyWith(
          fontWeight: FontWeight.w700,
          color: theme.colorScheme.primary,
        ),
      ),
      const SizedBox(height: 8),
      Text(
        subtitle,
        style: theme.textTheme.bodyMedium?.copyWith(
          fontWeight: FontWeight.w500,
          color: theme.colorScheme.onSurface.withValues(alpha: 0.8),
        ),
      ),
      if (body != null && body.isNotEmpty) ...[
        const SizedBox(height: 16),
        const Divider(),
        const SizedBox(height: 16),
        Text(
          'Notas de la versión:',
          style: theme.textTheme.titleSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Text(body, style: theme.textTheme.bodySmall?.copyWith(height: 1.6)),
      ],
      const SizedBox(height: 32),
      SizedBox(
        width: double.infinity,
        child: FilledButton(
          onPressed: onAction,
          style: FilledButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: Text(
            actionLabel,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          ),
        ),
      ),
    ],
  );
}
