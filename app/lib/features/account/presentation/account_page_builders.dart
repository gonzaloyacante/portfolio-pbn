part of 'account_page.dart';

// ── Build extension ────────────────────────────────────────────────────────────

extension _AccountPageBuilders on _AccountPageState {
  Widget _buildContent(BuildContext context) {
    final authAsync = ref.watch(authProvider);
    final authState = authAsync.whenOrNull(data: (v) => v);
    final user = authState is Authenticated ? authState.user : null;
    final colorScheme = Theme.of(context).colorScheme;
    final hPad = AppBreakpoints.pageMargin(context);
    final isExpanded = AppBreakpoints.isExpanded(context);

    return LoadingOverlay(
      isLoading: _loading,
      child: AppScaffold(
        title: 'Mi cuenta',
        body: Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              maxWidth: isExpanded ? 640.0 : double.infinity,
            ),
            child: ListView(
              padding: EdgeInsets.symmetric(
                horizontal: hPad,
                vertical: AppSpacing.xl,
              ),
              children: [
                AccountProfileCard(user: user),
                const SizedBox(height: 24),
                _buildPasswordCard(context),
                const SizedBox(height: 24),
                const AccountGoogleCalendarCard(),
                const SizedBox(height: 12),
                AppCard(
                  onTap: _logout,
                  child: ListTile(
                    leading: Icon(Icons.logout, color: colorScheme.error),
                    title: Text(
                      'Cerrar sesión',
                      style: TextStyle(
                        color: colorScheme.error,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                ref.watch(appBuildInfoProvider).when(
                  data: (info) => Center(
                    child: Text(
                      'Versión ${info.fullVersion}',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.outline,
                      ),
                    ),
                  ),
                  loading: () => const Center(
                    child: ShimmerBox(width: 120, height: 12, borderRadius: 4),
                  ),
                  error: (_, _) => Text(
                    'v—',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.outline,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPasswordCard(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Cambiar contraseña',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            AccountPasswordField(
              controller: _currentPwCtrl,
              label: 'Contraseña actual',
              show: _showCurrent,
              onToggle: () => setState(() => _showCurrent = !_showCurrent),
              validator: (v) => (v == null || v.isEmpty) ? 'Requerido' : null,
            ),
            const SizedBox(height: 12),
            AccountPasswordField(
              controller: _newPwCtrl,
              label: 'Nueva contraseña',
              show: _showNew,
              onToggle: () => setState(() => _showNew = !_showNew),
              validator: (v) {
                if (v == null || v.isEmpty) return 'Requerido';
                if (v.length < 8) return 'Mínimo 8 caracteres';
                return null;
              },
            ),
            const SizedBox(height: 12),
            AccountPasswordField(
              controller: _confirmPwCtrl,
              label: 'Confirmar nueva contraseña',
              show: _showConfirm,
              onToggle: () => setState(() => _showConfirm = !_showConfirm),
              validator: (v) {
                if (v == null || v.isEmpty) return 'Requerido';
                if (v != _newPwCtrl.text) return 'Las contraseñas no coinciden';
                return null;
              },
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: _changePassword,
                child: const Text('Actualizar contraseña'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}




