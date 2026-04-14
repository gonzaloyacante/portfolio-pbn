part of 'visitors_map.dart';

extension _VisitorsMapBuilders on _VisitorsMapWidgetState {
  Widget _buildContent(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final geoLocs = _geoLocs;
    final allLocs = widget.locations;

    final maxGeoCount = geoLocs.isEmpty
        ? 1
        : geoLocs.map((l) => l.count).reduce((a, b) => a > b ? a : b);
    final maxAllCount = allLocs.isEmpty
        ? 1
        : allLocs.map((l) => l.count).reduce((a, b) => a > b ? a : b);

    // NOTE: previously we attempted Carto tiles; prefer using primary OSM
    // layer with `tileBuilder` for dark mode to avoid retina/@2x 404s.

    return AppCard(
      elevation: 0,
      borderRadius: AppRadius.forCard,
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Mapa ──────────────────────────────────────────────────────────
          SizedBox(
            height: 260,
            child: geoLocs.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.map_outlined,
                          size: 40,
                          color: colorScheme.onSurface.withValues(
                            alpha: 60 / 255,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          'Sin coordenadas disponibles aún',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: colorScheme.onSurface.withValues(
                              alpha: 100 / 255,
                            ),
                          ),
                        ),
                      ],
                    ),
                  )
                : ColoredBox(
                    color: colorScheme.surface,
                    child: FlutterMap(
                      mapController: _mapCtrl,
                      options: MapOptions(
                        initialCenter: _geoLocs.length == 1
                            ? LatLng(
                                _geoLocs.first.latitude!,
                                _geoLocs.first.longitude!,
                              )
                            : const LatLng(20, 10),
                        initialZoom: _geoLocs.length == 1 ? 4.0 : 1.8,
                        initialCameraFit: _geoBounds != null
                            ? CameraFit.bounds(
                                bounds: _geoBounds!,
                                padding: const EdgeInsets.all(32),
                              )
                            : null,
                        minZoom: 1.0,
                        maxZoom: 8.0,
                        interactionOptions: const InteractionOptions(
                          flags: InteractiveFlag.all & ~InteractiveFlag.rotate,
                        ),
                        onTap: (_, _) => _rebuild(() => _selectedIdx = null),
                      ),
                      children: [
                        // ── Primary tile layer: OpenStreetMap (reliable public tiles)
                        // Use a single, well-known provider to avoid 404/503 from
                        // less-stable endpoints. Keep `retinaMode=false` to avoid
                        // @2x suffixes which caused earlier 404s on some providers.
                        TileLayer(
                          urlTemplate:
                              'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                          subdomains: const ['a', 'b', 'c'],
                          userAgentPackageName: 'dev.portfoliopbn.app',
                          retinaMode: false,
                          tileBuilder: isDark ? darkModeTileBuilder : null,
                        ),

                        // NOTE: If you later want theme-specific styling (dark map),
                        // prefer a dedicated dark tile provider with an API key
                        // or a cached proxy. For now OSM guarantees the map renders.
                        // ── Markers con animación de pulso ──────────────────
                        AnimatedBuilder(
                          animation: _pulseAnim,
                          builder: (context, _) => MarkerLayer(
                            markers: geoLocs.asMap().entries.map((entry) {
                              final idx = entry.key;
                              final loc = entry.value;
                              final ratio = loc.count / maxGeoCount;
                              final isSelected = _selectedIdx == idx;

                              final dotSize = 10.0 + ratio * 18.0;
                              final pulseFactor = isSelected
                                  ? 1.0
                                  : (0.7 + _pulseAnim.value * 0.3);
                              final haloSize = dotSize * 2.8 * pulseFactor;

                              final color = Color.lerp(
                                AppColors.darkPrimary,
                                AppColors.lightPrimary,
                                ratio,
                              )!;

                              return Marker(
                                point: LatLng(loc.latitude!, loc.longitude!),
                                width: dotSize * 4,
                                height: dotSize * 4 + (isSelected ? 36 : 0),
                                alignment: isSelected
                                    ? const Alignment(0, 0.5)
                                    : Alignment.center,
                                child: GestureDetector(
                                  onTap: () => _rebuild(
                                    () =>
                                        _selectedIdx = isSelected ? null : idx,
                                  ),
                                  child: Stack(
                                    alignment: Alignment.center,
                                    clipBehavior: Clip.none,
                                    children: [
                                      // Halo pulsante
                                      Container(
                                        width: haloSize,
                                        height: haloSize,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: color.withValues(
                                            alpha:
                                                (35 * pulseFactor).round() /
                                                255,
                                          ),
                                        ),
                                      ),
                                      // Punto sólido con glow
                                      Container(
                                        width: dotSize,
                                        height: dotSize,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: color,
                                          boxShadow: [
                                            BoxShadow(
                                              color: color.withValues(
                                                alpha:
                                                    (isSelected ? 220 : 140) /
                                                    255,
                                              ),
                                              blurRadius: isSelected ? 14 : 8,
                                              spreadRadius: isSelected ? 3 : 1,
                                            ),
                                          ],
                                        ),
                                      ),
                                      // Tooltip al seleccionar
                                      if (isSelected) ...[
                                        Positioned(
                                          top: 0,
                                          child: Container(
                                            constraints: const BoxConstraints(
                                              maxWidth: 160,
                                            ),
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 10,
                                              vertical: 5,
                                            ),
                                            decoration: BoxDecoration(
                                              color: colorScheme.surface,
                                              borderRadius:
                                                  const BorderRadius.circular(10),
                                              border: Border.all(
                                                color: color.withValues(
                                                  alpha: 120 / 255,
                                                ),
                                                width: 1.5,
                                              ),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: Colors.black
                                                      .withValues(
                                                        alpha: 50 / 255,
                                                      ),
                                                  blurRadius: 12,
                                                  offset: const Offset(0, 4),
                                                ),
                                              ],
                                            ),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Icon(
                                                  Icons.location_on_rounded,
                                                  size: 12,
                                                  color: color,
                                                ),
                                                const SizedBox(width: 4),
                                                Flexible(
                                                  child: Text(
                                                    getCountryDisplayName(
                                                      loc.code,
                                                      loc.label,
                                                    ),
                                                    style: theme
                                                        .textTheme
                                                        .labelSmall
                                                        ?.copyWith(
                                                          fontWeight:
                                                              FontWeight.bold,
                                                          color: colorScheme
                                                              .onSurface,
                                                        ),
                                                    overflow:
                                                        TextOverflow.ellipsis,
                                                  ),
                                                ),
                                                const SizedBox(width: 6),
                                                Container(
                                                  padding:
                                                      const EdgeInsets.symmetric(
                                                        horizontal: 5,
                                                        vertical: 2,
                                                      ),
                                                  decoration: BoxDecoration(
                                                    color: color.withValues(
                                                      alpha: 40 / 255,
                                                    ),
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                          6,
                                                        ),
                                                  ),
                                                  child: Text(
                                                    '${loc.count}',
                                                    style: theme
                                                        .textTheme
                                                        .labelSmall
                                                        ?.copyWith(
                                                          color: color,
                                                          fontWeight:
                                                              FontWeight.w800,
                                                        ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                      ],
                    ),
                  ),
          ),

          // ── Divider sutil ─────────────────────────────────────────────────
          if (allLocs.isNotEmpty) ...[
            Divider(
              height: 1,
              thickness: 1,
              color: colorScheme.outline.withValues(alpha: 40 / 255),
            ),

            // ── Cabecera ranking ───────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.base,
                AppSpacing.sm,
                AppSpacing.base,
                4,
              ),
              child: Text(
                'PAÍSES DE ORIGEN',
                style: theme.textTheme.labelSmall?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: colorScheme.onSurface.withValues(alpha: 100 / 255),
                  letterSpacing: 1.2,
                ),
              ),
            ),

            // ── Lista de ranking ───────────────────────────────────────────
            ...allLocs.asMap().entries.map((entry) {
              final idx = entry.key;
              final loc = entry.value;
              final progress = loc.count / maxAllCount;
              final hasCoords = loc.latitude != null && loc.longitude != null;
              final isSelected = _selectedIdx == idx && hasCoords;
              final color = colorScheme.primary;

              return Material(
                color: isSelected
                    ? color.withValues(alpha: 18 / 255)
                    : Colors.transparent,
                child: InkWell(
                  onTap: hasCoords
                      ? () {
                          _rebuild(
                            () => _selectedIdx = isSelected ? null : idx,
                          );
                          if (!isSelected) {
                            _mapCtrl.move(
                              LatLng(loc.latitude!, loc.longitude!),
                              4.0,
                            );
                          }
                        }
                      : null,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.base,
                      vertical: 6,
                    ),
                    child: Row(
                      children: [
                        // Ranking number
                        SizedBox(
                          width: 20,
                          child: Text(
                            '${idx + 1}',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: colorScheme.onSurface.withValues(
                                alpha: 80 / 255,
                              ),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        // Expand con barra
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Row(
                                      children: [
                                        Flexible(
                                          child: Text(
                                            getCountryDisplayName(
                                              loc.code,
                                              loc.label,
                                            ),
                                            style: theme.textTheme.bodyMedium
                                                ?.copyWith(
                                                  fontWeight: isSelected
                                                      ? FontWeight.bold
                                                      : FontWeight.w500,
                                                ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        if (hasCoords) ...[
                                          const SizedBox(width: 4),
                                          Icon(
                                            Icons.location_on_outlined,
                                            size: 11,
                                            color: colorScheme.primary
                                                .withValues(alpha: 140 / 255),
                                          ),
                                        ],
                                      ],
                                    ),
                                  ),
                                  Text(
                                    '${loc.count}',
                                    style: theme.textTheme.bodySmall?.copyWith(
                                      fontWeight: FontWeight.bold,
                                      color: colorScheme.primary,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              ClipRRect(
                                borderRadius: const BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: progress,
                                  minHeight: 3,
                                  backgroundColor: colorScheme.primary
                                      .withValues(alpha: 25 / 255),
                                  valueColor: AlwaysStoppedAnimation(
                                    isSelected
                                        ? colorScheme.primary
                                        : colorScheme.primary.withValues(
                                            alpha: 180 / 255,
                                          ),
                                  ),
                                ),
                              ),
                              // ── Desglose de ciudades (si existen)
                              if (loc.cities.isNotEmpty) ...[
                                const SizedBox(height: 8),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: loc.cities.take(5).map((city) {
                                    return InkWell(
                                      onTap:
                                          city.latitude != null &&
                                              city.longitude != null
                                          ? () {
                                              // Center map on city with closer zoom
                                              _mapCtrl.move(
                                                LatLng(
                                                  city.latitude!,
                                                  city.longitude!,
                                                ),
                                                8.0,
                                              );
                                              _rebuild(
                                                () => _selectedIdx = idx,
                                              );
                                            }
                                          : null,
                                      child: Padding(
                                        padding: const EdgeInsets.symmetric(
                                          vertical: 2,
                                        ),
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Expanded(
                                              child: Text(
                                                Uri.decodeComponent(city.label),
                                                style: theme.textTheme.bodySmall
                                                    ?.copyWith(
                                                      color: colorScheme
                                                          .onSurface
                                                          .withValues(
                                                            alpha: 160 / 255,
                                                          ),
                                                    ),
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            Text(
                                              '${city.count} • ${city.percent}%',
                                              style: theme.textTheme.bodySmall
                                                  ?.copyWith(
                                                    fontWeight: FontWeight.bold,
                                                    color: colorScheme.primary,
                                                  ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),

            const SizedBox(height: AppSpacing.sm),

            // ── Nota de origen de datos ────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.base,
                0,
                AppSpacing.base,
                AppSpacing.sm,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.info_outline_rounded,
                    size: 11,
                    color: colorScheme.onSurface.withValues(alpha: 80 / 255),
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      'Ubicación estimada por IP (GeoIP). '
                      'Para mayor precisión, el visitante debe aceptar '
                      'la geolocalización en el banner de cookies del sitio.',
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: colorScheme.onSurface.withValues(
                          alpha: 80 / 255,
                        ),
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
