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

# ── Mantener anotaciones de debug para Sentry (stack traces legibles) ─────────
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions

# Opcional: si quieres stack traces completamente legibles en Sentry,
# sube el mapping.txt generado en build/app/outputs/mapping/release/
