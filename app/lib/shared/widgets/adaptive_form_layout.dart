import 'dart:math' as math;

import 'package:flutter/material.dart';

// ── AdaptiveFormLayout ────────────────────────────────────────────────────────

/// Layout de formulario que adapta automáticamente el número de columnas.
///
/// - Pantalla ≥ [twoColumnBreakpoint]px → 2 columnas con [crossAxisSpacing]
/// - Pantalla < breakpoint → 1 columna apilada
/// - Con [maxWidth] finito (p. ej. 720): contenido centrado y capado en tablet
/// - [maxWidth] == [double.infinity]: sin límite (p. ej. dentro de una tarjeta)
///
/// Uso:
/// ```dart
/// AdaptiveFormLayout(
///   children: [
///     TextFormField(...),  // col 1
///     TextFormField(...),  // col 2 (o debajo en mobile)
///     AdaptiveFormLayout.fullWidth(TextFormField(...)),  // siempre full width
///   ],
/// )
/// ```
class AdaptiveFormLayout extends StatelessWidget {
  const AdaptiveFormLayout({
    super.key,
    required this.children,
    this.twoColumnBreakpoint = 600,
    this.mainAxisSpacing = 20,
    this.crossAxisSpacing = 20,
    this.maxWidth = 720,
  });

  final List<Widget> children;

  /// Ancho mínimo en dp para usar 2 columnas. Por defecto 600dp (tablet).
  final double twoColumnBreakpoint;
  final double mainAxisSpacing;
  final double crossAxisSpacing;

  /// Ancho máximo del bloque de formulario; centrado si el padre es más ancho.
  /// [double.infinity] = sin tope (útil dentro de `AppCard`).
  final double maxWidth;

  /// Envuelve un widget para que ocupe el ancho completo en ambas vistas.
  static Widget fullWidth(Widget child) => _FullWidthFormItem(child: child);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final outerW = constraints.maxWidth;
        final cappedW = maxWidth.isFinite ? math.min(outerW, maxWidth) : outerW;

        Widget columnForWidth(double effectiveMaxWidth) {
          final isTwoCol = effectiveMaxWidth >= twoColumnBreakpoint;

          if (!isTwoCol) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                for (int i = 0; i < children.length; i++) ...[
                  _unwrap(children[i]),
                  if (i < children.length - 1)
                    SizedBox(height: mainAxisSpacing),
                ],
              ],
            );
          }

          final rows = <Widget>[];
          var i = 0;
          while (i < children.length) {
            final current = children[i];
            if (current is _FullWidthFormItem) {
              rows.add(_unwrap(current));
              i++;
            } else {
              final next = i + 1 < children.length ? children[i + 1] : null;
              if (next == null || next is _FullWidthFormItem) {
                rows.add(_unwrap(current));
                i++;
              } else {
                rows.add(
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(child: _unwrap(current)),
                      SizedBox(width: crossAxisSpacing),
                      Expanded(child: _unwrap(next)),
                    ],
                  ),
                );
                i += 2;
              }
            }
            if (i < children.length) {
              rows.add(SizedBox(height: mainAxisSpacing));
            }
          }

          return Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: rows,
          );
        }

        final core = LayoutBuilder(
          builder: (_, innerConstraints) {
            return columnForWidth(innerConstraints.maxWidth);
          },
        );

        if (!maxWidth.isFinite) {
          return core;
        }

        return Align(
          alignment: Alignment.topCenter,
          child: SizedBox(width: cappedW, child: core),
        );
      },
    );
  }

  Widget _unwrap(Widget child) =>
      child is _FullWidthFormItem ? child.child : child;
}

// ── Marker widget ─────────────────────────────────────────────────────────────

class _FullWidthFormItem extends StatelessWidget {
  const _FullWidthFormItem({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) => child;
}
