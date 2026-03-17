import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/config/app_constants.dart';
import '../../core/theme/app_breakpoints.dart';
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
    this.maxWidth, // null = sin límite de dimensión
    this.maxHeight, // null = sin límite de dimensión
    required this.onImageSelected,
    this.onImageRemoved,
    this.height = 360,
  });

  final String? currentImageUrl;
  final String label;
  final String hint;
  final CropAspectRatio? aspectRatio;
  final int? maxWidth;
  final int? maxHeight;
  final void Function(File file) onImageSelected;
  final VoidCallback? onImageRemoved;
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

  Widget _buildTabletLayout(ColorScheme colorScheme) {
    return SizedBox(
      height: widget.height,
      width: double.infinity,
      child: Container(
        padding: const EdgeInsets.all(8),
        child: AnimatedBuilder(
          animation: _buttonsAnim,
          builder: (context, _) {
            final p = _buttonsAnim.value;
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRect(
                  child: SizedBox(
                    width: 100.0 * p,
                    child: Opacity(
                      opacity: p,
                      child: Column(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _isProcessing
                                  ? null
                                  : _showSourcePicker,
                              style: ElevatedButton.styleFrom(
                                minimumSize: Size.zero,
                                padding: EdgeInsets.zero,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              child: const SizedBox.expand(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.edit_outlined, size: 20),
                                    SizedBox(height: 6),
                                    Text(
                                      'Editar',
                                      style: TextStyle(fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: _isProcessing ? null : _handleRemove,
                              style: OutlinedButton.styleFrom(
                                minimumSize: Size.zero,
                                padding: EdgeInsets.zero,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                side: BorderSide(color: colorScheme.outline),
                                foregroundColor: colorScheme.onSurface,
                              ),
                              child: const SizedBox.expand(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.close, size: 20),
                                    SizedBox(height: 6),
                                    Text(
                                      'Quitar',
                                      style: TextStyle(fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 12.0 * p),
                Expanded(
                  child: GestureDetector(
                    onTap: !_hasImage && !_isProcessing
                        ? _showSourcePicker
                        : null,
                    child: Container(
                      height: double.infinity,
                      clipBehavior: Clip.antiAlias,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: colorScheme.outline.withValues(alpha: 0.3),
                        ),
                        color: colorScheme.surfaceContainerHighest,
                      ),
                      child: _isProcessing
                          ? const Center(child: CircularProgressIndicator())
                          : _hasImage
                          ? _ImagePreview(
                              file: _selectedFile,
                              url: widget.currentImageUrl,
                              onRemove: null,
                              onEdit: null,
                            )
                          : _EmptyPreview(
                              hint: 'Toca para añadir una imagen',
                              colorScheme: colorScheme,
                            ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildMobileLayout(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        GestureDetector(
          onTap: !_hasImage && !_isProcessing ? _showSourcePicker : null,
          child: Container(
            height: widget.height,
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: colorScheme.outline.withValues(alpha: 0.3),
              ),
              color: colorScheme.surfaceContainerHighest,
            ),
            child: _isProcessing
                ? const Center(child: CircularProgressIndicator())
                : _hasImage
                ? _ImagePreview(
                    file: _selectedFile,
                    url: widget.currentImageUrl,
                    onRemove: null,
                    onEdit: null,
                  )
                : _EmptyPreview(
                    hint: 'Toca para añadir una imagen',
                    colorScheme: colorScheme,
                  ),
          ),
        ),
        AnimatedSize(
          duration: const Duration(milliseconds: 350),
          curve: Curves.easeInOut,
          child: _hasImage
              ? Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: SizedBox(
                          height: 52,
                          child: ElevatedButton(
                            onPressed: _isProcessing ? null : _showSourcePicker,
                            style: ElevatedButton.styleFrom(
                              minimumSize: Size.zero,
                              padding: EdgeInsets.zero,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.edit_outlined, size: 18),
                                SizedBox(width: 6),
                                Text('Editar', style: TextStyle(fontSize: 13)),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: SizedBox(
                          height: 52,
                          child: OutlinedButton(
                            onPressed: _isProcessing ? null : _handleRemove,
                            style: OutlinedButton.styleFrom(
                              minimumSize: Size.zero,
                              padding: EdgeInsets.zero,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              side: BorderSide(color: colorScheme.outline),
                              foregroundColor: colorScheme.onSurface,
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.close, size: 18),
                                SizedBox(width: 6),
                                Text('Quitar', style: TextStyle(fontSize: 13)),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              : const SizedBox.shrink(),
        ),
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

// ── _ImagePreview ─────────────────────────────────────────────────────────────

class _ImagePreview extends StatelessWidget {
  const _ImagePreview({this.file, this.url, this.onRemove, this.onEdit});

  final File? file;
  final String? url;
  final VoidCallback? onRemove;
  final VoidCallback? onEdit;

  @override
  Widget build(BuildContext context) {
    if (file != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: _AdaptiveImage.file(file),
      );
    }
    if (url != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: _AdaptiveImage.network(url),
      );
    }
    return const SizedBox.shrink();
  }
}

// Widget que elige el BoxFit según la orientación real de la imagen.
class _AdaptiveImage extends StatefulWidget {
  const _AdaptiveImage.file(this.file) : url = null;
  const _AdaptiveImage.network(this.url) : file = null;

  final File? file;
  final String? url;

  @override
  State<_AdaptiveImage> createState() => _AdaptiveImageState();
}

class _AdaptiveImageState extends State<_AdaptiveImage> {
  ImageStream? _stream;
  ImageInfo? _info;
  ImageStreamListener? _listener;

  ImageProvider get _provider {
    if (widget.file != null) return FileImage(widget.file!);
    return NetworkImage(widget.url!);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _resolve();
  }

  @override
  void didUpdateWidget(covariant _AdaptiveImage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.file?.path != widget.file?.path ||
        oldWidget.url != widget.url) {
      _resolve();
    }
  }

  void _resolve() {
    if (_stream != null && _listener != null) {
      _stream!.removeListener(_listener!);
    }
    final stream = _provider.resolve(const ImageConfiguration());
    _stream = stream;
    _listener = ImageStreamListener(_handleImage, onError: (_, _) {});
    stream.addListener(_listener!);
  }

  void _handleImage(ImageInfo info, bool syncCall) {
    if (!mounted) return;
    setState(() => _info = info);
  }

  @override
  void dispose() {
    if (_stream != null && _listener != null) {
      _stream!.removeListener(_listener!);
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final fit = _chooseFit();
    return Image(
      image: _provider,
      fit: fit,
      width: double.infinity,
      height: double.infinity,
      alignment: Alignment.center,
      errorBuilder: (context, error, stackTrace) =>
          const Icon(Icons.broken_image),
    );
  }

  BoxFit _chooseFit() {
    if (_info == null) return BoxFit.contain; // fallback while loading
    final w = _info!.image.width.toDouble();
    final h = _info!.image.height.toDouble();
    // Si la imagen es más alta que ancha (retrato), mostrar completa (contain)
    // Si es más ancha (paisaje), rellenar el ancho (cover) para aprovechar el espacio
    return h > w ? BoxFit.contain : BoxFit.cover;
  }
}

// ── _EmptyPreview ─────────────────────────────────────────────────────────────

class _EmptyPreview extends StatelessWidget {
  const _EmptyPreview({required this.hint, required this.colorScheme});

  final String hint;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    final displayColor = colorScheme.onSurface.withValues(alpha: 0.65);
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.add_photo_alternate_outlined,
            size: 48,
            color: displayColor,
          ),
          const SizedBox(height: 12),
          Text(
            hint,
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(color: displayColor),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
