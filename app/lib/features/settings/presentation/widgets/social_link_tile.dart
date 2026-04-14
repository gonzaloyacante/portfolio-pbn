import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/settings_model.dart';
import '../../providers/settings_provider.dart';

class SocialLinkTile extends ConsumerStatefulWidget {
  const SocialLinkTile({
    super.key,
    required this.platform,
    required this.platformId,
    required this.icon,
    required this.urlHint,
    this.link,
    required this.onSaved,
  });

  final String platform;
  final String platformId;
  final IconData icon;
  final String urlHint;
  final SocialLink? link;
  final VoidCallback onSaved;

  @override
  ConsumerState<SocialLinkTile> createState() => _SocialLinkTileState();
}

class _SocialLinkTileState extends ConsumerState<SocialLinkTile> {
  bool _expanded = false;
  bool _saving = false;
  late final TextEditingController _urlCtrl;
  late final TextEditingController _usernameCtrl;
  late bool _isActive;

  @override
  void initState() {
    super.initState();
    _urlCtrl = TextEditingController(text: widget.link?.url ?? '');
    _usernameCtrl = TextEditingController(text: widget.link?.username ?? '');
    _isActive = widget.link?.isActive ?? true;
  }

  @override
  void dispose() {
    _urlCtrl.dispose();
    _usernameCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_urlCtrl.text.trim().isEmpty) return;

    setState(() => _saving = true);
    try {
      await ref.read(settingsRepositoryProvider).upsertSocialLink({
        'platform': widget.platformId,
        'url': _urlCtrl.text.trim(),
        'username': _usernameCtrl.text.trim().isEmpty
            ? null
            : _usernameCtrl.text.trim(),
        'isActive': _isActive,
      });
      widget.onSaved();
      if (mounted) {
        setState(() => _expanded = false);
        AppSnackBar.success(context, '${widget.platform} guardado');
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        AppSnackBar.error(context, 'No se pudo guardar. Inténtalo de nuevo.');
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasLink = widget.link != null && widget.link!.url.isNotEmpty;
    final cs = Theme.of(context).colorScheme;

    return AppCard(
      borderRadius: AppRadius.forCard,
      child: Column(
        children: [
          ListTile(
            leading: CircleAvatar(
              backgroundColor: hasLink
                  ? cs.primary.withValues(alpha: 0.12)
                  : cs.surfaceContainerHighest,
              child: Icon(
                widget.icon,
                color: hasLink ? cs.primary : cs.outline,
              ),
            ),
            title: Text(widget.platform),
            subtitle: Text(
              hasLink
                  ? (widget.link!.username ?? widget.link!.url)
                  : 'Sin configurar',
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: hasLink ? null : cs.outline,
                fontSize: 12,
              ),
            ),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (hasLink)
                  Icon(
                    widget.link!.isActive
                        ? Icons.visibility_outlined
                        : Icons.visibility_off_outlined,
                    size: 18,
                    color: widget.link!.isActive ? cs.primary : cs.outline,
                  ),
                const SizedBox(width: 4),
                Icon(
                  _expanded ? Icons.expand_less : Icons.edit_outlined,
                  size: 18,
                ),
              ],
            ),
            onTap: () => setState(() => _expanded = !_expanded),
          ),
          if (_expanded)
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.base,
                0,
                AppSpacing.base,
                AppSpacing.base,
              ),
              child: Column(
                children: [
                  const Divider(),
                  TextFormField(
                    controller: _urlCtrl,
                    keyboardType: TextInputType.url,
                    decoration: InputDecoration(
                      labelText: 'URL de ${widget.platform}',
                      hintText: widget.urlHint,
                      helperText: 'Enlace completo al perfil',
                      prefixIcon: const Icon(Icons.link),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _usernameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Usuario / handle',
                      helperText: 'Se muestra como texto del enlace',
                      prefixIcon: const Icon(Icons.alternate_email),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  SwitchListTile(
                    title: const Text('Activo'),
                    subtitle: const Text('Visible en el portfolio público'),
                    value: _isActive,
                    onChanged: (v) => setState(() => _isActive = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _saving ? null : _save,
                      child: _saving
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Guardar'),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
