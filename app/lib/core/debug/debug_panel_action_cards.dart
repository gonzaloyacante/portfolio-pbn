part of 'debug_panel.dart';

// ── Tarjeta: Debug Actions ────────────────────────────────────────────────────

class _DebugActionsCard extends StatelessWidget {
  const _DebugActionsCard({
    required this.clearingCache,
    required this.onClearCache,
    required this.onOpenLogs,
  });

  final bool clearingCache;
  final VoidCallback onClearCache;
  final VoidCallback onOpenLogs;

  @override
  Widget build(BuildContext context) {
    return _DebugCard(
      title: 'Acciones',
      icon: Icons.build_outlined,
      children: [
        _ActionButton(
          icon: Icons.cached,
          label: 'Limpiar caché',
          loading: clearingCache,
          onTap: onClearCache,
        ),
        _ActionButton(
          icon: Icons.article_outlined,
          label: 'Ver logs',
          onTap: onOpenLogs,
        ),
        _ActionButton(
          icon: Icons.notifications_outlined,
          label: 'Test snackbar',
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('🧪 Snackbar de prueba — todo funciona ✅'),
                behavior: SnackBarBehavior.floating,
              ),
            );
          },
        ),
      ],
    );
  }
}

// ── Tarjeta: System Info ──────────────────────────────────────────────────────

class _SystemInfoCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return _DebugCard(
      title: 'Sistema',
      icon: Icons.phone_android_outlined,
      children: [
        _InfoRow(
          label: 'Plataforma',
          value: Platform.isAndroid
              ? '🤖 Android'
              : Platform.isIOS
              ? '🍎 iOS'
              : Platform.operatingSystem,
        ),
        _InfoRow(label: 'OS Version', value: Platform.operatingSystemVersion),
        _InfoRow(label: 'Dart VM', value: Platform.version.split(' ').first),
        _InfoRow(label: 'Localización', value: Platform.localeName),
      ],
    );
  }
}
