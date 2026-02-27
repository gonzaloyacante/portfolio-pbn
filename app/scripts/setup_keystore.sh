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

# Soporte para modo no interactivo y variables de entorno
NON_INTERACTIVE=0
while [[ ${1:-} != "" ]]; do
  case "$1" in
    --non-interactive|-n)
      NON_INTERACTIVE=1
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# Preferir shasum (mac) o sha256sum
command -v shasum >/dev/null 2>&1 && SHACMD="shasum -a 256" || SHACMD="sha256sum"

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
# Crear directorio keystore
mkdir -p "$KEYSTORE_DIR"

# usar un archivo temporal para evitar artefactos parciales si el script se interrumpe
TMP_KEYSTORE="$KEYSTORE_FILE.tmp"

cleanup_partial() {
  if [[ -f "$TMP_KEYSTORE" ]]; then
    rm -f "$TMP_KEYSTORE" || true
  fi
}
trap cleanup_partial EXIT

# ── Datos del certificado ─────────────────────────────────────────────────────
info "Generando keystore de firma para Portfolio PBN Admin..."
echo ""
echo "Se pedirán dos contraseñas (store password y key password)."
echo "Usa una contraseña larga y segura. GUÁRDALA en un lugar seguro (no en el repo)."
echo ""

# ── Generar keystore ──────────────────────────────────────────────────────────
# Valores por defecto para el DN (personalízalos si hace falta)
DN_CN="Portfolio PBN"
DN_OU="Admin App"
DN_O="Paola Bolivar Nieves"
DN_L="Granada"
DN_S="Granada"
DN_C="ES"

DN_CN="${DN_CN:-Portfolio PBN}"
DN_OU="${DN_OU:-Admin App}"
DN_O="${DN_O:-Paola Bolivar Nieves}"
DN_L="${DN_L:-Granada}"
DN_S="${DN_S:-Granada}"
DN_C="${DN_C:-ES}"

# Contraseñas desde env vars si se solicita modo no interactivo
if [[ "$NON_INTERACTIVE" -eq 1 ]]; then
  if [[ -z "${KEYSTORE_STORE_PASS:-}" || -z "${KEYSTORE_KEY_PASS:-}" ]]; then
    error "Modo no interactivo requiere KEYSTORE_STORE_PASS y KEYSTORE_KEY_PASS en el entorno"
  fi
  STORE_PASS="$KEYSTORE_STORE_PASS"
  KEY_PASS="$KEYSTORE_KEY_PASS"
fi

keytool -genkey -v \
  -keystore "$TMP_KEYSTORE" \
  -storetype JKS \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias "portfolio-pbn" \
  -dname "CN=${DN_CN}, OU=${DN_OU}, O=${DN_O}, L=${DN_L}, S=${DN_S}, C=${DN_C}"

# ── Pedir contraseñas para key.properties ─────────────────────────────────────
echo ""
if [[ "$NON_INTERACTIVE" -ne 1 ]]; then
  read -r -s -p "Store password (escribe la que usaste arriba): " STORE_PASS
  echo ""
  read -r -s -p "Key password (misma que store password si no la cambiaste): " KEY_PASS
  echo ""
else
  # ya están cargadas desde las env vars
  KEY_PASS="$KEY_PASS"
fi

# ── Crear key.properties ──────────────────────────────────────────────────────
if [[ -f "$KEY_PROPERTIES" ]]; then
  timestamp=$(date +%s)
  cp "$KEY_PROPERTIES" "${KEY_PROPERTIES}.bak.$timestamp"
  warn "Se creó backup de key.properties en: ${KEY_PROPERTIES}.bak.$timestamp"
fi

umask 077
cat > "$KEY_PROPERTIES" <<EOF
# ⚠️  ARCHIVO SENSIBLE — NO COMMITEAR AL REPOSITORIO
# Este archivo contiene rutas y contraseñas del keystore de firma.
# Está en .gitignore. Trátalo como una variable de entorno privada.
storePassword=$STORE_PASS
keyPassword=$KEY_PASS
keyAlias=portfolio-pbn
storeFile=$KEYSTORE_FILE
EOF
chmod 600 "$KEY_PROPERTIES"

# Mover keystore temporal a su ubicación final y asegurar permisos
mv "$TMP_KEYSTORE" "$KEYSTORE_FILE"
chmod 600 "$KEYSTORE_FILE"

# Generar checksum SHA256 para referencia/backup
if command -v shasum >/dev/null 2>&1 || command -v sha256sum >/dev/null 2>&1; then
  $SHACMD "$KEYSTORE_FILE" > "${KEYSTORE_FILE}.sha256"
  info "Checksum SHA256 guardado en: ${KEYSTORE_FILE}.sha256"
fi

# Evitar que cleanup borre el keystore final
trap - EXIT

info "✅ Keystore generado en:    $KEYSTORE_FILE"
info "✅ key.properties creado en: $KEY_PROPERTIES"
echo ""
warn "IMPORTANTE: Haz un backup del archivo $KEYSTORE_FILE en un lugar seguro."
warn "Si pierdes el keystore NO podrás actualizar la app en Play Store/Firebase."
