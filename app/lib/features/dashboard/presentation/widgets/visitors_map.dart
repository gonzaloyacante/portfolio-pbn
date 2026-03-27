import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/utils/country_names.dart';
import '../../data/dashboard_repository.dart';
import '../../../../core/theme/app_radius.dart';

part 'visitors_map_builders.dart';
// ── VisitorsMapWidget ────────────────────────────────────────────────────────

/// Mapa interactivo de visitantes del sitio.
///
/// - Tiles Carto (dark / light, sin API key) sobre OpenStreetMap.
/// - Marcadores animados (pulso) proporcionalmente al volumen de visitas.
/// - Tapping en un marcador muestra un tooltip con país y conteo.
/// - Tapping en una fila de la lista enfoca el mapa en esa ubicación.
class VisitorsMapWidget extends StatefulWidget {
  const VisitorsMapWidget({super.key, required this.locations});

  final List<LocationStat> locations;

  @override
  State<VisitorsMapWidget> createState() => _VisitorsMapWidgetState();
}

class _VisitorsMapWidgetState extends State<VisitorsMapWidget>
    with SingleTickerProviderStateMixin {
  late final MapController _mapCtrl;
  late final AnimationController _pulseCtrl;
  late final Animation<double> _pulseAnim;
  int? _selectedIdx;

  @override
  void initState() {
    super.initState();
    _mapCtrl = MapController();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..repeat(reverse: true);
    _pulseAnim = CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _mapCtrl.dispose();
    _pulseCtrl.dispose();
    super.dispose();
  }

  List<LocationStat> get _geoLocs => widget.locations
      .where((l) => l.latitude != null && l.longitude != null)
      .toList();

  /// Calcula los bounds que contienen todos los marcadores geo.
  LatLngBounds? get _geoBounds {
    final locs = _geoLocs;
    if (locs.length < 2) return null;
    double minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    for (final loc in locs) {
      if (loc.latitude! < minLat) minLat = loc.latitude!;
      if (loc.latitude! > maxLat) maxLat = loc.latitude!;
      if (loc.longitude! < minLng) minLng = loc.longitude!;
      if (loc.longitude! > maxLng) maxLng = loc.longitude!;
    }
    // Añadir un padding visual
    const pad = 5.0;
    return LatLngBounds(
      LatLng(minLat - pad, minLng - pad),
      LatLng(maxLat + pad, maxLng + pad),
    );
  }

  @override
  Widget build(BuildContext context) => _buildContent(context);

  void _rebuild(VoidCallback fn) => setState(fn);
}
