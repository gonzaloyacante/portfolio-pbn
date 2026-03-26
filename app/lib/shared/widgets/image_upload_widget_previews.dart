part of 'image_upload_widget.dart';

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
    return CachedNetworkImageProvider(widget.url!);
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
