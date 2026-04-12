import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

/// Field for entering an external video URL.
///
/// Supported platforms:
/// - YouTube (youtube.com/watch, youtu.be)
/// - Vimeo (vimeo.com)
/// - Google Drive (drive.google.com/file)
/// - Dropbox (dropbox.com)
/// - Direct video URLs (.mp4, .webm, .mov, .avi)
class VideoUrlField extends StatelessWidget {
  const VideoUrlField({super.key, required this.controller, this.onChanged});

  final TextEditingController controller;
  final void Function(String)? onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          controller: controller,
          decoration: InputDecoration(
            labelText: 'URL de video (opcional)',
            hintText: 'https://youtube.com/watch?v=...',
            prefixIcon: const Icon(Icons.videocam_outlined),
            suffixIcon: _VideoPreviewIcon(url: controller.text),
          ),
          keyboardType: TextInputType.url,
          onChanged: (v) {
            onChanged?.call(v);
          },
          validator: (v) {
            if (v == null || v.trim().isEmpty) return null;
            final uri = Uri.tryParse(v.trim());
            if (uri == null || !uri.isAbsolute) {
              return 'Introduce una URL válida';
            }
            return null;
          },
        ),
        const SizedBox(height: 4),
        Text(
          'Plataformas: YouTube · Vimeo · Google Drive · Dropbox · URL directa (.mp4, .webm)',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.outline,
          ),
        ),
      ],
    );
  }
}

class _VideoPreviewIcon extends StatelessWidget {
  const _VideoPreviewIcon({required this.url});
  final String url;

  @override
  Widget build(BuildContext context) {
    if (url.isEmpty) return const SizedBox.shrink();
    final icon = _platformIcon(url);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Icon(icon, color: AppColors.info, size: 20),
    );
  }

  IconData _platformIcon(String url) {
    final lower = url.toLowerCase();
    if (lower.contains('youtube.com') || lower.contains('youtu.be')) {
      return Icons.smart_display_outlined;
    }
    if (lower.contains('vimeo.com')) return Icons.video_library_outlined;
    if (lower.contains('drive.google.com')) return Icons.cloud_outlined;
    if (lower.contains('dropbox.com')) return Icons.folder_zip_outlined;
    return Icons.link_outlined;
  }
}
