import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.jetbrains.kotlin.gradle.dsl.KotlinVersion
import com.android.build.api.dsl.CommonExtension

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}
subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}

// Configurar opciones del compilador Kotlin para todos los subproyectos
subprojects {
    tasks.withType<KotlinCompile>().configureEach {
        compilerOptions {
            // Forzar lenguaje y API Kotlin >= 2.0 para compatibilidad con KGP 2.x
            languageVersion.set(KotlinVersion.KOTLIN_2_0)
            apiVersion.set(KotlinVersion.KOTLIN_2_0)
        }
    }
}

// Forzar compileSdk para subproyectos Android (plugins y librerías) — evita
// errores CheckAarMetadata cuando dependencias requieren API 34+.
subprojects {
    if (plugins.hasPlugin("com.android.library") || plugins.hasPlugin("com.android.application")) {
        val androidExt = extensions.findByName("android")
        if (androidExt != null) {
            try {
                // Intentar llamadas comunes por reflexión para establecer compileSdk
                val setCompileSdk = androidExt.javaClass.methods.firstOrNull { m ->
                    m.name.equals("setCompileSdk", ignoreCase = true) ||
                    m.name.equals("setCompileSdkVersion", ignoreCase = true)
                }
                if (setCompileSdk != null) {
                    setCompileSdk.invoke(androidExt, 36)
                } else {
                    // Fallback: tratar de llamar a la propiedad vía método 'compileSdk'
                    val compileProp = androidExt.javaClass.methods.firstOrNull { it.name == "compileSdk" }
                    if (compileProp != null) {
                        compileProp.invoke(androidExt, 36)
                    }
                }
            } catch (ignored: Exception) {
                // No detener la evaluación si no podemos forzar; Gradle seguirá usando la configuración del módulo
            }
        }
    }
}
