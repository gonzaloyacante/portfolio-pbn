import 'package:flutter/material.dart';

/// Runs a short scale-up → elastic-back animation when [dropped] toggles to true.
/// Used to provide tactile feedback when a gallery image lands in its new position.
class DroppedAnimator extends StatefulWidget {
  const DroppedAnimator({
    super.key,
    required this.dropped,
    required this.child,
  });

  final bool dropped;
  final Widget child;

  @override
  State<DroppedAnimator> createState() => _DroppedAnimatorState();
}

class _DroppedAnimatorState extends State<DroppedAnimator>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    _scale = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(
          begin: 1.0,
          end: 1.07,
        ).chain(CurveTween(curve: Curves.easeOut)),
        weight: 30,
      ),
      TweenSequenceItem(
        tween: Tween<double>(
          begin: 1.07,
          end: 1.0,
        ).chain(CurveTween(curve: Curves.elasticOut)),
        weight: 70,
      ),
    ]).animate(_ctrl);
  }

  @override
  void didUpdateWidget(DroppedAnimator oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.dropped && !oldWidget.dropped) {
      _ctrl.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _scale,
      builder: (BuildContext _, Widget? child) =>
          Transform.scale(scale: _scale.value, child: child),
      child: widget.child,
    );
  }
}
