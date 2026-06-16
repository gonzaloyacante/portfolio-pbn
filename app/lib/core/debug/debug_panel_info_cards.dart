part of 'debug_panel.dart';

// ── Tarjeta: Build Info ───────────────────────────────────────────────────────

class _BuildInfoCard extends StatelessWidget {
  const _BuildInfoCard({required this.info, required this.onCopy});

  final AppBuildInfo info;
  final void Function(String value, String label) onCopy;

  @override
  Widget build(BuildContext context) {
    return _DebugCard(
      title: 'Build Info',
      icon: Icons.info_outline,
      children: [
        _InfoRow(
          label: 'Versión',
          value: info.fullVersion,
          onTap: () => onCopy(info.fullVersion, 'Versión'),
        ),
        _InfoRow(
          label: 'Package',
          value: info.packageName,
          onTap: () => onCopy(info.packageName, 'Package'),
        ),
        _InfoRow(
          label: 'Entorno',
          value: info.environment.toUpperCase(),
          valueColor: _envColor(info.environment, context),
        ),
        _InfoRow(
          label: 'API URL',
          value: info.apiBaseUrl,
          onTap: () => onCopy(info.apiBaseUrl, 'API URL'),
        ),
        _InfoRow(
          label: 'Sentry',
          value: info.hasActiveSentry ? '✅ Activo' : '⚪ Inactivo',
        ),
        const _InfoRow(
          label: 'Modo Flutter',
          value: kDebugMode
              ? '🐛 Debug'
              : kProfileMode
              ? '📊 Profile'
              : '🚀 Release',
        ),
      ],
    );
  }

  Color _envColor(String env, BuildContext context) => switch (env) {
    'production' => Colors.red,
    'staging' => Colors.orange,
    _ => Colors.green,
  };
}

// ── Tarjeta: Auth Info ────────────────────────────────────────────────────────

class _AuthInfoCard extends StatelessWidget {
  const _AuthInfoCard({
    required this.authAsync,
    required this.onClearTokens,
    required this.onCopy,
  });

  final AsyncValue<AuthState> authAsync;
  final VoidCallback onClearTokens;
  final void Function(String, String) onCopy;

  @override
  Widget build(BuildContext context) {
    return _DebugCard(
      title: 'Auth State',
      icon: Icons.lock_outline,
      children: [
        authAsync.when(
          data: (state) => _AuthStateContent(
            state: state,
            onClearTokens: onClearTokens,
            onCopy: onCopy,
          ),
          loading: () => const Padding(
            padding: EdgeInsets.all(8),
            child: LinearProgressIndicator(),
          ),
          error: (e, _) => Text('Error: $e'),
        ),
      ],
    );
  }
}

class _AuthStateContent extends StatelessWidget {
  const _AuthStateContent({
    required this.state,
    required this.onClearTokens,
    required this.onCopy,
  });

  final AuthState state;
  final VoidCallback onClearTokens;
  final void Function(String, String) onCopy;

  @override
  Widget build(BuildContext context) {
    return switch (state) {
      Authenticated(:final user) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const _InfoRow(
            label: 'Estado',
            value: '✅ Autenticado',
            valueColor: Colors.green,
          ),
          _InfoRow(label: 'Usuario', value: user.email),
          _InfoRow(label: 'Rol', value: user.role),
          const Divider(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              icon: const Icon(Icons.logout, size: 16),
              label: const Text('Forzar Logout (limpiar tokens)'),
              onPressed: onClearTokens,
              style: OutlinedButton.styleFrom(foregroundColor: Colors.orange),
            ),
          ),
        ],
      ),
      Unauthenticated() => const _InfoRow(
        label: 'Estado',
        value: '🔴 No autenticado',
        valueColor: Colors.red,
      ),
      AuthError(:final message) => _InfoRow(
        label: 'Estado',
        value: '❌ Error: $message',
        valueColor: Colors.red,
      ),
      _ => const _InfoRow(label: 'Estado', value: 'Cargando...'),
    };
  }
}
