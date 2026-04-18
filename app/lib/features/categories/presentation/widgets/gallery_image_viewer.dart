import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

/// Full-screen pinch-to-zoom image viewer.
class GalleryImageViewer extends StatelessWidget {
  const GalleryImageViewer({
    super.key,
    required this.imageUrl,
    required this.position,
  });

  final String imageUrl;
  final int? position;

  static void show(BuildContext context, String imageUrl, {int? position}) {
    showDialog<void>(
      context: context,
      barrierColor: Colors.black87,
      builder: (_) => GalleryImageViewer(imageUrl: imageUrl, position: position),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog.fullscreen(
      backgroundColor: Colors.black,
      child: Stack(
        children: [
          Center(
            child: InteractiveViewer(
              minScale: 0.5,
              maxScale: 5.0,
              child: CachedNetworkImage(
                imageUrl: imageUrl,
                fit: BoxFit.contain,
                placeholder: (BuildContext _, String _) => const Center(
                  child: CircularProgressIndicator(color: Colors.white),
                ),
                errorWidget: (BuildContext _, String _, Object _) =>
                    const Center(
                      child: Icon(
                        Icons.broken_image_outlined,
                        color: Colors.white54,
                        size: 64,
                      ),
                    ),
              ),
            ),
          ),
          if (position != null)
            Positioned(
              top: MediaQuery.paddingOf(context).top + 12,
              left: 16,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.6),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '#$position',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          Positioned(
            top: MediaQuery.paddingOf(context).top + 8,
            right: 8,
            child: IconButton(
              icon: const Icon(
                Icons.close_rounded,
                color: Colors.white,
                size: 28,
              ),
              onPressed: () => Navigator.pop(context),
              tooltip: 'Cerrar',
            ),
          ),
        ],
      ),
    );
  }
}
