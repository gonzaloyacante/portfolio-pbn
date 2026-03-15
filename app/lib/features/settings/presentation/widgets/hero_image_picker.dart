import 'dart:io';

import 'package:flutter/material.dart';

import '../../../../core/theme/app_spacing.dart';

class HeroImagePicker extends StatelessWidget {
  const HeroImagePicker({
    super.key,
    required this.imageUrl,
    required this.pendingFile,
    required this.onPick,
    required this.onRemove,
  });

  final String imageUrl;
  final File? pendingFile;
  final VoidCallback onPick;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final hasImage = pendingFile != null || imageUrl.isNotEmpty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Preview
        AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          height: hasImage ? 180 : 100,
          decoration: BoxDecoration(
            color: colorScheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: colorScheme.outline.withValues(alpha: 0.4),
            ),
          ),
          clipBehavior: Clip.antiAlias,
          child: hasImage
              ? Stack(
                  fit: StackFit.expand,
                  children: [
                    pendingFile != null
                        ? Image.file(pendingFile!, fit: BoxFit.cover)
                        : Image.network(
                            imageUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (_, error, stack) => const Center(
                              child: Icon(
                                Icons.broken_image_outlined,
                                size: 40,
                              ),
                            ),
                          ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: GestureDetector(
                        onTap: onRemove,
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(
                            color: Colors.black54,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.close_rounded,
                            size: 16,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                )
              : Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.image_outlined,
                        size: 32,
                        color: colorScheme.outline,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Sin imagen',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
        ),
        const SizedBox(height: AppSpacing.sm),
        // Action button
        OutlinedButton.icon(
          onPressed: onPick,
          icon: const Icon(Icons.photo_library_outlined, size: 18),
          label: Text(hasImage ? 'Cambiar imagen' : 'Elegir foto'),
        ),
      ],
    );
  }
}
