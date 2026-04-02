part of 'trash_item_detail_page.dart';

// ── Definición de campos por tipo ─────────────────────────────────────────────

class _FieldDef {
  const _FieldDef(this.key, this.label, this.icon, {this.fieldType});
  final String key;
  final String label;
  final IconData icon;

  /// null = texto plano, 'bool', 'date', 'rating', 'price'
  final String? fieldType;
}

const _fieldsByType = <String, List<_FieldDef>>{
  'category': [
    _FieldDef('description', 'Descripción', Icons.description_outlined),
    _FieldDef(
      'isActive',
      'Activo',
      Icons.toggle_on_outlined,
      fieldType: 'bool',
    ),
    _FieldDef(
      'createdAt',
      'Creado',
      Icons.calendar_today_outlined,
      fieldType: 'date',
    ),
  ],
  'service': [
    _FieldDef('description', 'Descripción', Icons.description_outlined),
    _FieldDef('price', 'Precio', Icons.euro_outlined, fieldType: 'price'),
    _FieldDef('duration', 'Duración (min)', Icons.timer_outlined),
    _FieldDef(
      'isAvailable',
      'Disponible',
      Icons.check_circle_outline,
      fieldType: 'bool',
    ),
    _FieldDef(
      'isActive',
      'Activo',
      Icons.toggle_on_outlined,
      fieldType: 'bool',
    ),
    _FieldDef(
      'createdAt',
      'Creado',
      Icons.calendar_today_outlined,
      fieldType: 'date',
    ),
  ],
  'testimonial': [
    _FieldDef('text', 'Testimonio', Icons.format_quote_outlined),
    _FieldDef('position', 'Cargo', Icons.work_outline),
    _FieldDef('company', 'Empresa', Icons.business_outlined),
    _FieldDef('rating', 'Valoración', Icons.star_outline, fieldType: 'rating'),
    _FieldDef(
      'verified',
      'Verificado',
      Icons.verified_outlined,
      fieldType: 'bool',
    ),
    _FieldDef(
      'createdAt',
      'Creado',
      Icons.calendar_today_outlined,
      fieldType: 'date',
    ),
  ],
  'contact': [
    _FieldDef('email', 'Email', Icons.email_outlined),
    _FieldDef('phone', 'Teléfono', Icons.phone_outlined),
    _FieldDef('subject', 'Asunto', Icons.subject_outlined),
    _FieldDef('message', 'Mensaje', Icons.message_outlined),
    _FieldDef('status', 'Estado', Icons.info_outline),
    _FieldDef(
      'createdAt',
      'Recibido',
      Icons.calendar_today_outlined,
      fieldType: 'date',
    ),
  ],
  'booking': [
    _FieldDef('email', 'Email', Icons.email_outlined),
    _FieldDef('phone', 'Teléfono', Icons.phone_outlined),
    _FieldDef('notes', 'Notas', Icons.note_outlined),
    _FieldDef('status', 'Estado', Icons.info_outline),
    _FieldDef(
      'startTime',
      'Inicio',
      Icons.schedule_outlined,
      fieldType: 'date',
    ),
    _FieldDef('endTime', 'Fin', Icons.schedule_outlined, fieldType: 'date'),
    _FieldDef(
      'createdAt',
      'Creado',
      Icons.calendar_today_outlined,
      fieldType: 'date',
    ),
  ],
};
