import 'package:flutter/material.dart';

/// FAB for triggering gallery image upload.
class GalleryUploadFAB extends StatelessWidget {
  const GalleryUploadFAB({
    super.key,
    required this.isUploading,
    required this.isSaving,
    required this.onPressed,
  });

  final bool isUploading;
  final bool isSaving;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      onPressed: (isSaving || isUploading) ? null : onPressed,
      icon: isUploading
          ? const SizedBox.square(
              dimension: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Colors.white,
              ),
            )
          : const Icon(Icons.add_photo_alternate_outlined),
      label: Text(isUploading ? 'Subiendo...' : 'Agregar foto'),
    );
  }
}
