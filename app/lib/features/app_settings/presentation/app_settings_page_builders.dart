part of 'app_settings_page.dart';

extension _AppSettingsPageBuilders on _AppSettingsPageState {
  Widget _buildBody(BuildContext context) {
    final themeMode = ref.watch(themeModeProvider);
    final colorScheme = Theme.of(context).colorScheme;
    final animationsEnabled = ref.watch(animationsEnabledProvider);
    final animationSpeed = ref.watch(animationSpeedPrefProvider);
    final compactMode = ref.watch(compactModeProvider);

    return AppScaffold(
      title: 'Preferencias',
      body: LoadingOverlay(
        isLoading: _clearingCache,
        message: 'Limpiando caché...',
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          children: [
            // ── Apariencia ───────────────────────────────────────────────────
            AppSettingsSectionCard(
              title: 'Apariencia',
              icon: Icons.palette_outlined,
              children: [
                ThemeTile(
                  label: 'Claro',
                  icon: Icons.light_mode_outlined,
                  mode: ThemeMode.light,
                  current: themeMode,
                  onTap: () => ref
                      .read(themeModeProvider.notifier)
                      .setThemeMode(ThemeMode.light),
                ),
                ThemeTile(
                  label: 'Oscuro',
                  icon: Icons.dark_mode_outlined,
                  mode: ThemeMode.dark,
                  current: themeMode,
                  onTap: () => ref
                      .read(themeModeProvider.notifier)
                      .setThemeMode(ThemeMode.dark),
                ),
                ThemeTile(
                  label: 'Sistema',
                  icon: Icons.brightness_auto_outlined,
                  mode: ThemeMode.system,
                  current: themeMode,
                  onTap: () => ref
                      .read(themeModeProvider.notifier)
                      .setThemeMode(ThemeMode.system),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // ── Almacenamiento ───────────────────────────────────────────────
            AppSettingsSectionCard(
              title: 'Almacenamiento',
              icon: Icons.storage_outlined,
              children: [
                ListTile(
                  dense: true,
                  visualDensity: VisualDensity.compact,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 0,
                    vertical: 0,
                  ),
                  leading: Icon(
                    Icons.cleaning_services_outlined,
                    color: colorScheme.primary,
                  ),
                  title: const Text('Limpiar caché'),
                  subtitle: const Text(
                    'Elimina archivos temporales e imágenes en caché',
                  ),
                  trailing: _clearingCache
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Icon(
                          Icons.chevron_right,
                          color: colorScheme.onSurface.withValues(alpha: 0.4),
                        ),
                  onTap: _clearingCache ? null : _clearCache,
                ),
              ],
            ),
            const SizedBox(height: 16),

            // ── Rendimiento ──────────────────────────────────────────────────
            AppSettingsSectionCard(
              title: 'Rendimiento',
              icon: Icons.speed_outlined,
              children: [
                // Toggle principal de animaciones
                SwitchListTile(
                  dense: true,
                  visualDensity: VisualDensity.compact,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 0,
                    vertical: 0,
                  ),
                  secondary: Icon(
                    Icons.animation_outlined,
                    color: colorScheme.primary,
                  ),
                  title: const Text('Animaciones'),
                  subtitle: const Text(
                    'Desactivar reduce el consumo de batería',
                  ),
                  value: animationsEnabled,
                  onChanged: (v) =>
                      ref.read(animationsEnabledProvider.notifier).set(v),
                ),
                // Selector de velocidad (sólo visible cuando las animaciones están on)
                if (animationsEnabled) ...[
                  const Divider(height: 1),
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Text(
                            'Velocidad de animaciones',
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(color: colorScheme.onSurfaceVariant),
                          ),
                        ),
                        SegmentedButton<AnimationSpeed>(
                          showSelectedIcon: false,
                          style: SegmentedButton.styleFrom(
                            visualDensity: VisualDensity.compact,
                          ),
                          segments: AnimationSpeed.values
                              .map(
                                (s) => ButtonSegment<AnimationSpeed>(
                                  value: s,
                                  label: Text(s.label),
                                ),
                              )
                              .toList(),
                          selected: {animationSpeed},
                          onSelectionChanged: (sel) => ref
                              .read(animationSpeedPrefProvider.notifier)
                              .set(sel.first),
                        ),
                      ],
                    ),
                  ),
                ],
                const Divider(height: 1),
                // Toggle modo compacto
                SwitchListTile(
                  dense: true,
                  visualDensity: VisualDensity.compact,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 0,
                    vertical: 0,
                  ),
                  secondary: Icon(
                    Icons.compress_outlined,
                    color: colorScheme.primary,
                  ),
                  title: const Text('Modo compacto'),
                  subtitle: const Text(
                    'Reduce el espaciado para ver más contenido',
                  ),
                  value: compactMode,
                  onChanged: (v) =>
                      ref.read(compactModeProvider.notifier).set(v),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // ── Notificaciones push ──────────────────────────────────────────
            const NotificationsPrefSection(),
            const SizedBox(height: 16),

            // ── Información de la app ─────────────────────────────────────────
            AppSettingsSectionCard(
              title: 'Información',
              icon: Icons.info_outlined,
              children: [
                Consumer(
                  builder: (context, ref, child) {
                    final info = ref.watch(appBuildInfoProvider);
                    return info.when(
                      data: (v) => Column(
                        children: [
                          InfoTile(label: 'Versión', value: v.fullVersion),
                          const InfoTile(
                            label: 'Aplicación',
                            value: 'Portfolio PBN Admin',
                          ),
                          InfoTile(
                            label: 'Entorno',
                            value: _AppSettingsPageState._environmentLabel,
                          ),
                        ],
                      ),
                      loading: () =>
                          const InfoTile(label: 'Versión', value: '...'),
                      error: (error, stackTrace) =>
                          const InfoTile(label: 'Versión', value: 'N/A'),
                    );
                  },
                ),
                // Buscar actualizaciones (solo Android: las updates se instalan
                // manualmente, no via App Store)
                if (Platform.isAndroid) const CheckForUpdatesButton(),
              ],
            ),

            // ── Sección Desarrollador (solo debug) ───────────────────────────────
            if (kDebugMode) ...[
              const SizedBox(height: 16),
              AppSettingsSectionCard(
                title: 'Desarrollador',
                icon: Icons.developer_mode,
                children: [
                  ListTile(
                    dense: true,
                    visualDensity: VisualDensity.compact,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 0,
                      vertical: 0,
                    ),
                    leading: Icon(
                      Icons.bug_report_outlined,
                      color: colorScheme.primary,
                    ),
                    title: const Text('Developer Tools'),
                    subtitle: const Text(
                      'Ver estado, logs y herramientas de debug',
                    ),
                    trailing: Icon(
                      Icons.chevron_right,
                      color: colorScheme.onSurface.withValues(alpha: 0.4),
                    ),
                    onTap: () => DebugPanel.show(context),
                  ),
                  ListTile(
                    dense: true,
                    visualDensity: VisualDensity.compact,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 0,
                      vertical: 0,
                    ),
                    leading: Icon(
                      Icons.article_outlined,
                      color: colorScheme.primary,
                    ),
                    title: const Text('Ver logs'),
                    subtitle: const Text('Historial de mensajes de la sesión'),
                    trailing: Icon(
                      Icons.chevron_right,
                      color: colorScheme.onSurface.withValues(alpha: 0.4),
                    ),
                    // Navigator.push used intentionally — debug-only page
                    // not registered in GoRouter (excluded from production).
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const DebugLogPage(),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ), // LoadingOverlay
    );
  }
}
