import 'package:flutter/material.dart';

/// Botón cuadrado para añadir imagen a la galería.
class AddImageButton extends StatelessWidget {
  const AddImageButton({super.key, required this.scheme, this.onTap});

  final ColorScheme scheme;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 100,
        height: 100,
        decoration: BoxDecoration(
          color: scheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: scheme.outlineVariant),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.add_photo_alternate_outlined, color: scheme.primary),
            const SizedBox(height: 4),
            Text(
              'Añadir',
              style: TextStyle(fontSize: 11, color: scheme.outline),
            ),
          ],
        ),
      ),
    );
  }
}
