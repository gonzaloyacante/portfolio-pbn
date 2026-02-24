# 🔐 Guía de Keystore — PBN Admin para Google Play Store

## ¿Qué es un keystore?

Un keystore es un **archivo de firma digital** que identifica que TÚ eres el dueño de la app en Google Play Store. Funciona como:
- Un pasaporte digital de tu app
- Una vez que publicás una app firmada con un keystore, **todas las actualizaciones futuras deben firmarse con el mismo keystore**
- Si perdés el keystore, **no podrás actualizar la app** en Play Store

> ⚠️ **CRÍTICO**: Guardá el keystore y las contraseñas en un lugar SEGURO (ej: 1Password, Bitwarden, o un pen drive guardado físicamente). NO lo subas nunca al repository.

---

## Paso 1: Crear el keystore

Ejecutá este comando desde el directorio raíz del proyecto (`app/`):

```bash
# Crear directorio para guardar el keystore
mkdir -p keystore

# Generar el keystore (Java debe estar instalado, viene con Flutter)
keytool -genkey -v \
  -keystore keystore/pbn-admin-release.jks \
  -storetype JKS \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias pbn-admin
```

**Se te pedirá:**
- **Contraseña del keystore**: Elige una contraseña fuerte (mínimo 8 caracteres). Anotala.
- **Nombre y apellido**: Puede ser el nombre del desarrollador o de la empresa
- **Unidad organizativa**: Puede ser "Development" o dejarlo vacío
- **Organización**: "Paola Bolívar Nievas" o lo que prefieras
- **Ciudad**: Tu ciudad
- **Estado/Provincia**: Tu estado
- **País (2 letras)**: "ES" para España, "AR" para Argentina
- **¿Es correcto?**: Escribe "sí" o "yes"
- **Contraseña de la clave**: Podés usar la misma que el store o una diferente. Anotala.

---

## Paso 2: Configurar key.properties

```bash
# Desde el directorio android/
cp key.properties.example key.properties
```

Editá `android/key.properties` con los valores reales:

```properties
storeFile=../keystore/pbn-admin-release.jks
storePassword=TU_CONTRASEÑA_DEL_STORE
keyAlias=pbn-admin
keyPassword=TU_CONTRASEÑA_DE_LA_CLAVE
```

---

## Paso 3: Verificar que está en .gitignore

Asegurate de que estos archivos NO se suban al repo:

```
app/keystore/*.jks
app/keystore/*.keystore
app/android/key.properties
```

---

## Paso 4: Generar el Android App Bundle para Play Store

```bash
cd /ruta/a/portfolio-pbn/app

# Generar el App Bundle firmado (formato preferido por Google Play)
flutter build appbundle --release

# El archivo resultante estará en:
# build/app/outputs/bundle/release/app-release.aab
```

---

## Paso 5: Subir a Google Play Console

1. Ve a [play.google.com/console](https://play.google.com/console)
2. Crea una nueva app → Selecciona "App" → "Android"
3. Completa la información básica (nombre, idioma, app o juego)
4. En "Producción" → "Crear nueva versión"
5. **Play App Signing** (muy importante): 
   - Activá "Play App Signing" (Google guarda una copia de tu clave en sus servidores)
   - Esto protege tu app si perdés el keystore original
6. Subí el `.aab` generado en el paso anterior
7. Completá los metadatos requeridos (descripción, screenshots, etc.)

---

## Guardar keystore de forma segura

### Opción 1: 1Password / Bitwarden
- Subí el archivo `.jks` como adjunto al vault
- Guardá las contraseñas en campos separados

### Opción 2: GitHub Secrets (para CI/CD)
```bash
# Convertir el keystore a Base64
base64 -i keystore/pbn-admin-release.jks | pbcopy

# Agregar como secret en GitHub:
# Settings → Secrets and variables → Actions
# - KEYSTORE_BASE64: el base64 del .jks
# - KEY_ALIAS: pbn-admin
# - KEY_PASSWORD: tu contraseña de clave
# - STORE_PASSWORD: tu contraseña del store
```

---

## Construir APK para testing (no para Play Store)

```bash
# APK universal (más grande, para testing)
flutter build apk --release

# APKs separados por arquitectura (más pequeños)
flutter build apk --split-per-abi --release

# Los archivos estarán en:
# build/app/outputs/flutter-apk/app-arm64-v8a-release.apk
# build/app/outputs/flutter-apk/app-x86_64-release.apk
```

---

## ¿Dónde instalo el APK en mi teléfono para probar?

```bash
# Con el teléfono conectado por USB y debugging habilitado:
adb install build/app/outputs/flutter-apk/app-arm64-v8a-release.apk

# O compartilo por Google Drive / WhatsApp y abrilo desde el teléfono
# (necesitarás activar "Instalar apps desconocidas" en Configuración)
```
