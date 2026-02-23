import 'package:freezed_annotation/freezed_annotation.dart';

part 'trash_model.freezed.dart';

@freezed
class TrashItem with _$TrashItem {
  const factory TrashItem({
    required String id,
    required String type,
    required String displayName,
    required DateTime deletedAt,
  }) = _TrashItem;

  factory TrashItem.fromMap(String type, Map<String, dynamic> json) {
    final displayName =
        json['title'] as String? ??
        json['name'] as String? ??
        json['clientName'] as String? ??
        '(sin nombre)';
    return TrashItem(
      id: json['id'] as String,
      type: type,
      displayName: displayName,
      deletedAt: DateTime.parse(json['deletedAt'] as String),
    );
  }
}

/// Etiqueta legible para cada tipo.
String trashTypeLabel(String type) {
  const labels = {
    'project': 'Proyecto',
    'category': 'Categoría',
    'service': 'Servicio',
    'testimonial': 'Testimonio',
    'contact': 'Contacto',
    'booking': 'Reserva',
  };
  return labels[type] ?? type;
}
