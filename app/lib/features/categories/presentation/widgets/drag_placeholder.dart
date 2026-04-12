import 'package:flutter/material.dart';

/// Animated pulsing placeholder shown in a drag-and-drop gallery
/// at the source position while the image is being dragged.
///
/// The border and icon opacity animate between [_minAlpha] and [_maxAlpha]
/// to give a clear "drop target" signal without being distracting.
class DragPlaceholder extends StatefulWidget {
  const DragPlaceholder({
    super.key,
    required this.borderRadius,
    required this.aspectRatio,
    required this.color,
  });

  final BorderRadius borderRadius;
  final double aspectRatio;
  final Color color;

  @override
  State<DragPlaceholder> createState() => _DragPlaceholderState();
}

class _DragPlaceholderState extends State<DragPlaceholder>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _pulse;

  static const double _minAlpha = 0.18;
  static const double _maxAlpha = 0.60;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
    _pulse = Tween<double>(
      begin: _minAlpha,
      end: _maxAlpha,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: widget.borderRadius,
      child: AspectRatio(
        aspectRatio: widget.aspectRatio,
        child: AnimatedBuilder(
          animation: _pulse,
          builder: (_, _) => DecoratedBox(
            decoration: BoxDecoration(
              color: widget.color.withValues(alpha: _pulse.value * 0.22),
              borderRadius: widget.borderRadius,
              border: Border.all(
                color: widget.color.withValues(alpha: _pulse.value),
                width: 2.5,
              ),
            ),
            child: Center(
              child: Icon(
                Icons.swap_vert_rounded,
                color: widget.color.withValues(alpha: _pulse.value),
                size: 32,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
