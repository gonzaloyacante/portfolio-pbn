import java.util.Properties
import java.io.FileInputStream

plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
    // Google Services plugin — necesario para Firebase (leer google-services.json)
    id("com.google.gms.google-services")
}

// ── Carga de propiedades de firma ─────────────────────────────────────────────
// El archivo key.properties debe existir en android/ y estar en .gitignore.
// En CI/CD se genera a partir de secretos del repositorio.
// Ver: app/keystore/README.md para instrucciones de creación.
val keystorePropertiesFile = rootProject.file("key.properties")
val keystoreProperties = Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
    namespace = "es.paolabolivar.admin"
    compileSdk = 36
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
        // Requerido por flutter_local_notifications (desugaring de java.time)
        isCoreLibraryDesugaringEnabled = true
    }

    kotlin {
        // Usa el DSL moderno de KGP 2.x: configurar compilerOptions (no forzar toolchain)
        compilerOptions {
            jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
            // Asegurar versión de lenguaje Kotlin >= 2.0 para compatibilidad con KGP 2.x
            languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
            apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
        }
    }

    defaultConfig {
        applicationId = "es.paolabolivar.admin"
        minSdk = flutter.minSdkVersion        // Android 6.0 – cubre el 97%+ de Android activo
        targetSdk = 35     // Android 15 – requerido por Play Store a partir de 2025
        versionCode = flutter.versionCode
        versionName = flutter.versionName

        // Habilita MultiDex (requerido para apps grandes con >64K métodos)
        multiDexEnabled = true
    }

    // ── Configuración de firma ────────────────────────────────────────────
    signingConfigs {
        create("release") {
            if (keystorePropertiesFile.exists()) {
                // Firma desde key.properties local (desarrollo) o CI (secretos)
                keyAlias = keystoreProperties["keyAlias"] as String? ?: ""
                keyPassword = keystoreProperties["keyPassword"] as String? ?: ""
                storeFile = keystoreProperties["storeFile"]?.let { file(it as String) }
                storePassword = keystoreProperties["storePassword"] as String? ?: ""
            } else {
                // Fallback: variables de entorno (para CI/CD sin archivo local)
                keyAlias = System.getenv("KEY_ALIAS") ?: ""
                keyPassword = System.getenv("KEY_PASSWORD") ?: ""
                val storeFilePath = System.getenv("STORE_FILE")
                storeFile = if (storeFilePath != null) file(storeFilePath) else null
                storePassword = System.getenv("STORE_PASSWORD") ?: ""
            }
        }
    }

    // ── Tipos de build ────────────────────────────────────────────────────
    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
            isDebuggable = true
            isMinifyEnabled = false
            isShrinkResources = false
        }

        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true        // R8 compila + ofusca
            isShrinkResources = true      // Elimina recursos no usados
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    // ── Opciones de empaquetado ───────────────────────────────────────────
    packaging {
        resources {
            excludes += listOf(
                "META-INF/DEPENDENCIES",
                "META-INF/LICENSE",
                "META-INF/LICENSE.txt",
                "META-INF/NOTICE",
                "META-INF/NOTICE.txt",
                "META-INF/*.kotlin_module",
            )
        }
    }
}

flutter {
    source = "../.."
}

dependencies {
    // Core library desugaring: acceso a java.time en API < 26
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")
    // MultiDex para minSdk < 21 (aunque minSdk=23, es buena práctica)
    implementation("androidx.multidex:multidex:2.0.1")
}

