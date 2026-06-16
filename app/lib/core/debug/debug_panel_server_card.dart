part of 'debug_panel.dart';

// ── Tarjeta: Server Switcher ──────────────────────────────────────────────────

/// Permite cambiar la URL del servidor en tiempo real (solo en debug/profile).
/// El cambio persiste en SharedPreferences y es visible hasta que el panel
/// se cierra. Invalida [apiClientProvider] para aplicar el nuevo baseUrl.
class _ServerSwitcherCard extends ConsumerStatefulWidget {
  const _ServerSwitcherCard({required this.onBusyChanged});

  final ValueChanged<bool> onBusyChanged;

  @override
  ConsumerState<_ServerSwitcherCard> createState() =>
      _ServerSwitcherCardState();
}

class _ServerSwitcherCardState extends ConsumerState<_ServerSwitcherCard> {
  final _customUrlController = TextEditingController();
  bool _showCustomInput = false;

  @override
  void dispose() {
    _customUrlController.dispose();
    super.dispose();
  }

  Future<bool> _switchAfterVerification({
    required String candidateUrl,
    required Future<void> Function() persist,
  }) async {
    widget.onBusyChanged(true);
    try {
      await verifyAdminApiReachable(candidateUrl);
      await persist();
      return true;
    } on DioException catch (dioErr) {
      if (!mounted || !context.mounted) return false;
      final messenger = ScaffoldMessenger.of(context);
      final msg = switch (dioErr.type) {
        DioExceptionType.connectionTimeout || DioExceptionType.receiveTimeout =>
          'Tiempo agotado. Revisa la URL y la red.',
        DioExceptionType.connectionError => 'Sin conexión con el servidor.',
        _ => 'El servidor no respondió correctamente.',
      };
      messenger.showSnackBar(
        SnackBar(content: Text(msg), behavior: SnackBarBehavior.floating),
      );
      return false;
    } catch (e) {
      if (!mounted || !context.mounted) return false;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No se pudo verificar: $e'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return false;
    } finally {
      if (mounted) widget.onBusyChanged(false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final serverState = ref.watch<ServerUrlState>(serverUrlProvider);
    final notifier = ref.read<ServerUrlNotifier>(serverUrlProvider.notifier);
    final scheme = Theme.of(context).colorScheme;

    return _DebugCard(
      title: '🌐 Server Switcher',
      icon: Icons.swap_horiz_rounded,
      children: [
        // URL activa
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.green.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
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
                setState(() => _showCustomInput = false);
                final candidate = preset.resolveUrl(
                  customUrl: serverState.customUrl,
                );
                final ok = await _switchAfterVerification(
                  candidateUrl: candidate,
                  persist: () => notifier.setPreset(preset),
                );
                if (!ok || !context.mounted) return;
                final resolved = ref.read(serverUrlProvider).resolvedUrl;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('${preset.emoji} Servidor: $resolved'),
                    behavior: SnackBarBehavior.floating,
                    duration: const Duration(seconds: 2),
                  ),
                );
              },
              borderRadius: BorderRadius.circular(8),
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
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isSelected ? scheme.primary : scheme.outlineVariant,
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
                    prefixIcon: Icon(Icons.link, size: 16),
                    border: OutlineInputBorder(),
                  ),
                  style: const TextStyle(fontSize: 12),
                  keyboardType: TextInputType.url,
                  onSubmitted: (String v) async {
                    final url = v.trim();
                    if (url.isEmpty) return;
                    final ok = await _switchAfterVerification(
                      candidateUrl: url,
                      persist: () => notifier.setCustomUrl(url),
                    );
                    if (!mounted) return;
                    if (ok) setState(() => _showCustomInput = false);
                    if (context.mounted && ok) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('✏️ URL: $url'),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    }
                  },
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                onPressed: () async {
                  final url = _customUrlController.text.trim();
                  if (url.isEmpty) return;
                  final ok = await _switchAfterVerification(
                    candidateUrl: url,
                    persist: () => notifier.setCustomUrl(url),
                  );
                  if (!mounted) return;
                  if (ok) setState(() => _showCustomInput = false);
                  if (context.mounted && ok) {
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
                child: const Text('OK', style: TextStyle(fontSize: 12)),
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
    );
  }
}
