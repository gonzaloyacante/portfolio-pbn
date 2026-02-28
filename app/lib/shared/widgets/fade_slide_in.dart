import 'package:flutter/material.dart';

// ── FadeSlideIn ───────────────────────────────────────────────────────────────

/// Widget que anima la entrada de su [child] con un efecto de
/// fundido + deslizamiento desde abajo.
///
/// Ideal para listas con animación escalonada (stagger):
/// ```dart
/// FadeSlideIn(
///   delay: Duration(milliseconds: index * 50),
///   child: MyCard(...),
/// )
/// ```
class FadeSlideIn extends StatefulWidget {
  const FadeSlideIn({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.duration = const Duration(milliseconds: 350),
  });

  /// Widget a animar.
  final Widget child;

  /// Retraso antes de iniciar la animación (para el efecto escalonado).
  final Duration delay;

  /// Duración de la animación de entrada.
  final Duration duration;

  @override
  State<FadeSlideIn> createState() => _FadeSlideInState();
}

class _FadeSlideInState extends State<FadeSlideIn> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _opacity;
  late final Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    _opacity = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
    _slide = Tween<Offset>(
      begin: const Offset(0, 0.07),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic));

    if (widget.delay == Duration.zero) {
      _controller.forward();
    } else {
      Future.delayed(widget.delay, () {
        if (mounted) _controller.forward();
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => FadeTransition(
    opacity: _opacity,
    child: SlideTransition(position: _slide, child: widget.child),
  );
}
