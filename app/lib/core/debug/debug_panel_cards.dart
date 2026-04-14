part of 'debug_panel.dart';

// ── Tarjeta: Server Switcher ──────────────────────────────────────────────────

/// Permite cambiar la URL del servidor en tiempo real (solo en debug/profile).
/// El cambio persiste en SharedPreferences y es visible hasta que el panel
/// se cierra. Invalida [apiClientProvider] para aplicar el nuevo baseUrl.
class _ServerSwitcherCard extends ConsumerStatefulWidget {
  const _ServerSwitcherCard();

  @override
  ConsumerState<_ServerSwitcherCard> createState() =>
      _ServerSwitcherCardState();
}

class _ServerSwitcherCardState extends ConsumerState<_ServerSwitcherCard> {
  final _customUrlController = TextEditingController();
  bool _showCustomInput = false;
  bool _switching = false;

  @override
  void dispose() {
    _customUrlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final serverState = ref.watch<ServerUrlState>(serverUrlProvider);
    final notifier = ref.read<ServerUrlNotifier>(serverUrlProvider.notifier);
    final scheme = Theme.of(context).colorScheme;

    return LoadingOverlay(
      isLoading: _switching,
      message: 'Reconectando...',
      child: _DebugCard(
        title: '🌐 Server Switcher',
        icon: Icons.swap_horiz_rounded,
        children: [
          // URL activa
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.green.withValues(alpha: 0.1),
              borderRadius: const BorderRadius.circular(8),
              border: Border.all(color: Colors.green.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.circle, color: Colors.green, size: 10),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    serverState.resolvedUrl,
                    style: const TextStyle(
                      fontSize: 12,
                      fontFamily: 'monospace',
                      fontWeight: FontWeight.w600,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Botones de preset
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: ServerPreset.values.map((ServerPreset preset) {
              final isSelected = serverState.preset == preset;
              return InkWell(
                onTap: () async {
                  if (preset == ServerPreset.custom) {
                    setState(() => _showCustomInput = !_showCustomInput);
                    return;
                  }
                  setState(() {
                    _showCustomInput = false;
                    _switching = true;
                  });
                  await notifier.setPreset(preset);
                  if (mounted) setState(() => _switching = false);
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          '${preset.emoji} Servidor: ${preset.resolveUrl()}',
                        ),
                        behavior: SnackBarBehavior.floating,
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  }
                },
                borderRadius: const BorderRadius.circular(8),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? scheme.primaryContainer
                        : scheme.surfaceContainerHighest,
                    borderRadius: const BorderRadius.circular(8),
                    border: Border.all(
                      color: isSelected
                          ? scheme.primary
                          : scheme.outlineVariant,
                      width: isSelected ? 1.5 : 1,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(preset.emoji, style: const TextStyle(fontSize: 13)),
                      const SizedBox(width: 4),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            preset.label,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: isSelected ? scheme.primary : null,
                            ),
                          ),
                          Text(
                            preset.description,
                            style: TextStyle(
                              fontSize: 10,
                              color: scheme.onSurface.withValues(alpha: 0.5),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),

          // Input URL personalizada
          if (_showCustomInput) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _customUrlController,
                    decoration: const InputDecoration(
                      hintText: 'https://tu-servidor.com',
                      isDense: true,
                      prefixIcon: const Icon(Icons.link, size: 16),
                      border: const OutlineInputBorder(),
                    ),
                    style: const TextStyle(fontSize: 12),
                    keyboardType: TextInputType.url,
                    onSubmitted: (String v) async {
                      if (v.trim().isEmpty) return;
                      await notifier.setCustomUrl(v.trim());
                      setState(() => _showCustomInput = false);
                    },
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () async {
                    final url = _customUrlController.text.trim();
                    if (url.isEmpty) return;
                    setState(() => _switching = true);
                    await notifier.setCustomUrl(url);
                    if (mounted) {
                      setState(() {
                        _switching = false;
                        _showCustomInput = false;
                      });
                    }
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('✏️ URL: $url'),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  child: const Text('OK', style: const TextStyle(fontSize: 12)),
                ),
              ],
            ),
          ],

          const SizedBox(height: 4),
          Text(
            '⚠️ El cambio reconstruye el cliente HTTP (Dio). Válido solo en Debug.',
            style: TextStyle(
              fontSize: 10,
              color: scheme.onSurface.withValues(alpha: 0.5),
            ),
          ),
        ],
      ),
    );
  }
}

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
            padding: const EdgeInsets.all(8),
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
                content: const Text('🧪 Snackbar de prueba — todo funciona ✅'),
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

// ── Componentes reutilizables ─────────────────────────────────────────────────

class _DebugCard extends StatelessWidget {
  const _DebugCard({
    required this.title,
    required this.icon,
    required this.children,
  });

  final String title;
  final IconData icon;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: const BorderRadius.circular(AppRadius.card),
        border: Border.all(color: colorScheme.outlineVariant),
      ),
      child: AppCard(
        title: title,
        leading: Icon(icon, size: 16, color: colorScheme.primary),
        elevation: 0,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [const SizedBox(height: 4), ...children],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.label,
    required this.value,
    this.valueColor,
    this.onTap,
  });

  final String label;
  final String value;
  final Color? valueColor;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final valueWidget = Text(
      value,
      style: TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: valueColor,
        fontFamily: 'monospace',
      ),
      overflow: TextOverflow.ellipsis,
    );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 90,
            child: Text(
              label,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ),
          Expanded(
            child: onTap != null
                ? InkWell(
                    onTap: onTap,
                    borderRadius: const BorderRadius.circular(4),
                    child: valueWidget,
                  )
                : valueWidget,
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
    this.loading = false,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool loading;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: SizedBox(
        width: double.infinity,
        child: OutlinedButton.icon(
          icon: loading
              ? const SizedBox.square(
                  dimension: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : Icon(icon, size: 16),
          label: Text(label),
          onPressed: loading ? null : onTap,
          style: OutlinedButton.styleFrom(alignment: Alignment.centerLeft),
        ),
      ),
    );
  }
}

class _EnvBadge extends StatelessWidget {
  const _EnvBadge({required this.environment});

  final String environment;

  @override
  Widget build(BuildContext context) {
    final (label, color) = switch (environment) {
      'production' => ('PROD', Colors.red),
      'staging' => ('STAGING', Colors.orange),
      _ => ('DEV', Colors.green),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: const BorderRadius.circular(6),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: color,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
