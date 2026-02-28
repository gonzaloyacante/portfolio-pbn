import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/config/app_constants.dart';
import '../../core/utils/app_logger.dart';

// ── ImagePickerSource ─────────────────────────────────────────────────────────

enum ImagePickerSource { gallery, camera }

// ── ImageUploadWidget ─────────────────────────────────────────────────────────

/// Widget de selección y recorte de imagen para formularios.
///
/// Permite seleccionar una imagen desde galería o cámara, recortarla
/// a una relación de aspecto específica y previsualizar el resultado.
///
/// Uso:
/// ```dart
/// ImageUploadWidget(
///   currentImageUrl: project.coverImage,
///   aspectRatio: CropAspectRatio(ratioX: 16, ratioY: 9),
///   label: 'Imagen de portada',
///   onImageSelected: (file) => ref.read(projectFormProvider.notifier).setCover(file),
/// )
/// ```
class ImageUploadWidget extends StatefulWidget {
  const ImageUploadWidget({
    super.key,
    this.currentImageUrl,
    this.label = 'Seleccionar imagen',
    this.hint = 'Toca para cambiar la imagen',
    this.aspectRatio,
    this.maxWidth = 1920,
    this.maxHeight = 1080,
    required this.onImageSelected,
    this.onImageRemoved,
    this.height = 200,
  });

  final String? currentImageUrl;
  final String label;
  final String hint;
  final CropAspectRatio? aspectRatio;
  final int maxWidth;
  final int maxHeight;
  final void Function(File file) onImageSelected;
  final VoidCallback? onImageRemoved;
  final double height;

  @override
  State<ImageUploadWidget> createState() => _ImageUploadWidgetState();
}

class _ImageUploadWidgetState extends State<ImageUploadWidget> {
  File? _selectedFile;
  bool _isProcessing = false;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final hasImage = _selectedFile != null || widget.currentImageUrl != null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label.isNotEmpty) ...[
          Text(widget.label, style: textTheme.labelLarge?.copyWith(color: colorScheme.onSurface)),
          const SizedBox(height: 8),
        ],
        GestureDetector(
          onTap: _isProcessing ? null : _showSourcePicker,
          child: Container(
            height: widget.height,
            width: double.infinity,
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: colorScheme.outline.withValues(alpha: 0.3)),
              color: colorScheme.surfaceContainerHighest,
            ),
            child: _isProcessing
                ? const Center(child: CircularProgressIndicator())
                : hasImage
                ? _ImagePreview(
                    file: _selectedFile,
                    url: widget.currentImageUrl,
                    onRemove: widget.onImageRemoved != null
                        ? () {
                            setState(() => _selectedFile = null);
                            widget.onImageRemoved!();
                          }
                        : null,
                  )
                : _EmptyPreview(hint: widget.hint, colorScheme: colorScheme),
          ),
        ),
      ],
    );
  }

  Future<void> _showSourcePicker() async {
    final source = await showModalBottomSheet<ImagePickerSource>(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            ListTile(
              leading: const Icon(Icons.photo_library_outlined),
              title: const Text('Galería de fotos'),
              onTap: () => Navigator.of(ctx).pop(ImagePickerSource.gallery),
            ),
            ListTile(
              leading: const Icon(Icons.camera_alt_outlined),
              title: const Text('Cámara'),
              onTap: () => Navigator.of(ctx).pop(ImagePickerSource.camera),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );

    if (source == null || !mounted) return;
    await _pickImage(source);
  }

  Future<void> _pickImage(ImagePickerSource source) async {
    setState(() => _isProcessing = true);

    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: source == ImagePickerSource.gallery ? ImageSource.gallery : ImageSource.camera,
        maxWidth: widget.maxWidth.toDouble(),
        maxHeight: widget.maxHeight.toDouble(),
        imageQuality: AppConstants.imageQuality,
      );

      if (picked == null || !mounted) return;

      final cropped = await ImageCropper().cropImage(
        sourcePath: picked.path,
        aspectRatio: widget.aspectRatio,
        compressQuality: AppConstants.imageQuality,
        uiSettings: [
          AndroidUiSettings(toolbarTitle: 'Recortar imagen', lockAspectRatio: widget.aspectRatio != null),
          IOSUiSettings(
            title: 'Recortar imagen',
            doneButtonTitle: 'Listo',
            cancelButtonTitle: 'Cancelar',
            aspectRatioLockEnabled: widget.aspectRatio != null,
          ),
        ],
      );

      if (cropped == null || !mounted) return;

      final file = File(cropped.path);
      setState(() => _selectedFile = file);
      widget.onImageSelected(file);
    } catch (e) {
      AppLogger.error('ImageUploadWidget: error picking image', e);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Error al seleccionar la imagen')));
      }
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }
}

// ── _ImagePreview ─────────────────────────────────────────────────────────────

class _ImagePreview extends StatelessWidget {
  const _ImagePreview({this.file, this.url, this.onRemove});

  final File? file;
  final String? url;
  final VoidCallback? onRemove;

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        if (file != null)
          Image.file(file!, fit: BoxFit.cover)
        else if (url != null)
          Image.network(url!, fit: BoxFit.cover, errorBuilder: (_, _, _) => const Icon(Icons.broken_image)),
        // Overlay con botón de eliminar
        if (onRemove != null)
          Positioned(
            top: 8,
            right: 8,
            child: Material(
              color: Colors.black.withValues(alpha: 0.6),
              borderRadius: BorderRadius.circular(20),
              child: IconButton(
                onPressed: onRemove,
                icon: const Icon(Icons.close, color: Colors.white, size: 18),
                tooltip: 'Quitar imagen',
                constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                padding: const EdgeInsets.all(6),
              ),
            ),
          ),
        // Overlay semitransparente con icono de editar
        Positioned.fill(
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {},
              child: Align(
                alignment: Alignment.bottomCenter,
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  color: Colors.black.withValues(alpha: 0.3),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.edit_outlined, color: Colors.white, size: 14),
                      SizedBox(width: 4),
                      Text(
                        'Cambiar',
                        style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

// ── _EmptyPreview ─────────────────────────────────────────────────────────────

class _EmptyPreview extends StatelessWidget {
  const _EmptyPreview({required this.hint, required this.colorScheme});

  final String hint;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.add_photo_alternate_outlined, size: 48, color: colorScheme.outline),
        const SizedBox(height: 12),
        Text(
          hint,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: colorScheme.outline),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
