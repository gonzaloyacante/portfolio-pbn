import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

/// Avatar circular/redondeado para un testimonio con fallback de iniciales.
class TestimonialAvatar extends StatelessWidget {
  const TestimonialAvatar({
    super.key,
    required this.name,
    required this.colorScheme,
    this.avatarUrl,
  });

  final String name;
  final ColorScheme colorScheme;
  final String? avatarUrl;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 46,
      height: 46,
      decoration: BoxDecoration(
        color: colorScheme.primary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(14),
      ),
      clipBehavior: Clip.antiAlias,
      child: avatarUrl != null
          ? AppNetworkImage(
              imageUrl: avatarUrl!,
              fit: BoxFit.cover,
              width: 46,
              height: 46,
              placeholder: Center(
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: colorScheme.primary.withValues(alpha: 0.4),
                  ),
                ),
              ),
              errorWidget: _InitialsWidget(name: name, colorScheme: colorScheme),
            )
          : _InitialsWidget(name: name, colorScheme: colorScheme),
    );
  }
}

class _InitialsWidget extends StatelessWidget {
  const _InitialsWidget({required this.name, required this.colorScheme});

  final String name;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        name.isNotEmpty ? name[0].toUpperCase() : '?',
        style: TextStyle(
          fontWeight: FontWeight.w700,
          color: colorScheme.primary,
          fontSize: 18,
        ),
      ),
    );
  }
}
