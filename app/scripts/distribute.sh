#!/usr/bin/env bash
# =============================================================================
# distribute.sh
# =============================================================================
# Compila y distribuye la app Android via Firebase App Distribution.
#
# Uso (desde la raíz del monorepo):
#   bash app/scripts/distribute.sh [--release-notes "Descripción de cambios"]
#
# Uso rápido (desde app/):
#   bash scripts/distribute.sh
#
# Opciones:
#   --release-notes, -m   Notas de la versión (default: últimos commits)
#   --group, -g           Grupo de testers Firebase (default: "admin")
#   --no-build            Salta el build y usa el APK más reciente
#   --help, -h            Muestra esta ayuda
#
# Requerimientos previos (solo la primera vez):
#   1. Java JDK instalado (keytool disponible)
#   2. Keystore creado:    bash app/scripts/setup_keystore.sh
#   3. Firebase CLI:       npm install -g firebase-tools
#   4. Login Firebase:     firebase login
#
# El APK generado se sube al grupo "admin" en Firebase App Distribution.
# Los testers recibirán un email para descargar la nueva versión.
#
# App ID Firebase (Android): 1:430047243611:android:8bff75c1627bd6df627e7e
# =============================================================================

set -euo pipefail

# ── Colores ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
step()    { echo -e "${BLUE}[STEP]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ── Constantes ────────────────────────────────────────────────────────────────
FIREBASE_APP_ID="1:430047243611:android:8bff75c1627bd6df627e7e"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
APK_PATH="$APP_DIR/build/app/outputs/flutter-apk/app-release.apk"

# ── Argumentos ────────────────────────────────────────────────────────────────
RELEASE_NOTES=""
TESTER_GROUP="admin"
SKIP_BUILD=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --release-notes|-m) RELEASE_NOTES="$2"; shift 2 ;;
    --group|-g)         TESTER_GROUP="$2"; shift 2 ;;
    --no-build)         SKIP_BUILD=true; shift ;;
    --help|-h)
      sed -n '4,30p' "$0" | sed 's/^# \?//'
      exit 0 ;;
    *) error "Opción desconocida: $1. Usa --help para ver opciones." ;;
  esac
done

# ── Pre-checks ────────────────────────────────────────────────────────────────
command -v flutter >/dev/null 2>&1 || error "flutter no encontrado. Instala Flutter SDK."
command -v firebase >/dev/null 2>&1 || error "firebase CLI no encontrado. Ejecuta: npm install -g firebase-tools"

KEY_PROPERTIES="$APP_DIR/android/key.properties"
if [[ ! -f "$KEY_PROPERTIES" ]]; then
  error "No se encontró $KEY_PROPERTIES\nEjecuta primero: bash app/scripts/setup_keystore.sh"
fi

# ── Release notes auto-generadas ─────────────────────────────────────────────
if [[ -z "$RELEASE_NOTES" ]]; then
  if command -v git >/dev/null 2>&1; then
    cd "$APP_DIR/.."  # Ir a la raíz del monorepo
    RELEASE_NOTES="$(git log --oneline -8 --no-merges 2>/dev/null || echo 'Nueva versión')"
    cd "$APP_DIR"
  else
    RELEASE_NOTES="Nueva versión de Portfolio PBN Admin"
  fi
fi

# ── Header ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Portfolio PBN — Firebase App Distribution       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
info "App ID:   $FIREBASE_APP_ID"
info "Grupo:    $TESTER_GROUP"
echo ""

# ── Paso 1: Flutter pub get ───────────────────────────────────────────────────
if [[ "$SKIP_BUILD" == false ]]; then
  step "1/3 — Actualizando dependencias..."
  cd "$APP_DIR"
  flutter pub get

  # ── Paso 2: Build release APK ──────────────────────────────────────────────
  step "2/3 — Compilando APK release (firmado)..."
  flutter build apk --release \
    --target-platform android-arm64 \
    --obfuscate \
    --split-debug-info="$APP_DIR/build/app/outputs/symbols"

  if [[ ! -f "$APK_PATH" ]]; then
    error "No se generó el APK en: $APK_PATH"
  fi

  APK_SIZE=$(du -sh "$APK_PATH" | cut -f1)
  info "APK generado: $APK_PATH ($APK_SIZE)"
else
  warn "Saltando build — usando APK existente."
  [[ -f "$APK_PATH" ]] || error "No hay APK en: $APK_PATH\nEjecuta sin --no-build para compilar."
fi

# ── Paso 3: Subir a Firebase App Distribution ─────────────────────────────────
step "3/3 — Subiendo a Firebase App Distribution..."
echo ""
echo -e "${YELLOW}Release notes:${NC}"
echo "$RELEASE_NOTES"
echo ""

firebase appdistribution:distribute "$APK_PATH" \
  --app "$FIREBASE_APP_ID" \
  --groups "$TESTER_GROUP" \
  --release-notes "$RELEASE_NOTES"

# ── Fin ───────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅  Distribución completada correctamente           ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
info "Los testers del grupo '$TESTER_GROUP' recibirán un email con el enlace de descarga."
echo ""
