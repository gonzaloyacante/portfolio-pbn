import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';

class SettingsSocialPage extends ConsumerWidget {
  const SettingsSocialPage({super.key});

  static const _kPlatforms = [
    ('Instagram', 'instagram', Icons.photo_camera_outlined),
    ('TikTok', 'tiktok', Icons.music_note_outlined),
    ('YouTube', 'youtube', Icons.play_circle_outlined),
    ('WhatsApp', 'whatsapp', Icons.chat_outlined),
    ('LinkedIn', 'linkedin', Icons.work_outline),
    ('Facebook', 'facebook', Icons.facebook_outlined),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(socialLinksProvider);

    return AppScaffold(
      title: 'Redes Sociales',
      actions: [
        IconButton(
          icon: const Icon(Icons.refresh),
          onPressed: () => ref.invalidate(socialLinksProvider),
        ),
      ],
      body: async.when(
        loading: () => ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: _kPlatforms.length,
          separatorBuilder: (_, _) => const SizedBox(height: 8),
          itemBuilder: (_, _) => ShimmerLoader(
            child: ShimmerBox(
              width: double.infinity,
              height: 72,
              borderRadius: 20,
            ),
          ),
        ),
        error: (e, _) => ErrorState(
          message: e.toString(),
          onRetry: () => ref.invalidate(socialLinksProvider),
        ),
        data: (links) => ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: _kPlatforms.length,
          separatorBuilder: (_, _) => const SizedBox(height: 8),
          itemBuilder: (_, i) {
            final platform = _kPlatforms[i];
            final existing = links.where((l) => l.platform == platform.$2);
            final link = existing.isEmpty ? null : existing.first;

            return _SocialLinkTile(
              platform: platform.$1,
              platformId: platform.$2,
              icon: platform.$3,
              link: link,
              onSaved: () => ref.invalidate(socialLinksProvider),
            );
          },
        ),
      ),
    );
  }
}

// ── Tile ──────────────────────────────────────────────────────────────────────

class _SocialLinkTile extends ConsumerStatefulWidget {
  const _SocialLinkTile({
    required this.platform,
    required this.platformId,
    required this.icon,
    this.link,
    required this.onSaved,
  });

  final String platform;
  final String platformId;
  final IconData icon;
  final SocialLink? link;
  final VoidCallback onSaved;

  @override
  ConsumerState<_SocialLinkTile> createState() => _SocialLinkTileState();
}

class _SocialLinkTileState extends ConsumerState<_SocialLinkTile> {
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
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('${widget.platform} guardado')));
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'No fue posible completar la accion. Intentalo de nuevo.',
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasLink = widget.link != null && widget.link!.url.isNotEmpty;
    final cs = Theme.of(context).colorScheme;

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
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
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            onTap: () => setState(() => _expanded = !_expanded),
          ),
          if (_expanded)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Column(
                children: [
                  const Divider(),
                  TextFormField(
                    controller: _urlCtrl,
                    keyboardType: TextInputType.url,
                    decoration: InputDecoration(
                      labelText: 'URL de ${widget.platform}',
                      hintText: 'https://',
                      prefixIcon: const Icon(Icons.link),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _usernameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Usuario / handle',
                      prefixIcon: Icon(Icons.alternate_email),
                    ),
                  ),
                  const SizedBox(height: 8),
                  SwitchListTile(
                    title: const Text('Activo'),
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
