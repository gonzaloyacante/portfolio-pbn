import 'package:flutter/material.dart';

class PreviewImagePlaceholder extends StatelessWidget {
  const PreviewImagePlaceholder({super.key, required this.color});
  final ColorScheme color;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [color.primaryContainer, color.secondaryContainer],
        ),
      ),
      child: Center(
        child: Icon(
          Icons.image_outlined,
          size: 48,
          color: color.onPrimaryContainer.withValues(alpha: 100 / 255),
        ),
      ),
    );
  }
}
