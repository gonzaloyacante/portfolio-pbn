part of 'category_gallery_page.dart';

// ── Drop Bounce Animator ──────────────────────────────────────────────────────

/// Runs a short scale-up → elastic-back animation when [dropped] toggles to true.
/// Used to provide tactile feedback when a gallery image lands in its new position.
class _DroppedAnimator extends StatefulWidget {
  const _DroppedAnimator({required this.dropped, required this.child});

  final bool dropped;
  final Widget child;

  @override
  State<_DroppedAnimator> createState() => _DroppedAnimatorState();
}

class _DroppedAnimatorState extends State<_DroppedAnimator>
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
        tween: Tween<double>(begin: 1.0, end: 1.07)
            .chain(CurveTween(curve: Curves.easeOut)),
        weight: 30,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.07, end: 1.0)
            .chain(CurveTween(curve: Curves.elasticOut)),
        weight: 70,
      ),
    ]).animate(_ctrl);
  }

  @override
  void didUpdateWidget(_DroppedAnimator oldWidget) {
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
      builder: (_, child) => Transform.scale(scale: _scale.value, child: child),
      child: widget.child,
    );
  }
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

class _GallerySkeleton extends StatelessWidget {
  const _GallerySkeleton({required this.viewMode});

  final ViewMode viewMode;

  @override
  Widget build(BuildContext context) {
    if (viewMode == ViewMode.grid) {
      return const SkeletonCategoriesGrid();
    }
    return const SkeletonCategoriesList();
  }
}

// ── Full-screen image viewer (pinch-to-zoom) ─────────────────────────────────

class _ImageViewer extends StatelessWidget {
  const _ImageViewer({required this.imageUrl, required this.position});

  final String imageUrl;
  final int? position;

  static void show(BuildContext context, String imageUrl, {int? position}) {
    showDialog<void>(
      context: context,
      barrierColor: Colors.black87,
      builder: (_) => _ImageViewer(imageUrl: imageUrl, position: position),
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
                placeholder: (_, _) => const Center(
                  child: CircularProgressIndicator(color: Colors.white),
                ),
                errorWidget: (_, _, _) => const Center(
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
