# Portfolio PBN — App Admin (Flutter)

App de administración nativa para Android/iOS del portfolio de Paola Bolívar Nievas. Gestiona todo el contenido del sitio web desde cualquier dispositivo con soporte offline y notificaciones push en tiempo real.

---

## Arquitectura

Clean Architecture + Feature-Based con Riverpod como state management.

```
lib/
├── core/          # infraestructura transversal (auth, API, DB, router, theme)
├── shared/        # widgets y modelos reutilizables entre features
└── features/      # cada feature: presentation/ + data/ + providers/
    ├── auth/
    ├── dashboard/
    ├── projects/
    ├── categories/
    ├── services/
    ├── testimonials/
    ├── contacts/
    ├── calendar/
    ├── settings/
    └── account/
```

## Comandos

```bash
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs  # code-gen
flutter analyze          # análisis estático (0 warnings)
flutter test             # tests
flutter run              # dev en dispositivo/emulador
```

## Distribución

La app se distribuye via Firebase App Distribution al grupo `admin`.

```bash
# Primera vez: generar keystore
bash scripts/setup_keystore.sh

# Distribuir nueva versión
bash scripts/distribute.sh

# Con mensaje personalizado
bash scripts/distribute.sh --release-notes "Nuevas notificaciones push"
```

Requiere: `firebase-tools` instalado (`npm install -g firebase-tools`) y `firebase login` completado.

## Notificaciones push

El sistema de notificaciones push usa FCM. Los permisos se solicitan al hacer login. Las preferencias se configuran en **Preferencias → Notificaciones**:

- Mensajes de contacto
- Nuevas reservas
- Recordatorios de reservas (24h / 1h antes)
- Proyectos publicados
- Servicios actualizados
- Testimoniales recibidos
- Alertas del sistema

## Variables de entorno

El archivo `.env` (gitignored) va en la raíz de `app/`. Ver `app/core/config/env_config.dart` para las variables requeridas.

## Archivos sensibles (gitignored)

- `android/app/google-services.json`
- `ios/Runner/GoogleService-Info.plist`
- `lib/firebase_options.dart`
- `keystore/upload.jks`
- `android/key.properties`
- `.env`

