import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// PBN splash logo drawn as stroke paths (handwritten trace animation).
class PbnSplashLogo extends StatefulWidget {
  const PbnSplashLogo({
    super.key,
    this.size = 120,
    this.duration = const Duration(milliseconds: 1800),
    this.onCompleted,
  });

  final double size;
  final Duration duration;
  final VoidCallback? onCompleted;

  @override
  State<PbnSplashLogo> createState() => _PbnSplashLogoState();
}

class _PbnSplashLogoState extends State<PbnSplashLogo>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: widget.duration)
      ..forward()
      ..addStatusListener((s) {
        if (s == AnimationStatus.completed) widget.onCompleted?.call();
      });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.primary;
    return SizedBox(
      width: widget.size * 3.0,
      height: widget.size * 1.0,
      child: AnimatedBuilder(
        animation: _ctrl,
        builder: (context, child) => CustomPaint(
          painter: _PbnFontRevealPainter(
            progress: _ctrl.value,
            color: color,
            fontSize: widget.size,
            strokeWidth: widget.size * 0.06,
            text: 'PBN',
          ),
        ),
      ),
    );
  }
}

class _PbnFontRevealPainter extends CustomPainter {
  _PbnFontRevealPainter({
    required this.progress,
    required this.color,
    required this.fontSize,
    required this.strokeWidth,
    required this.text,
  });

  final double progress; // 0..1 overall
  final Color color;
  final double fontSize;
  final double strokeWidth;
  final String text;

  @override
  void paint(Canvas canvas, Size size) {
    // Paint stroke text using GoogleFonts Great Vibes and reveal per-letter sequentially
    final guidePaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth * 0.9
      ..color = color.withValues(alpha: 0.12)
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final strokePaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..color = color
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final spanGuide = TextSpan(
      text: text,
      style: GoogleFonts.greatVibes(fontSize: fontSize, foreground: guidePaint),
    );
    final spanStroke = TextSpan(
      text: text,
      style: GoogleFonts.greatVibes(
        fontSize: fontSize,
        foreground: strokePaint,
      ),
    );

    final tpGuide = TextPainter(
      text: spanGuide,
      textDirection: TextDirection.ltr,
    );
    final tpStroke = TextPainter(
      text: spanStroke,
      textDirection: TextDirection.ltr,
    );
    tpGuide.layout();
    tpStroke.layout();

    final dx = (size.width - tpGuide.width) / 2;
    final dy = (size.height - tpGuide.height) / 2;

    canvas.save();
    canvas.translate(dx, dy);

    // draw faint guide
    tpGuide.paint(canvas, Offset.zero);

    // per-letter reveal: split progress into N equal segments
    final n = text.length;
    final per = 1.0 / n;
    for (var i = 0; i < n; i++) {
      final start = per * i;
      final end = per * (i + 1);
      final localProgress = ((progress - start) / (end - start)).clamp(
        0.0,
        1.0,
      );

      if (localProgress <= 0) continue;

      // get box for letter i
      final boxes = tpStroke.getBoxesForSelection(
        TextSelection(baseOffset: i, extentOffset: i + 1),
      );
      if (boxes.isEmpty) continue;
      final b = boxes.first.toRect();

      // clip to reveal portion of the letter width
      final revealWidth = b.width * localProgress;
      canvas.save();
      canvas.clipRect(Rect.fromLTWH(b.left, b.top, revealWidth, b.height));
      tpStroke.paint(canvas, Offset.zero);
      canvas.restore();
    }

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _PbnFontRevealPainter old) =>
      old.progress != progress ||
      old.color != color ||
      old.fontSize != fontSize ||
      old.strokeWidth != strokeWidth ||
      old.text != text;
}

// Note: previous manual path-based painter removed in favor of font-based
// reveal painter above which uses exact glyphs from Great Vibes.
