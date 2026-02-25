#!/usr/bin/env bash
# =============================================================================
# setup_keystore.sh
# =============================================================================
# Script de configuración inicial del keystore de firma para la app Android.
#
# Uso (desde la raíz del monorepo o desde app/):
#   bash app/scripts/setup_keystore.sh
#
# Genera:
#   app/keystore/upload.jks        ← keystore (gitignored, NO commitear)
#   app/android/key.properties     ← propiedades de firma (gitignored)
#
# Requerimientos:
#   - Java JDK instalado (keytool debe estar en PATH)
#   - Ejecutar solo una vez por entorno (desarrollo o CI)
# =============================================================================

set -euo pipefail

# ── Colores ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ── Ruta absoluta del script ──────────────────────────────────────────────────
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
KEYSTORE_DIR="$APP_DIR/keystore"
KEYSTORE_FILE="$KEYSTORE_DIR/upload.jks"
KEY_PROPERTIES="$APP_DIR/android/key.properties"

# ── Pre-checks ────────────────────────────────────────────────────────────────
command -v keytool >/dev/null 2>&1 || error "keytool no encontrado. Instala Java JDK."

if [[ -f "$KEYSTORE_FILE" ]]; then
  warn "Ya existe un keystore en: $KEYSTORE_FILE"
  read -r -p "¿Sobreescribir? (s/N): " confirm
  [[ "${confirm,,}" == "s" ]] || { info "Cancelado."; exit 0; }
fi

# ── Crear directorio keystore ─────────────────────────────────────────────────
mkdir -p "$KEYSTORE_DIR"

# ── Datos del certificado ─────────────────────────────────────────────────────
info "Generando keystore de firma para Portfolio PBN Admin..."
echo ""
echo "Se pedirán dos contraseñas (store password y key password)."
echo "Usa una contraseña larga y segura. GUÁRDALA en un lugar seguro (no en el repo)."
echo ""

# ── Generar keystore ──────────────────────────────────────────────────────────
keytool -genkey -v \
  -keystore "$KEYSTORE_FILE" \
  -storetype JKS \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias "portfolio-pbn" \
  -dname "CN=Portfolio PBN, OU=Admin App, O=Paola Bolivar Nievas, L=Buenos Aires, S=Buenos Aires, C=AR"

# ── Pedir contraseñas para key.properties ─────────────────────────────────────
echo ""
read -r -s -p "Store password (escribe la que usaste arriba): " STORE_PASS
echo ""
read -r -s -p "Key password (misma que store password si no la cambiaste): " KEY_PASS
echo ""

# ── Crear key.properties ──────────────────────────────────────────────────────
cat > "$KEY_PROPERTIES" <<EOF
# ⚠️  ARCHIVO SENSIBLE — NO COMMITEAR AL REPOSITORIO
# Este archivo contiene rutas y contraseñas del keystore de firma.
# Está en .gitignore. Trátalo como una variable de entorno privada.
storePassword=$STORE_PASS
keyPassword=$KEY_PASS
keyAlias=portfolio-pbn
storeFile=$KEYSTORE_FILE
EOF

info "✅ Keystore generado en:    $KEYSTORE_FILE"
info "✅ key.properties creado en: $KEY_PROPERTIES"
echo ""
warn "IMPORTANTE: Haz un backup del archivo $KEYSTORE_FILE en un lugar seguro."
warn "Si pierdes el keystore NO podrás actualizar la app en Play Store/Firebase."
