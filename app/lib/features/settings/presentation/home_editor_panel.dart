import 'package:flutter/material.dart';

/// Panel del editor de Inicio (CMS home). Misma ruta `settingsHome`, UX tipo web.
enum HomeEditorPanel {
  texts,
  immersive,
  heroImage,
  illustration,
  cta,
  featured,
  position,
  mobile,
}

extension HomeEditorPanelX on HomeEditorPanel {
  String get label => switch (this) {
    HomeEditorPanel.texts => 'Textos',
    HomeEditorPanel.immersive => 'Fondo inmersivo',
    HomeEditorPanel.heroImage => 'Foto hero',
    HomeEditorPanel.illustration => 'Ilustración',
    HomeEditorPanel.cta => 'CTA',
    HomeEditorPanel.featured => 'Destacados',
    HomeEditorPanel.position => 'Capas',
    HomeEditorPanel.mobile => 'Móvil',
  };

  IconData get icon => switch (this) {
    HomeEditorPanel.texts => Icons.title_rounded,
    HomeEditorPanel.immersive => Icons.wallpaper_outlined,
    HomeEditorPanel.heroImage => Icons.image_outlined,
    HomeEditorPanel.illustration => Icons.brush_outlined,
    HomeEditorPanel.cta => Icons.touch_app_outlined,
    HomeEditorPanel.featured => Icons.star_outline_rounded,
    HomeEditorPanel.position => Icons.layers_outlined,
    HomeEditorPanel.mobile => Icons.smartphone_outlined,
  };
}
