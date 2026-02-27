#!/usr/bin/env bash
# =============================================================================
# distribute.sh
# =============================================================================
# Compila y distribuye la app Android via:
#   1) GitHub Releases           → APK adjunto al release, URL estable y gratuita
#   2) Firebase App Distribution → email a testers
#   3) API in-app update         → notificacion push FCM + dialogo in-app
#
# La URL de descarga se calcula automaticamente desde el pubspec.yaml.
# No se requiere ningun argumento obligatorio.
#
# Uso (desde la raiz del monorepo):
#   bash app/scripts/distribute.sh
#   bash app/scripts/distribute.sh -m "Descripcion de cambios"
#
# Opciones:
#   --release-notes, -m   Notas de la version (default: ultimos commits de git)
#   --group, -g           Grupo de testers Firebase (default: "admins")
#   --api-base-url        URL base del backend (default: https://dev.paolabolivar.es)
#   --no-build            Salta el build y usa el APK existente en build/
#   --dry-run             Simula todos los pasos sin subir ni llamar APIs
#   --confirm             Pide confirmacion interactiva antes de pasos clave
#   --slow                Pausas explicativas entre pasos
#   --retries N           Reintentos en uploads (default: 3)
#   --setup               Instrucciones de configuracion inicial
#   --help, -h            Esta ayuda
#
# Variables de entorno (auto-leidas de web/.env si existen):
#   DEPLOY_SECRET_TOKEN  Token para autenticar el POST al backend.
#                        Generado con: openssl rand -hex 32
#                        Ya esta en web/.env. Anadir tambien en Vercel.
#   API_BASE_URL         URL base del backend.
#
# Requerimientos (solo la primera vez):
#   1. Java JDK instalado
#   2. Keystore Android: bash app/scripts/setup_keystore.sh
#   3. Firebase CLI:     npm install -g firebase-tools && firebase login
#   4. GitHub CLI:       brew install gh && gh auth login
#   5. curl instalado
# =============================================================================

# Exit on error, undefined var or pipe fail
set -euo pipefail

# ── Colores y utilidades de salida ───────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
step()    { echo -e "${BLUE}[STEP]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

log() { # registro en fichero para auditoría
  ts="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  echo "${ts} $*" >> "$SCRIPT_DIR/distribute.log"
}

maybe_sleep()     { [[ "$SLOW_MODE" == "true" ]] && sleep "$SLEEP_SECONDS" || true; }

confirm_or_exit() {
  if [[ "$CONFIRM" == "true" ]]; then
    read -r -p "$1 (s/N): " ans
    [[ "${ans,,}" == "s" ]] || { info "Cancelado por el usuario."; exit 0; }
  fi
}

run_with_retry() {
  local cmd="$1"; shift
  local tries=0; local max_tries=${RETRY_MAX:-3}
  until eval "$cmd"; do
    tries=$((tries+1))
    warn "Comando falló (intento $tries/$max_tries): $cmd"
    log "FAILED: $cmd (attempt $tries)"
    if [[ $tries -ge $max_tries ]]; then
      error "El comando falló tras $tries intentos: $cmd"
    fi
    sleep 2
  done
}

# ── Constantes ────────────────────────────────────────────────────────────────
FIREBASE_APP_ID="1:430047243611:android:8bff75c1627bd6df627e7e"
GITHUB_REPO="gonzaloyacante/portfolio-pbn"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
REPO_ROOT="$( cd "$APP_DIR/.." && pwd )"
APK_PATH="$APP_DIR/build/app/outputs/flutter-apk/app-release.apk"

# Opciones nuevas: confirmación interactiva, modo lento, dry-run, retries
CONFIRM=false
DRY_RUN=false
SLOW_MODE=false
SLEEP_SECONDS=2
RETRY_MAX=3

# Nueva: opción para forzar una mínima versión soportada (semver)
MIN_VERSION=""

# ── Argumentos ────────────────────────────────────────────────────────────────
RELEASE_NOTES=""
TESTER_GROUP="admins"
SKIP_BUILD=false
API_BASE_URL="${API_BASE_URL:-https://dev.paolabolivar.es}"
DEPLOY_SECRET_TOKEN="${DEPLOY_SECRET_TOKEN:-}"

# Leer MIN_VERSION desde argumento si se pasa

# Auto-leer DEPLOY_SECRET_TOKEN de web/.env si no está en el entorno
if [[ -z "$DEPLOY_SECRET_TOKEN" && -f "$REPO_ROOT/web/.env" ]]; then
  DEPLOY_SECRET_TOKEN=$(grep -E '^DEPLOY_SECRET_TOKEN=' "$REPO_ROOT/web/.env" \
    | head -1 | sed "s/DEPLOY_SECRET_TOKEN=//; s/\"//g; s/'//g" || true)
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --release-notes|-m) RELEASE_NOTES="$2"; shift 2 ;;
    --group|-g)         TESTER_GROUP="$2"; shift 2 ;;
    --min-version|-M)   MIN_VERSION="$2"; shift 2 ;;
    --api-base-url)     API_BASE_URL="$2"; shift 2 ;;
    --no-build)         SKIP_BUILD=true; shift ;;
    --confirm)          CONFIRM=true; shift ;;
    --dry-run)          DRY_RUN=true; shift ;;
    --slow)             SLOW_MODE=true; SLEEP_SECONDS=3; shift ;;
    --retries|-r)       RETRY_MAX="$2"; shift 2 ;;
    --setup)
      echo "Requisitos:"
      echo "  1. bash app/scripts/setup_keystore.sh"
      echo "  2. npm install -g firebase-tools && firebase login"
      echo "  3. brew install gh && gh auth login"
      echo "  4. DEPLOY_SECRET_TOKEN ya en web/.env — anadir en Vercel"
      exit 0 ;;
    --help|-h)
      sed -n '4,50p' "$0" | sed 's/^# \?//'
      exit 0 ;;
    *) error "Opcion desconocida: '$1'. Usa --help." ;;
  esac
done

# ── Pre-checks ────────────────────────────────────────────────────────────────
command -v flutter  >/dev/null 2>&1 || error "flutter no encontrado. Instala Flutter SDK."
command -v firebase >/dev/null 2>&1 || error "firebase no encontrado. Ejecuta: npm install -g firebase-tools"
command -v gh       >/dev/null 2>&1 || error "GitHub CLI (gh) no encontrado. Ejecuta: brew install gh && gh auth login"
command -v curl     >/dev/null 2>&1 || error "curl no encontrado."

[[ -f "$APP_DIR/android/key.properties" ]] || \
  error "No se encontro key.properties. Ejecuta: bash app/scripts/setup_keystore.sh"

gh auth status >/dev/null 2>&1 || \
  error "GitHub CLI no autenticado. Ejecuta: gh auth login"

# ── Version y URL de GitHub Releases ────────────────────────────────────────
PUBSPEC_VERSION=$(grep '^version:' "$APP_DIR/pubspec.yaml" | awk '{print $2}' | tr -d '\r')
APP_VERSION=$(echo "$PUBSPEC_VERSION" | cut -d'+' -f1)
APP_VERSION_CODE=$(echo "$PUBSPEC_VERSION" | cut -d'+' -f2)
RELEASE_TAG="app/v${APP_VERSION}"
APK_FILENAME="portfolio-pbn-admin-v${APP_VERSION}.apk"
# URL predecible calculada antes de hacer el release
DOWNLOAD_URL="https://github.com/${GITHUB_REPO}/releases/download/${RELEASE_TAG}/${APK_FILENAME}"

# ── Release notes auto-generadas ─────────────────────────────────────────────
if [[ -z "$RELEASE_NOTES" ]]; then
  cd "$REPO_ROOT"
  RELEASE_NOTES="$(git log --oneline -8 --no-merges 2>/dev/null | sed 's/^/- /' || echo '- Nueva version')"
  cd "$APP_DIR"
fi

# ── Header ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Portfolio PBN — App Distribution                    ║${NC}"
echo -e "${BLUE}╠══════════════════════════════════════════════════════════╣${NC}"
info "Version:  v${APP_VERSION}+${APP_VERSION_CODE}"
info "Firebase: grupo '${TESTER_GROUP}'"
info "Release:  ${RELEASE_TAG}"
info "API:      ${API_BASE_URL}"
[[ -n "$MIN_VERSION" ]] && info "minVersion: ${MIN_VERSION}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
[[ "$DRY_RUN" == "true" ]] && warn "DRY-RUN activo — ningun cambio real." && echo ""

# ── Paso 1: Flutter pub get ───────────────────────────────────────────────────
if [[ "$SKIP_BUILD" == false ]]; then
  step "1/5 — flutter pub get"
  cd "$APP_DIR"
  maybe_sleep
  if [[ "$DRY_RUN" == "true" ]]; then
    info "(dry-run) flutter pub get -- simulado"
    log "DRYRUN: flutter pub get"
  else
    flutter pub get
  fi

  # ── Paso 2: Mostrar entorno y checks ───────────────────────────────────────
  step "2/5 — Verificando entorno"
  info "Flutter: $(flutter --version 2>/dev/null | head -n1 || echo 'no disponible')"
  info "Java:    $(java -version 2>&1 | head -n1 || echo 'no disponible')"
  info "gh:      $(gh --version 2>/dev/null | head -n1 || echo 'no disponible')"
  maybe_sleep
  df -h . | sed -n '1,2p'

  # ── Paso 3: Build release APK ──────────────────────────────────────────────
  step "3/5 — flutter build apk --release"
  maybe_sleep
  if [[ "$DRY_RUN" == "true" ]]; then
    info "(dry-run) flutter build apk --release ... --simulado"
    log "DRYRUN: flutter build apk --release"
  else
    flutter build apk --release \
      --target-platform android-arm64 \
      --obfuscate \
      --split-debug-info="$APP_DIR/build/app/outputs/symbols"
  fi

  if [[ ! -f "$APK_PATH" && "$DRY_RUN" == "false" ]]; then
    error "No se generó el APK en: $APK_PATH"
  fi

  APK_SIZE=$(du -sh "$APK_PATH" 2>/dev/null | cut -f1 || echo 'n/a')
  info "APK generado: $APK_PATH ($APK_SIZE)"
else
  warn "Saltando build — usando APK existente."
  [[ -f "$APK_PATH" ]] || error "No hay APK en: $APK_PATH\nEjecuta sin --no-build para compilar."
fi

maybe_sleep

# ── PASO 4 — GitHub Releases ────────────────────────────────────────────────
step "4/5 — GitHub Releases (${RELEASE_TAG})"
echo -e "${YELLOW}Release notes:${NC}"
echo "$RELEASE_NOTES"
echo ""

if [[ "$DRY_RUN" == "true" ]]; then
  info "(dry-run) gh release create/upload ${RELEASE_TAG} -> ${APK_FILENAME}"
  log "DRYRUN: gh release ${RELEASE_TAG}"
else
  confirm_or_exit "Confirmar publicacion en GitHub Releases?"
  if gh release view "$RELEASE_TAG" --repo "$GITHUB_REPO" >/dev/null 2>&1; then
    info "El release ${RELEASE_TAG} ya existe — actualizando APK (--clobber)..."
    gh release upload "$RELEASE_TAG" "${APK_PATH}#${APK_FILENAME}" --clobber --repo "$GITHUB_REPO"
  else
    info "Creando release ${RELEASE_TAG}..."
    gh release create "$RELEASE_TAG" \
      --title "App v${APP_VERSION}" \
      --notes "$RELEASE_NOTES" \
      --latest \
      --repo "$GITHUB_REPO" \
      "${APK_PATH}#${APK_FILENAME}"
  fi
  info "  URL: $DOWNLOAD_URL"
  log "SUCCESS: GitHub Release ${RELEASE_TAG}"
fi
maybe_sleep

# ── PASO 4b — Firebase App Distribution ─────────────────────────────────────
step "4b — Firebase App Distribution (grupo: ${TESTER_GROUP})"
if [[ "$DRY_RUN" == "true" ]]; then
  info "(dry-run) firebase appdistribution:distribute"
  log "DRYRUN: firebase appdistribution:distribute"
else
  confirm_or_exit "Confirmar subida a Firebase App Distribution?"
  maybe_sleep
  run_with_retry "firebase appdistribution:distribute \"$APK_PATH\" --app \"$FIREBASE_APP_ID\" --groups \"$TESTER_GROUP\" --release-notes \"$RELEASE_NOTES\""
  info "Testers notificados por email."
  log "SUCCESS: Firebase App Distribution v${APP_VERSION}"
fi
maybe_sleep

# ── PASO 5 — API in-app update ───────────────────────────────────────────────
step "5/5 — API in-app update"

if [[ -z "$DEPLOY_SECRET_TOKEN" ]]; then
  warn "DEPLOY_SECRET_TOKEN vacio — se omite notificacion in-app."
  warn "Asegurate de que web/.env contiene DEPLOY_SECRET_TOKEN"
  warn "y de haberlo anadido en Vercel -> Settings -> Environment Variables."
else
  if command -v sha256sum >/dev/null 2>&1; then
    APK_CHECKSUM=$(sha256sum "$APK_PATH" | awk '{print $1}')
  elif command -v shasum >/dev/null 2>&1; then
    APK_CHECKSUM=$(shasum -a 256 "$APK_PATH" | awk '{print $1}')
  else
    APK_CHECKSUM=""
    warn "shasum no disponible — se envia checksum vacio."
  fi

  APK_SIZE_BYTES=$(stat -f%z "$APK_PATH" 2>/dev/null || stat -c%s "$APK_PATH" 2>/dev/null || echo "0")

  info "SHA-256: ${APK_CHECKSUM:-n/a}"
  info "Bytes:   $APK_SIZE_BYTES"
  info "URL:     $DOWNLOAD_URL"

  RELEASE_NOTES_ESC=$(echo "$RELEASE_NOTES" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))' 2>/dev/null || echo "\"$RELEASE_NOTES\"")
  # Construir JSON de release; añadimos minVersion solo si existe
  RELEASE_JSON="{\"version\":\"${APP_VERSION}\",\"versionCode\":${APP_VERSION_CODE},\"releaseNotes\":${RELEASE_NOTES_ESC},\"downloadUrl\":\"${DOWNLOAD_URL}\",\"checksumSha256\":\"${APK_CHECKSUM}\",\"fileSizeBytes\":${APK_SIZE_BYTES}"
  if [[ -n "${MIN_VERSION}" ]]; then
    # Escapar cualquier comilla (aunque MIN_VERSION debería ser simple semver)
    RELEASE_JSON=\"${RELEASE_JSON},\\\"minVersion\\\":\\\"${MIN_VERSION}\\\"\"
    # El contenido anterior quedó con barras adicionales por la concatenación; reconstruimos correctamente
    # (hacerlo de forma segura sin jq para evitar nuevas dependencias)
    RELEASE_JSON="{\"version\":\"${APP_VERSION}\",\"versionCode\":${APP_VERSION_CODE},\"releaseNotes\":${RELEASE_NOTES_ESC},\"downloadUrl\":\"${DOWNLOAD_URL}\",\"checksumSha256\":\"${APK_CHECKSUM}\",\"fileSizeBytes\":${APK_SIZE_BYTES},\"minVersion\":\"${MIN_VERSION}\"}"
  else
    RELEASE_JSON="${RELEASE_JSON}}"
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    info "(dry-run) POST ${API_BASE_URL}/api/admin/app/latest-release"
    log "DRYRUN: POST release API v${APP_VERSION}"
  else
    API_RESPONSE=$(curl -s -w "\n%{http_code}" \
      -X POST "${API_BASE_URL}/api/admin/app/latest-release" \
      -H "Content-Type: application/json" \
      -H "X-Deploy-Token: ${DEPLOY_SECRET_TOKEN}" \
      -d "$RELEASE_JSON" \
      --connect-timeout 15 --max-time 30)

    HTTP_CODE=$(echo "$API_RESPONSE" | tail -n1)
    API_BODY=$(echo "$API_RESPONSE" | head -n-1)

    if [[ "$HTTP_CODE" == "201" ]]; then
      info "Release registrado (HTTP 201) — notificacion FCM enviada."
      log "SUCCESS: API Release v${APP_VERSION} http=201"
    else
      warn "API HTTP ${HTTP_CODE}: ${API_BODY}"
      warn "GitHub/Firebase fueron exitosos. Solo fallo la notificacion in-app."
      log "FAILED: API Release v${APP_VERSION} http=${HTTP_CODE}"
    fi
  fi
fi

# ── Fin ───────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}=== Distribucion completada — v${APP_VERSION} ===${NC}"
info "GitHub:   $DOWNLOAD_URL"
info "Firebase: testers del grupo '${TESTER_GROUP}' notificados"
info "In-app:   notificacion FCM enviada"
echo ""
log "DONE: distribute v${APP_VERSION}+${APP_VERSION_CODE}"
