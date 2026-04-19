import 'package:flutter/material.dart';

/// Avatar circular con indicador de no leído para ContactTile.
class ContactTileAvatar extends StatelessWidget {
  const ContactTileAvatar({
    super.key,
    required this.statusIcon,
    required this.unread,
    required this.scheme,
  });

  final IconData statusIcon;
  final bool unread;
  final ColorScheme scheme;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: scheme.primary.withValues(alpha: unread ? 0.15 : 0.07),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Icon(
            statusIcon,
            color: unread ? scheme.primary : scheme.outline,
            size: 20,
          ),
        ),
        if (unread)
          Positioned(
            right: 0,
            top: 0,
            child: Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(
                color: scheme.error,
                shape: BoxShape.circle,
                border: Border.all(color: scheme.surface, width: 1.5),
              ),
            ),
          ),
      ],
    );
  }
}
