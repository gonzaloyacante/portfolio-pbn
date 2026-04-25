import 'dart:io';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';

import '../../../core/config/app_constants.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/utils/app_logger.dart';

part 'image_upload_widget_previews.dart';
part 'image_upload_widget_builders.dart';

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
///   currentImageUrl: category.coverImage,
///   aspectRatio: CropAspectRatio(ratioX: 16, ratioY: 9),
///   label: 'Imagen de portada',
///   onImageSelected: (file) => ref.read(categoryFormProvider.notifier).setCover(file),
/// )
/// ```
class ImageUploadWidget extends StatefulWidget {
  const ImageUploadWidget({
    super.key,
    this.currentImageUrl,
    this.label = 'Seleccionar imagen',
    this.hint = 'Toca para cambiar la imagen',
    this.aspectRatio,
    this.maxWidth, // null = sin límite de dimensión
    this.maxHeight, // null = sin límite de dimensión
    required this.onImageSelected,
    this.onImagesSelected,
    this.onImageRemoved,
    this.allowMultiple = false,
    this.height = 360,
  });

  final String? currentImageUrl;
  final String label;
  final String hint;
  final CropAspectRatio? aspectRatio;
  final int? maxWidth;
  final int? maxHeight;
  final void Function(File file) onImageSelected;
  final void Function(List<File> files)? onImagesSelected;
  final VoidCallback? onImageRemoved;
  final bool allowMultiple;
  final double height;

  @override
  State<ImageUploadWidget> createState() => _ImageUploadWidgetState();
}

class _ImageUploadWidgetState extends State<ImageUploadWidget>
    with SingleTickerProviderStateMixin {
  File? _selectedFile;
  bool _isProcessing = false;

  late AnimationController _animController;
  late Animation<double> _buttonsAnim;

  bool get _hasImage => _selectedFile != null || widget.currentImageUrl != null;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      duration: const Duration(milliseconds: 350),
      vsync: this,
    );
    _buttonsAnim = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeInOut,
    );
    // Estado inicial sin animar
    if (_hasImage) _animController.value = 1.0;
  }

  @override
  void didUpdateWidget(covariant ImageUploadWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.currentImageUrl != widget.currentImageUrl) {
      _syncAnimation();
    }
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _syncAnimation() {
    if (_hasImage) {
      _animController.forward();
    } else {
      _animController.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final isMobile = AppBreakpoints.isMobile(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label.isNotEmpty) ...[
          Text(
            widget.label,
            style: textTheme.labelLarge?.copyWith(color: colorScheme.onSurface),
          ),
          const SizedBox(height: 8),
        ],
        if (isMobile)
          _buildMobileLayout(colorScheme)
        else
          _buildTabletLayout(colorScheme),
      ],
    );
  }

  void _handleRemove() {
    final hadLocal = _selectedFile != null;
    if (hadLocal) {
      setState(() => _selectedFile = null);
      _syncAnimation();
    }
    if (widget.onImageRemoved != null) {
      widget.onImageRemoved!();
    } else if (!hadLocal && widget.currentImageUrl != null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Para eliminar esta imagen, borra la URL en el formulario o proporciona onImageRemoved.',
            ),
          ),
        );
      }
    }
  }

  Future<void> _showSourcePicker() async {
    final source = await showModalBottomSheet<ImagePickerSource>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
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
      // imageQuality is intentionally omitted here: image_cropper will apply
      // compressQuality (85) in its own pipeline, avoiding a double-compression
      // step that can fail on HEIC / cloud-backed gallery images on Android.

      // Android native multi-select path (no cropping for multi-select)
      if (source == ImagePickerSource.gallery &&
          widget.allowMultiple &&
          Platform.isAndroid) {
        final pickedList = await picker.pickMultiImage(
          maxWidth: widget.maxWidth?.toDouble(),
          maxHeight: widget.maxHeight?.toDouble(),
        );
        if (!mounted) return;
        if (pickedList.isEmpty) return;
        final files = pickedList.map((p) => File(p.path)).toList();
        if (widget.onImagesSelected != null) {
          widget.onImagesSelected!(files);
        } else {
          for (final f in files) {
            widget.onImageSelected(f);
          }
        }
        return;
      }

      final picked = await picker.pickImage(
        source: source == ImagePickerSource.gallery
            ? ImageSource.gallery
            : ImageSource.camera,
        maxWidth: widget.maxWidth?.toDouble(),
        maxHeight: widget.maxHeight?.toDouble(),
      );

      if (picked == null || !mounted) return;

      final cropped = await ImageCropper().cropImage(
        sourcePath: picked.path,
        aspectRatio: widget.aspectRatio,
        compressQuality: AppConstants.imageQuality,
        uiSettings: [
          AndroidUiSettings(
            toolbarTitle: 'Recortar imagen',
            lockAspectRatio: widget.aspectRatio != null,
          ),
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
      _syncAnimation(); // Animar aparición de botones
      widget.onImageSelected(file);
    } catch (e) {
      AppLogger.error('ImageUploadWidget: error picking image', e);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error al seleccionar la imagen')),
        );
      }
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }
}
