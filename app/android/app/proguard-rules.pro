# ─────────────────────────────────────────────────────────────────────────────
# ProGuard / R8 – PBN Admin Flutter App
# ─────────────────────────────────────────────────────────────────────────────
# R8 compila, minifica y ofusca el código primero, luego ProGuard aplica
# estas reglas. Mantener al mínimo — R8 es inteligente con el tree shaking.

# ── Flutter Engine ────────────────────────────────────────────────────────────
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }
-dontwarn io.flutter.embedding.**

# ── Firebase ──────────────────────────────────────────────────────────────────
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# ── Sentry ────────────────────────────────────────────────────────────────────
-keep class io.sentry.** { *; }
-dontwarn io.sentry.**

# ── Google Sign-In ────────────────────────────────────────────────────────────
-keep class com.google.android.gms.auth.** { *; }
-keep class com.google.android.gms.common.** { *; }

# ── SQLite / Drift ────────────────────────────────────────────────────────────
-keep class org.sqlite.** { *; }
-keep class org.sqlite.database.** { *; }

# ── OkHttp / Retrofit (usado internamente por algunos plugins) ────────────────
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# ── Kotlin ────────────────────────────────────────────────────────────────────
-keep class kotlin.** { *; }
-keep class kotlinx.** { *; }
-dontwarn kotlin.**
-dontwarn kotlinx.**

# ── AndroidX ──────────────────────────────────────────────────────────────────
-keep class androidx.** { *; }
-dontwarn androidx.**

# ── flutter_secure_storage ────────────────────────────────────────────────────
# Accede a AndroidKeyStore, cifra con AES/GCM. Preservar reflexión.
-keep class com.it_nomads.fluttersecurestorage.** { *; }
-keep class com.it_nomads.fluttersecurestorage.ciphers.** { *; }

# ── image_picker ──────────────────────────────────────────────────────────────
-keep class io.flutter.plugins.imagepicker.** { *; }

# ── image_cropper ─────────────────────────────────────────────────────────────
-keep class com.yalantis.ucrop.** { *; }
-dontwarn com.yalantis.ucrop.**

# ── open_file (in-app APK installer) ─────────────────────────────────────────
# El plugin usa un FileProvider personalizado y reflection para abrir archivos.
-keep class com.crazecoder.openfile.** { *; }
-keep class com.crazecoder.openfile.utils.FileProvider { *; }

# ── flutter_local_notifications ──────────────────────────────────────────────
-keep class com.dexterous.flutterlocalnotifications.** { *; }
-keep class com.dexterous.flutterlocalnotifications.models.** { *; }

# ── shared_preferences ────────────────────────────────────────────────────────
-keep class io.flutter.plugins.sharedpreferences.** { *; }

# ── url_launcher ──────────────────────────────────────────────────────────────
-keep class io.flutter.plugins.urllauncher.** { *; }

# ── path_provider ─────────────────────────────────────────────────────────────
-keep class io.flutter.plugins.pathprovider.** { *; }

# ── package_info_plus ─────────────────────────────────────────────────────────
-keep class dev.fluttercommunity.plus.packageinfo.** { *; }

# ── connectivity_plus ─────────────────────────────────────────────────────────
-keep class dev.fluttercommunity.plus.connectivity.** { *; }

# ── camera / image_picker native ─────────────────────────────────────────────
-keep class io.flutter.plugins.camera.** { *; }

# ── Mantener anotaciones de debug para Sentry (stack traces legibles) ─────────
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions

# Subir el mapping.txt a Sentry para deobfuscar stack traces:
# app/build/app/outputs/mapping/release/mapping.txt
# → https://docs.sentry.io/platforms/android/proguard/
