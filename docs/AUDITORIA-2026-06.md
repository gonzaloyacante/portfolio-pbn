# Auditoría full-stack portfolio-pbn — 2026-06-10

> Documento vivo. Se actualiza durante la auditoría. Estado checks automáticos:
> typecheck ✓ · ESLint ✓ · vitest ✓ · flutter analyze ✓ · build prod ✓ · lockfile sync ✓
> El código compila limpio; los hallazgos son de contrato, concurrencia, BBDD, arquitectura y performance.

Leyenda estado: ⬜ pendiente · 🔧 en progreso · ✅ corregido · ❌ descartado

---

## 🔴 CRÍTICOS — rotos en producción

### C1. BBDD prod y dev desincronizadas con el schema ✅
- Prod: 6 migraciones sin aplicar. Dev: 5. Verificado con `prisma migrate diff` contra BBDD real.
- Faltan 6 columnas `heroScrim*Show*` en `home_settings` → lectura HomeSettings falla (P2022), capturada → la home pública sirve defaults ignorando el CMS; editor de scrims no guarda.
- Falta FK `RESTRICT` bookings→services; faltan defaults theme/testimonial e índices `app_releases`.
- Causa raíz: build = `prisma generate && next build` (web/package.json:8), nunca corre `migrate deploy`. Precedente: migración `sync_schema_drift_after_db_push`.
- **Hecho 2026-06-12**: backup = branch Neon `pre-c1-migrate-snapshot-20260612` (br-plain-pine-agzkg34k, fork de `main` pre-migración). `prisma migrate deploy` aplicado a prod (6), develop (5), local .env (0 pendientes, ya estaba al día). Verificado: las 14 columnas `heroScrim*`/`heroScrimMobile*` existen en `home_settings` de prod.
- Pendiente (separado, requiere confirmación aparte): añadir `migrate deploy` al pipeline build (CI1/CI2) para que esto no vuelva a driftear.

### C2. Guardar servicio con precio desde la app = 400 ✅
- App manda `price` String (service_form_page_builders_actions.dart:78); API valida `z.number()` sin coerce (validations.ts:455). Web admin usa `z.coerce.number()` (actions/cms/services.ts:48) → no lo sufre.
- Fix: `z.coerce.number()` en `serviceApiSchema`.
- **Hecho 2026-06-12**: `serviceApiSchema.price` → `z.coerce.number().optional().nullable()`. Commit `69aefe84`.

### C3. Reservas desde app: totalAmount/paidAmount y estado "En curso" = 400 ✅
- Mismo patrón String vs `z.number()` en `bookingApiSchema`/`bookingPatchSchema`.
- `status` enum backend NO incluye `IN_PROGRESS`, la app lo ofrece (booking_detail_page_builders.dart:285).
- Fix: coerce + añadir IN_PROGRESS al enum.
- **Hecho 2026-06-12**: `bookingApiSchema.totalAmount`/`bookingPatchSchema.paidAmount` → coerce; `status` enum +`IN_PROGRESS` (propaga a `bookingPatchSchema` vía `.extend`). Hallazgo extra al verificar blast radius: el enum de status del ADMIN WEB (`actions/cms/bookings.ts: BookingUpdateSchema`) también le faltaba `IN_PROGRESS`, y `BookingEditForm.tsx` `STATUS_OPTIONS` no tenía "En curso" — un `<select defaultValue="IN_PROGRESS">` sin esa `<option>` cae al primer valor (PENDING), corrompiendo en silencio el status al guardar cualquier edición de una reserva "En curso". Corregidos ambos. Commit `69aefe84`.

### C4. AuthInterceptor Flutter: requests duplicados + crash latente ✅
- auth_interceptor.dart:95-133: tras refresh, encolados se reintentan DOS veces (líder recorre cola + cada seguidor hace su `_retry`). GETs duplicados; mutaciones duplicadas si concurrentes; doble complete del Completer → StateError.
- Fix: solo el líder procesa la cola O los seguidores esperan `pending.future` sin re-retry.
- **Hecho 2026-06-13**: seguidores ahora solo `await pending.future` (sin `_retry` propio); el líder es el único que reintenta, drenando `_pendingQueue` en un `while` (no `for` + `clear` único) para no dejar colgado a un seguidor que llegue tarde durante los `_retry`. `_refreshCompleter` (Completer con `.complete()`/`.completeError()` que ya no tenía listener) → `_isRefreshing` (bool simple), evita "Unhandled exception" por completers sin observador. `dart analyze` limpio, `flutter test` sin regresiones nuevas (15 fallos preexistentes en `app_colors_test.dart`, no relacionados — ver COLOR-*).

### C5. AuthInterceptor: timeout de red en refresh borra sesión ✅
- auth_interceptor.dart:167-171: cualquier DioException (incl. connectTimeout) → UnauthorizedException → clearSession. App sin cobertura + token expirado = logout forzado.
- Fix: limpiar sesión solo si refresh respondió 401; errores de red propagan sin tocar tokens.
- **Hecho 2026-06-13**: en `_doRefresh`, solo `e.response?.statusCode == 401` (refresh token realmente inválido/revocado, confirmado contra los 3 casos 401 de `api/admin/auth/refresh/route.ts`) lanza `UnauthorizedException` → `_clearSessionAndRedirect`. Cualquier otro `DioException` (timeout, sin red, 429, 5xx) hace `rethrow` → cae en el `catch (e)` genérico, que ya NO limpiaba sesión: el request falla pero los tokens quedan intactos para el próximo intento.

### C6. Rotación de refresh token sin transacción ✅
- api/admin/auth/refresh/route.ts:112-140: 3 writes separados. Dos refresh concurrentes pasan ambos findUnique → reuse-detection rota → revoca cadena entera → logouts aleatorios.
- Fix: transacción + updateMany con check de count (lock optimista) + grace period ~60s devolviendo mismo replacement.
- **Hecho 2026-06-13** (commit `fcd3a9bf`): rotación ahora en `prisma.$transaction` con lock optimista (`updateMany({where:{id, revokedAt:null}})`, chequea `count`). Si `count===0` (perdimos la carrera) o el token ya estaba revocado al leerlo → `reissueOrRevokeChain`: revocación <60s con `replacedBy` válido → devuelve ESE token (grace period, ambos clientes terminan con el mismo refresh token válido); si no → reuso real, revoca toda la cadena (comportamiento original). `TOKEN_EXPIRED` sigue siendo hard-fail sin grace. Tests nuevos: lost-race dentro de gracia (no nukea, no crea token propio) y lost-race fuera de gracia (nukea cadena). 17/17 tests del archivo, suite completa 1684/1684, typecheck+lint limpios.

---

## 🟠 ALTOS — seguridad

- **A7** ✅ Brute-force web sin lockout de cuenta (auth.ts:42-62): login web no incrementa failedLoginCount ni lockedUntil; móvil sí (login/route.ts:96-103). **Hecho 2026-06-14** (commit `6e738452`): `authorize()` lee/escribe `failedLoginCount`/`lockedUntil` — 5 fallos → bloqueo 15min, reset en login exitoso, igual que móvil. Tests en `tests/unit/lib/auth.test.ts`. **Actualización 2026-06-15 (ARQ2)**: esta lógica ahora vive en `verify-credentials.ts`, compartida por ambos pipelines — ya no puede volver a divergir entre web y móvil.
- **A8** ⬜ Rate limiting in-memory en Vercel = por instancia (rate-limit.ts). OK general, insuficiente para auth → persistente/Upstash. **Análisis 2026-06-18**: el vector crítico (brute force login cross-instance) ya está cubierto por el account lockout en DB (A7: 5 fallos → bloqueo 15min en `failedLoginCount`/`lockedUntil`), que sí es cross-instance. El rate limit en memoria es una capa extra de velocidad (rechazo rápido sin DB). Otros endpoints auth: refresh (tokens single-use + revocación) y password reset (receptor único = el admin) tienen riesgo mucho menor. Upstash sigue siendo el fix "defense in depth" correcto, pero requiere setup de cuenta externa. Diferido hasta disponer de credenciales Upstash.
- **A9** ✅ CSRF en proxy.ts:81-110 es código muerto: nadie setea cookie csrf-token. Borrar o implementar. **Hecho 2026-06-14** (commit `32d857e3`): confirmado código 100% muerto — cero lugares setean cookie `csrf-token` ni envían header `x-csrf-token` en toda la app/web. El check solo aplicaba a `/admin/*` no-GET no-server-action, pero bajo `(admin)/admin/*` solo hay `page.tsx` (GET) + Server Actions (excluidos vía header `next-action`) → nunca se disparaba. Tampoco afecta a la app Flutter: el middleware (`proxy.ts`, convención Next 16 que reemplaza `middleware.ts`) no corre para `/api/*` (matcher lo excluye), y la app solo habla con `/api/admin/*` vía JWT Bearer. Eliminados `isValidCsrf`, `isSafeMethod`, `csrfErrorResponse` y el bloque de check; renumerado el comentario de logging.
- **A10** ✅ Tokens en texto plano en BBDD (refresh_tokens.token, password_reset_tokens.token). Guardar SHA-256. **Hecho 2026-06-14** (commit `ab3c4fe3`): nuevo helper `hashToken()` (`src/lib/token-hash.ts`, SHA-256 hex). `password_reset_tokens.token` y `refresh_tokens.token` guardan `hashToken(raw)`; el valor crudo solo se entrega una vez (email de reset / response de login-refresh). Sin migración de Prisma (columna ya era `String @unique` sin límite). Tokens antiguos en texto plano quedan huérfanos (no matchean ningún hash) → fuerzan un re-login/nuevo reset, sin necesidad de limpieza SQL. Efecto colateral en C6 (grace period de `refresh/route.ts`): el "perdedor" de la carrera de rotación ya no puede reutilizar el token crudo del "ganador" (en BD solo queda su hash) → ahora hace su propia rotación independiente, generando y devolviendo su propio token nuevo. Test C6 reescrito (`refresh.test.ts`).
- **A11** ✅ /api/upload legacy sin check de rol (upload/route.ts:14-20): cualquier sesión borra cualquier asset Cloudinary (publicId arbitrario, DELETE sin rate limit). Restringir/retirar. **Hecho 2026-06-14** (commit `32d857e3`): `POST /api/upload` retirado por completo (100% código muerto, 0 llamadas en web ni Flutter — uploads reales van por `/api/upload/sign` + Cloudinary directo). `DELETE /api/upload` ahora exige rol `ADMIN` (`getRequestRole()` revisa `session.user.role` y `token.role`, ambos tipados en `next-auth.d.ts`) → 401 sin sesión, 403 si no es ADMIN. Se agregó rate limiting por IP (`checkApiRateLimit`, antes solo en POST). Tests nuevos en `tests/unit/api/upload/route.test.ts` (8 casos).
- **A12** ✅ Timing enumeration login web (usuario inexistente sin bcrypt). Dummy-hash móvil es bcrypt malformado. Usar hash real pre-generado. **Hecho 2026-06-14** (commit `6e738452`): `getDummyPasswordHash()` (bcrypt.hashSync, costo 12, memoizado en runtime) — `bcrypt.compare` contra ese hash en ramas `!user`/inactivo/bloqueado, en `auth.ts` y `admin/auth/login/route.ts`. Reemplaza el hash malformado móvil.
- **A13** ✅ Cuenta bloqueada 403 vs 401 (login/route.ts:81-86) → enumeración leve. **Hecho 2026-06-14** (commit `6e738452`): rama `lockedUntil` en `login/route.ts` ahora responde 401 `"Credenciales inválidas"` (antes 403 + mensaje de cuenta bloqueada).
- **A14** ✅ ⭐ `/api/auth/verify` es un ORÁCULO de enumeración: retorna 200 si el email existe / 401 si no, ANTES de chequear password (el comentario dice lo contrario de lo que hace). Permite enumerar emails admin. Redundante con NextAuth signIn. Recomendado: BORRAR el endpoint. **Hecho 2026-06-14** (commit `6e738452`): borrado `/api/auth/verify` (`git rm`). `login/page.tsx` llama `signIn` directo; mensaje unificado `"Credenciales inválidas"` en el campo password para cualquier fallo. Decisión confirmada con el usuario: panel single-admin, no distinguir email/password evita enumeración del único email admin.
- **A15** ✅ ⭐ `/api/auth/change-password` NO revoca refresh tokens ni sesiones tras cambiar contraseña (el flujo `resetPassword` SÍ lo hace, auth.ts:115-118). Sesión móvil comprometida sobrevive 30 días al cambio de pass. Añadir revocación de refresh_tokens + push_tokens. **Hecho 2026-06-14** (commit `6e738452`): change-password revoca (`revokedAt`) todos los `refreshToken` activos del usuario tras el cambio, igual que `resetPassword`. `push_tokens` no se tocan (tampoco lo hace `resetPassword`).
- **A16** ✅ `checkApiRateLimit` footgun: retorna `void | {allowed:false}` y change-password (route:21) + verify (route:14) IGNORAN el return → rate-limit no-op silencioso en esos 2 endpoints. Hacer que throw, o forzar uso del return. **Hecho 2026-06-14** (commit `6e738452`): change-password chequea el return de `checkApiRateLimit` → 429 si rate-limited. `verify/route.ts` ya no existe (A14).

---

## 🟡 MEDIOS — robustez/consistencia

- **M14** ✅ proxy.ts rate-limit Map sin cap ni cleanup (21-44): leak en instancias longevas. **Hecho 2026-06-14** (commit `42dbffa1`): agregado `MAX_RATE_LIMIT_ENTRIES = 10_000`. Al llegar al cap, limpieza perezosa de entradas con `resetAt` vencido y, si no alcanza, eviction de la menos recientemente usada (mismo patrón que M15). `setInterval` no es viable en Edge/Vercel, por eso la limpieza solo se dispara al tocar el cap.
- **M15** ✅ Eviction equivocada (rate-limit.ts:80-83): borra firstKey por inserción, puede ser IP activa. **Hecho 2026-06-14** (commit `42dbffa1`): nuevo helper `touch()` (delete+set) en `rate-limit.ts`, llamado desde `check()` y `record()` en cada acceso. `Map.set()` sobre una key existente no reordena su posición de iteración — sin `touch()`, la eviction por cap podía borrar una IP activa solo por haber sido la primera insertada. Aplicado el mismo patrón inline en `proxy.ts` (M14).
- **M16** ✅ compareSemver rompe con prereleases (latest-release/route.ts:56-69). **Hecho 2026-06-14** (commit `36ad9907`): `compareSemver` ahora separa la parte numérica "X.Y.Z" de cualquier sufijo `-`/`+` (prerelease/build) antes de comparar; si los números son iguales, la versión CON sufijo se considera MENOR (semver: prerelease < release). Antes, sufijos con dígitos (ej. "-beta.1") se colaban como componentes extra de versión y hacían que un prerelease pareciera MAYOR que su release.
- **M17** ✅ `mandatory` sin `minVersion` no fuerza (latest-release/route.ts:147-151): contrato ambiguo vs schema. **Hecho 2026-06-14** (commit `36ad9907`): si `mandatory === true` y no hay `minVersion`, ahora `forceUpdate` es `true` para cualquiera con update disponible (la release completa es obligatoria). Si hay `minVersion`, solo fuerza por debajo de ese umbral (rollout escalonado). Tests nuevos en `tests/unit/api/admin/app/latest-release/route.test.ts`.
- **M18** ✅ Settings singleton doble criterio: web `findFirst({isActive:true})` vs API `findFirst()` → riesgo 2ª fila → choca unique key → 500. Unificar upsert por key. **Hecho 2026-06-15** (commit 8de1e9ea): nuevo `src/lib/settings-service.ts` con `findSingleton`/`upsertSingleton` genéricos sobre `key:'singleton'` (todas las tablas singleton tienen `key String @unique @default("singleton")`). `upsertSingleton` usa `prisma.<model>.upsert({where:{key:'singleton'}, create, update})` — operación atómica (INSERT...ON CONFLICT) que elimina la carrera TOCTOU de dos `create()` concurrentes. Aplicado en las 8 actions de settings y en `/api/admin/settings/[type]/route.ts`.
- **M19** ✅ API móvil settings no valida fontUrl/color como las actions web. **Hecho 2026-06-17**: añadido `zGoogleFontsUrlNullable` en `validations/shared.ts` (`.url().refine(hostname==='fonts.googleapis.com')`). Los 14 campos `*FontUrl` en `settings.ts` y `theme.ts` usan el nuevo validator. Las actions web que ya llamaban `validateFontUrl()` extra siguen haciéndolo (defensa en profundidad). Colores ya cubiertos por `zHexColorNullable` en los schemas. Tests corregidos (social-actions.test.ts deleteMany, auth.actions.test.ts reCAPTCHA mock, analytics-charts.test.ts eliminado — ruta borrada en DEAD2). 1720/1720.
- **M25** ✅ Gallery POST (categories/[id]/gallery:105-139) persiste `url`/`publicId` del cliente SIN Zod ni `isCloudinaryUploadUrl`, sin límite de tamaño de array. Otras rutas validan. Inconsistencia + integridad (admin-only → severidad baja-media). CSP mitiga render de URL externa. **Hecho 2026-06-14** (commit `7b335ee3`): nuevo `categoryGalleryImagesSchema` en validations.ts (url debe ser `isCloudinaryUploadUrl`, publicId requerido, width/height opcionales positivos, array 1-50). Errores indican qué imagen falló ("La imagen #N no se subió correctamente") sin jerga técnica, ya que llegan hasta Sentry vía la app. Test nuevo `categories-gallery.test.ts` (6 tests).
- **M20** ✅ Refresh tokens proliferan: sin cap por usuario ni limpieza de expirados. **Hecho 2026-06-14** (commit `42dbffa1`): nuevo `pruneRefreshTokens(userId)` (`src/lib/refresh-token.ts`), borra `refresh_tokens` del usuario expirados o revocados fuera de `GRACE_PERIOD_MS` (centralizado ahí, antes duplicado/local en `refresh/route.ts`). Llamado tras login exitoso y tras ambos paths de éxito de refresh (rotación normal y reissue en grace period). No se llama en el path de reuso real/revoke-chain (filas demasiado recientes para el filtro de gracia). Falla silenciosa (try/catch + `logger.warn`) — no crítico si una limpieza puntual falla.
- **M21** ✅ `_retry` pierde responseType/timeouts custom (auth_interceptor.dart:204-217). **Hecho 2026-06-16** (commit `79ff122d`): `_retry` now propagates `responseType`, `contentType`, `receiveTimeout`, `sendTimeout`, `followRedirects`, `receiveDataWhenStatusError`, `validateStatus` from original `RequestOptions`.
- **M22** ✅ `_verifySha256` carga APK entero en RAM (app_update_repository.dart:250): OOM en low-end. Digest por chunks. **Hecho 2026-06-16** (commit `79ff122d`): streaming via `file.openRead()` + `sha256.startChunkedConversion(ChunkedConversionSink.withCallback(...))`.
- **M23** ✅ `cleanOldApks` antes de descargar borra el APK válido → cache/resume nunca sirve. **Hecho 2026-06-16** (commit `79ff122d`): `cleanOldApks` moved to after successful `downloadApk`, with `keepPath` param to preserve the newly downloaded APK.
- **M24** ✅ `guestCount: z.number()` sin int().positive(). **Hecho 2026-06-12**: `bookingApiSchema.guestCount` → `z.coerce.number().int().positive().optional().nullable()`. Commit `69aefe84`.

---

## 🔵 BAJOS / mejora puntual

- **B25** ✅ @prisma/adapter-pg pinado a 7.4.2 (commit `e289f8cc`).
- **B26** ❌ `pnpm-workspace.yaml` no existe en el repo — irrelevante (el archivo que aparecía en git status estaba fuera del repo).
- **B27** ✅ `images.formats`/`remotePatterns` removidos (commit `e289f8cc`).
- **B28** ✅ `productionBrowserSourceMaps:true` removido (commit `e289f8cc`).
- **B29** ✅ Modelo Session eliminado del schema Prisma. Migración `20260617100000_drop_session_model` (DROP TABLE sessions). Commit `02730642`. **Aplicado en prod 2026-06-17** vía Neon MCP.
- **B30** ✅ User.role promovido de String libre a enum `UserRole` (ADMIN|GUEST). Migración `20260617110000_add_user_role_enum` (CREATE TYPE + ALTER TABLE). Commit `02730642`. **Aplicado en prod 2026-06-17** vía Neon MCP.
- **B31** ✅ Logger + alerting en reCAPTCHA: `logger.error` cuando falta secretKey en prod, `logger.warn` en HTTP error de Google, `logger.error` en network failure (commit `e289f8cc`).

---

## 📊 BBDD real (Neon project dry-cake-98386708, pg17, eu-central-1) — verificado en vivo

Estado: 1 user, 3 categories, 34 images, 0 services/bookings/contacts/testimonials, 558 analytic_logs. Pre-launch.
- **active_time 224h / cpu 56h este período**: corregido — dominado por monitoring INTERNO de Neon (sql_exporter: `SELECT $1` 1.5M calls, `neon_lfc_stats` 750k). NO es la app martillando. Carga real app: category_images 6710 reads, categories 6710, testimonials 2236. Caching parcial funciona.

### D-DB1. Sobre-indexación severa ✅
- bookings: **11 índices, 9 scans totales, 10 nunca usados** (0 filas). contacts: 7 índices, 0 scans, todos sin usar. security_events/refresh_tokens/sessions/password_reset/blocked_ips: TODOS sus índices con 0 scans.
- Cada índice = coste de escritura + storage. Premature optimization para un CMS de bajo volumen.
- Fix: dejar PK + unique + los 1-2 que se usan (date, status); borrar composites especulativos; re-añadir cuando datos/queries lo justifiquen.

### D-DB2. Índice DUPLICADO por casing ✅
- `bookings_status_deletedat_idx` Y `bookings_status_deletedAt_idx` coexisten (difieren solo en mayúscula). Uno es peso muerto puro. Vino de drift entre migraciones. Borrar uno.
- **Hecho 2026-06-17**: `DROP INDEX IF EXISTS bookings_status_deletedAt_idx` ejecutado en prod vía Neon MCP (el con mayúscula, creado por drift; se conserva el original lowercase que ya existía).

### D-DB3. Dead tuples altos en singletons ⬜
- theme_settings 1 viva/29 muertas, users 1/20, categories 3/17. El patrón update-singleton genera churn. No crítico a esta escala (autovacuum). Vigilar si crece; opcional fillfactor.

### D-DB4. AnalyticLog crecimiento no acotado ✅ (diferido por DEAD2)
- Existe migración TTL (analytic_logs_cleanup_and_ttl) pero NO se ve cron que la ejecute. Verificar que el job corre; si analytics escala → partición por mes.
- **2026-06-16**: analytics.ts trackEvent/trackPageView son no-ops → 0 filas nuevas se escriben. Las 558 filas existentes son pre-launch fijas. TTL cron irrelevante hasta que se decida reactivar analytics (DEAD2). Diferido pendiente decisión DEAD1/DEAD2.

---

## 🏗️ ARQUITECTURA / REFACTOR / ORGANIZACIÓN

### ARQ1. ⭐ Contrato web↔app duplicado a mano = causa raíz de C2/C3 ⬜
- Tipos definidos DOS veces sin fuente única: Zod (web/src/lib/validations.ts) y freezed (app/lib/.../*_model.dart), sincronizados a mano. Cualquier desfase (price String vs number) compila en ambos lados y rompe en runtime.
- Fix de fondo: generar OpenAPI desde Zod (`zod-to-openapi`) → generar cliente Dart (`swagger_dart_code_generator`/openapi-generator). Una sola fuente de verdad elimina toda esta clase de bugs. Alternativa mínima: un `packages/contracts` con JSON Schema compartido.

### ARQ2. Doble pipeline de auth divergente ✅
- NextAuth (web) + JWT custom (app) = dos login handlers, dos rate-limiters, dos lógicas de lockout que YA divergen (A7: web no bloquea cuenta, app sí). Unificar el núcleo en `verifyCredentials()` compartido; cada capa solo emite su token.
- **Hecho 2026-06-15** (commit 0edcf097): nuevo `src/lib/verify-credentials.ts` con `verifyCredentials(email, password, ipAddress)` — único punto que hace rate limiting (A8), lookup de usuario, comparación dummy de password para igualar timing en usuario inexistente/inactivo/bloqueado (A12), comparación real de password, incremento/reseteo de `failedLoginCount`/`lockedUntil` (A7) y `clearLoginAttempts` en éxito. Devuelve union `{ok:true,user}` | `{ok:false,reason:'rate_limited'|'locked'|'invalid'}`. `src/lib/auth.ts` (NextAuth `authorize`) y `/api/admin/auth/login/route.ts` (móvil) ahora solo llaman a `verifyCredentials` y mapean el resultado a su formato de respuesta (throw/null vs JSON+status), sin reimplementar nada de la lógica de seguridad. De paso se unificaron 3 divergencias menores hacia el comportamiento más seguro: (1) email se normaliza a minúsculas en ambos pipelines (antes solo móvil lo hacía), (2) `recordFailedLoginAttempt` también se llama para usuario inexistente en móvil (antes solo web), (3) `clearLoginAttempts` se llama en login exitoso también en móvil (antes solo web). El `tx.user.update` final de `/api/admin/auth/login/route.ts` ya no resetea `failedLoginCount`/`lockedUntil` (redundante, `verifyCredentials` ya lo hace) — solo actualiza `lastLoginAt`/`lastLoginIp`. Tests: `tests/unit/lib/auth.test.ts`, `tests/unit/api/admin/auth/login.test.ts`, `tests/unit/api/admin/auth/login-extended.test.ts` (mocks de `@/lib/auth-rate-limit` actualizados con `clearLoginAttempts`; test "resets failed login count on success" ajustado para verificar que ALGUNA llamada a `update` —no necesariamente la última— resetea los contadores). Suite completa 1722/1722, tsc y eslint limpios.

### ARQ3. Settings: 8 tablas singleton + 8 schemas + lógica repetida ✅
- Patrón findFirst/upsert clonado en 10 archivos actions/settings/*.ts + la API route castea modelos Prisma a `unknown as SettingsModel` (settings/[type]/route.ts:32-41) perdiendo type-safety. Abstraer `SettingsService<T>` genérico con registry tipado (discriminated union). **Hecho 2026-06-15** (commit 8de1e9ea): `findSingleton`/`upsertSingleton` (`src/lib/settings-service.ts`) reemplazan el patrón `findFirst`+`create`/`update` repetido en las 8 actions (`home`, `about`, `contact`, `theme`, `site`, `testimonial`, `category`, `servicesPage`) y en la API route. `SETTINGS_DEFAULTS` centraliza los valores iniciales para que web y app creen la fila singleton con los mismos defaults.

### ARQ4. God files a dividir ✅
- web/src/components/ui/map.tsx **1756 líneas** — partir en hooks + subcomponentes. **Hecho 2026-06-16** (commit c83f880f): dividido en `src/components/ui/map/{constants,context,theme,map-root,marker,marker-popup,popup-close-button,controls,popup,route,arc,cluster}.ts(x)` + barrel `index.ts`. CSS side-effect import centralizado en el barrel. API pública idéntica (mismo export block que tenía el monolito). tsc/eslint/build limpios.
- web/src/lib/validations.ts 665 — partir por dominio (auth/services/bookings/settings/content). **Hecho 2026-06-15** (commit c67f2697): dividido en `src/lib/validations/{shared,forms,theme,settings,content,bookings,auth,api-misc}.ts` + barrel `index.ts` (`export * from './x'`), manteniendo `@/lib/validations` como import único para los ~46 archivos que ya dependían de él (cero cambios en importadores). Sin colisiones de nombres, suite/tsc/eslint limpios.
- web/src/actions/cms/services.ts 540 — separar create/update/query/mapping. **Hecho 2026-06-15** (commit 58ec8e6c): dividido en `src/actions/cms/services/{schema,form-helpers,queries,create,update,mutations}.ts` + barrel `index.ts`, manteniendo `@/actions/cms/services` como import único. De paso se eliminó la duplicación byte-a-byte del parseo de FormData entre `createService`/`updateService`, ahora compartida en `form-helpers.ts`. Suite/tsc/eslint limpios, build de producción ok.
- app/lib/core/debug/debug_panel_cards.dart 632, app_theme.dart 558 — partir. **Hecho 2026-06-16** (commit 6eac358a): `debug_panel_cards.dart` (ya era `part of 'debug_panel.dart'`) dividido en 4 partes — `debug_panel_widgets.dart` (DebugCard/InfoRow/ActionButton/EnvBadge), `debug_panel_server_card.dart`, `debug_panel_info_cards.dart`, `debug_panel_action_cards.dart`. `app_theme.dart` dividido en `app_theme_helpers.dart` (helpers de color/fuente + `_Radii`) y `app_theme_builder.dart` (`_buildFromParts` como función privada de nivel superior). API pública de `AppTheme` sin cambios. dart analyze limpio.

### ARQ5. Monorepo informal ⬜
- pnpm-workspace.yaml vive DENTRO de web/, no en raíz. web/ y app/ son carpetas hermanas sin workspace real. OK a esta escala; si se añade `packages/contracts` (ARQ1) conviene workspace en raíz.

---

## 📴 OFFLINE / PERFORMANCE APP (Flutter)

### OFF1. ⭐ App admin SIN persistencia offline (lo que pediste) ✅
- NO hay paquete de DB local (sqflite/drift/isar/hive/objectbox ausentes en pubspec). Solo shared_preferences + secure_storage + draft_service (ficheros para borradores).
- `connectivity_plus` existe y `ConnectivityInterceptor` BLOQUEA requests sin red → pero no hay cola: las mutaciones offline simplemente fallan. Lectura offline = pantalla vacía.
- Para una maquilladora revisando agenda/contactos en movilidad con cobertura mala = inusable offline.
- Fix recomendado (SQL real, como pediste): **drift** (SQLite tipado + reactivo). Cachear bookings, contacts, categories, services, testimonials, settings, dashboard.
  - Repos offline-first: leer de DB local → render instantáneo → sync desde API en background → write-through.
  - Outbox queue para mutaciones offline → reenviar al recuperar red (wirear connectivity_plus al sync controller).
  - Conflictos: last-write-wins por updatedAt, o campo version.
  - Bonus: render instantáneo desde local = mejora la lentitud percibida de cada pantalla (hoy todo es round-trip de red).

### OFF2. image_picker sin compresión ✅
- settings_home_page_actions.dart:186,230 → `pickImage` sin `imageQuality`/`maxWidth` → sube foto full-res → upload lento + ancho de banda Cloudinary. Añadir `imageQuality: 85, maxWidth: 2000`.
- **Hecho 2026-06-17** (commit `4f7bba6b`): `_pickHeroImage` (ya pasaba por ImageCropper:85 pero cargaba original 4K en memoria) y `_pickIllustration` (sin cropper → full-res directo) ahora usan `maxWidth:2000, imageQuality:85`. `image_upload_widget` ya usaba `AppConstants.imageQuality` vía ImageCropper — sin cambios.

### OFF3. Image.network crudo (3 usos) ✅
- Reemplazar por CachedNetworkImage (ya es dependencia) para cache + placeholder.
- **Hecho 2026-06-17** (commit `7dee8105`): `DragReorderGhostPreview` en `draggable_list.dart` reemplazado.

### OFF4. Dashboard pesado (fl_chart + flutter_map) ✅
- Lazy-load de charts/mapa; hoy bloquean el primer render del dashboard.
- **Hecho 2026-06-16** (commit `66738e68`): eliminados DashboardChartsSection, fl_chart, flutter_map — ver DEAD1.

### Notas positivas app (verificado): RetryInterceptor con backoff exponencial, 12 providers keepAlive, paginación presente, cached_network_image en uso. Base sólida.

---

## 🔧 CI/CD & NATIVO (Android)

### CI1. ⭐ Nombres de secretos CI ≠ los que lee el código ✅
- ci.yml pasa al build `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `NEXT_PUBLIC_API_URL/APP_NAME/APP_URL`. Pero env.ts valida `ADMIN_JWT_SECRET`, `DEPLOY_SECRET_TOKEN`, `NEXT_PUBLIC_BASE_URL` — nombres distintos. Drift CI↔código: el build CI no valida el mismo entorno que prod; faltan ADMIN_JWT_SECRET, DEPLOY_SECRET_TOKEN, FIREBASE_*, RECAPTCHA_SECRET_KEY. Unificar nomenclatura.
- **Hecho 2026-06-17**: reemplazados `JWT_SECRET`→`ADMIN_JWT_SECRET`, eliminados `JWT_REFRESH_SECRET`/`JWT_EXPIRES_IN`/`JWT_REFRESH_EXPIRES_IN` (no los lee el código), `NEXT_PUBLIC_API_URL/APP_NAME/APP_URL`→`NEXT_PUBLIC_BASE_URL`, añadido `DEPLOY_SECRET_TOKEN`.

### CI2. CI solo manual (workflow_dispatch) — ✅ DECISIÓN DELIBERADA, NO TOCAR
- **Decisión tomada: CI manual únicamente.** Los hooks pre-push ya cubren type-check, lint y tests. El build requiere secretos DB/auth reales. Para un proyecto personal con un solo desarrollador, correr CI en cada push es gasto sin beneficio. `workflow_dispatch` es la forma correcta aquí.
- **NO agregar triggers push/pull_request.** Esta decisión está documentada en el comentario del ci.yml y NO debe revertirse.

### CI3. AndroidManifest: permisos bajo escrutinio Play ✅
- `USE_FULL_SCREEN_INTENT` (Android 14 restringe a llamadas/alarmas), `REQUEST_INSTALL_PACKAGES` (in-app update, requiere formulario Play), `CAMERA` (image_picker no lo exige salvo que se declare). Revisar si Play los aprueba; documentar justificación.
- **Hecho 2026-06-17** (commit `8853172b`): eliminado `USE_FULL_SCREEN_INTENT` — comentado incorrectamente como "tap en notificación" pero FCM no lo necesita; es para pantalla completa en dispositivo bloqueado (llamadas/alarmas). `CAMERA` se mantiene (ImageSource.camera usado en image_upload_widget). `REQUEST_INSTALL_PACKAGES` se mantiene (in-app update APK vía distribute.sh, no Play Store).

### Notas positivas CI/nativo: action SHAs pinneadas (supply-chain), R8 minify+shrink en release, allowBackup=false, networkSecurityConfig presente, signing fail-closed.

---

## 🌐 I18N / OBSERVABILIDAD / DEUDA (ronda 3)

### I18N1. ⭐ Traducción pública rota para la mayoría de usuarios ✅
- useTranslation.ts: primario = Chrome Translator API (`window.Translator`, Chrome 138+ solo) → ausente en Firefox/Safari/Chrome viejo.
- Fallback = MyMemory a `api.mymemory.translated.world` — el dominio real es `api.mymemory.translated.net` (¿typo? verificar) Y NO está en CSP `connect-src` de next.config.ts → el fetch lo BLOQUEA la CSP. Doble fallo → traducción falla en silencio fuera de Chrome 138+.
- Además: enviaría el texto de la página a un tercero (privacidad). Fix: o quitar la feature, o usar un proveedor en CSP + servidor, o aceptar que es progressive-enhancement Chrome-only y comunicarlo.
- **Hecho 2026-06-16** (commit `07a90d90`): typo `translated.world` → `translated.net` en useTranslation.ts; dominio añadido a `connect-src` en next.config.ts. Feature funciona en todos los browsers cuando LanguageToggle se conecte.

### OBS1. Sentry sin PII-scrub explícito en beforeSend (server) ✅
- sentry.server.config.ts beforeSend solo filtra dev; el server puede capturar request data (emails en mensajes de error). Cliente OK (replay maskAllText+blockAllMedia). Añadir scrub de PII en server beforeSend. (LOW — defaults de Sentry mitigan parcialmente.)
- **Hecho 2026-06-16** (commit `e4045aa0`): `scrubEvent()` en `beforeSend` — redacta email patterns de `event.message`, `exception.values[].value`, `request.data`.

### RETRY1. ⭐ RetryInterceptor reintenta POST no idempotente ✅
- api_interceptors.dart:154 `_shouldRetry` reintenta 429/502/503/504/network en CUALQUIER método. POST (crear booking/contact/testimonial) reintentado tras un 502/timeout posterior al write del server → CREACIÓN DUPLICADA. Se compone con C4 (doble-retry del AuthInterceptor). Fix: solo reintentar métodos idempotentes (GET/HEAD/PUT/DELETE) o usar idempotency-key.
- **Hecho** (commit `1fc0e3d9`): RetryInterceptor ahora solo reintenta GET/HEAD/PUT/DELETE.

### LOG1. ⭐ Logger enmascara ctx pero NO el mensaje → PII en logs ✅
- logger.ts: `safeCtx` enmascara email/phone/token en el objeto ctx, pero el string `msg` se loguea crudo. Call sites interpolan PII: login/route.ts:149 `Usuario ${user.email} autenticado desde ${ipAddress}`, refresh logs userId, etc. → email+IP en logs de Vercel sin redactar. Fix: pasar `msg` por `redactEmail/redactPhone` o no interpolar PII en mensajes.
- **Hecho 2026-06-16** (commit `e4045aa0`): nueva función `redactMsg()` en logger.ts que aplica `redactEmail`+`redactPhone` al string `msg` antes de serializar en `format()`.

### DEAD1. ⭐ Feature de analytics muerta en la app ✅
- Backend `/analytics/charts` devuelve `{dailyPageViews:[], monthlyBookings:[], analyticsDisabled:true}` (desactivado por costo Neon). La app NO chequea `analyticsDisabled` (dashboard_charts.dart:38-41) → renderiza PageViewsChart + BookingsBarChart + VisitorsMap VACÍOS = UI muerta. Además carga fl_chart + flutter_map + visitors_map_builders.dart (526 líneas) y hace request extra en cada dashboard, todo para nada.
- `monthlyBookings` SÍ se podría computar barato desde la tabla `bookings` (no necesita AnalyticLog), pero también viene vacío → el admin perdió el gráfico de reservas sin necesidad.
- Fix: quitar la feature de la app (ahorra deps + bundle), o gate por `analyticsDisabled`, o re-habilitar solo bookings-chart (barato).
- **Hecho 2026-06-16** (commit `66738e68`): eliminados DashboardChartsSection, VisitorsMapWidget, visitors_map_builders, bookings_bar_chart, page_views_chart, DashboardCharts model, dashboardChartsProvider, Endpoints.analyticsCharts, SkeletonVisitorsMap + deps fl_chart/flutter_map/latlong2. Dashboard ya mostraba DashboardTrafficInfo (→ Google Analytics) como reemplazo. Diferencia: -1.693 líneas, -3 dependencias.

### DEAD2. Schema AnalyticLog muerto ✅
- analytics.ts trackEvent/trackPageView son no-ops → nada escribe `analytic_logs`. Las 558 filas están congeladas + 9 índices = peso muerto (se cruza con D-DB1). Si no se reactiva: dropear modelo + tabla + endpoints, o documentar como legacy.
- **Hecho 2026-06-17** (commit `901d00ad`): eliminado modelo AnalyticLog del schema Prisma, creada migración `20260617000000_drop_analytic_logs` (DROP TABLE analytic_logs), borrados analytics.ts (no-op), analytics-events.ts (sin importadores), endpoint /api/admin/analytics/charts. **Aplicado en prod 2026-06-17** vía Neon MCP.

### ENV1. env.ts es validación parcial (teatro) ✅
- 56 `process.env.X` directos fuera de env.ts → muchas vars no validadas (FIREBASE_*, RECAPTCHA_SECRET_KEY, VERCEL_ENV, NEXT_PUBLIC_*). Centralizar lecturas en env.ts o aceptar que el "fail-fast" no cubre todo.
- **Hecho 2026-06-17**: añadidas RECAPTCHA_SECRET_KEY, NEXT_PUBLIC_RECAPTCHA_SITE_KEY, NEXT_PUBLIC_SENTRY_DSN, NEXT_PUBLIC_GA_ID (renombrado de GA_MEASUREMENT_ID), NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, NEXT_PUBLIC_APP_VERSION, VERCEL_ENV, VERCEL_GIT_COMMIT_SHA al schema de env.ts. Migradas lecturas process.env en cloudinary.ts y recaptcha.ts a env.*. Commit `c06a2fb0`.

### Correcciones honestas (NO son bugs):
- map.tsx (1756 líneas): el ciclo de vida maplibre está BIEN — `map.remove()`, markers/popups/tooltips y listeners se limpian en cleanup. Sin memory leak. (God file resuelto → ARQ4 ✅ commit c83f880f.)
- 0 `@ts-ignore`/`@ts-expect-error` reales (bien). Los 22 `eslint-disable` = 15 exhaustive-deps (casi todos en map.tsx → revisar stale-closures), 4 hex-color (regla design-tokens), 3 no-img-element.
- Seeds admin: sin password fallback inseguro, exigen `ADMIN_PASSWORD`, bcrypt 12. Correcto.

---

## 🔐 SEGURIDAD APP + ⚡ PERFORMANCE APP (ronda 4)

### SEC-APP1. ⭐ freezed `AuthLoginResponse.toString()` expone tokens ✅
- auth_state: el modelo freezed imprime `accessToken`/`refreshToken` en su `toString()` autogenerado. Si alguna vez se loguea el objeto (AppLogger, breadcrumb de Sentry, error con el objeto en contexto) → tokens en logs/Sentry. Fix: `@Freezed(toStringOverride:false)` o no almacenar tokens en modelo con toString, o redactar.
- **Hecho 2026-06-16** (commit `79ff122d`): Parcheados los 4 `toString()` en `auth_state.freezed.dart` (mixin + impl de `AuthLoginResponse` y `AuthRefreshResponse`) para emitir `[redacted]` en lugar del token crudo.

### SEC-APP2. Sin TLS certificate pinning ✅
- Dio sin pinning. App admin con PII (contactos/reservas) + refresh token de 30 días. En red comprometida con CA de confianza (proxy MITM corporativo/rooteado) el tráfico es interceptable. Defensa en profundidad: pinning del cert/SPKI del backend. (MED — TLS ya protege; pinning es hardening.)
- **Hecho 2026-06-17** (commit `a4854177`): 3 capas de pinning. Android: `<pin-set expiration="2028-09-01">` en network_security_config.xml con 3 pins SPKI SHA-256 (YR2 intermediate, ISRG Root YR, ISRG Root X1). iOS: `NSPinnedDomains` en Info.plist con los mismos 3 pins (`NSPinnedCAIdentities`). Dart: `validateCertificate` en `IOHttpClientAdapter` rechaza cualquier cert con host distinto al backend y loguea anomalía. Pins actualizados con la cadena en vivo de paolabolivar.es. Renovar pins antes de sep-2028.

### SEC-WEB2. Reset password sin reCAPTCHA → email bombing ✅
- requestPasswordReset (auth.ts) solo limita por IP (RATE_LIMITS.API). Sin reCAPTCHA ni límite por email → spam de emails de reset al admin + quema cuota Resend. Añadir reCAPTCHA + límite por email.
- **Ya implementado** (antes de esta auditoría): forgot-password/page.tsx usa `useGoogleReCaptcha` + ejecuta token antes de submit; requestPasswordReset verifica token con `verifyRecaptchaToken` + aplica `passwordResetLimiter` por email (RATE_LIMITS.PASSWORD_RESET).

### PERF-APP1. ⭐ AppNetworkImage decodifica originales 4K en grids ✅
- app_network_image.dart pasa la URL cruda a CachedNetworkImage SIN `memCacheWidth`/`cacheWidth` ni transform Cloudinary. En gallery_tile/gallery_grid_tile/category_grid_card (thumbnails) se descarga + decodifica el original 4K → memoria/jank/ancho de banda. La web ya tiene `getVariantUrl` (w_400/w_800). Fix: pedir variante Cloudinary por tamaño + `memCacheWidth = ancho_layout × devicePixelRatio`.
- **Hecho 2026-06-17**: `CloudinaryNetworkImage` (ya existía, y gallery_tile/gallery_grid_tile/category_grid_card ya lo usaban) aplica `cloudinaryUrl(url, physicalWidth)` con `c_fill,w_{physicalWidth},q_auto,f_auto`. Añadido `memCacheWidth` a `AppNetworkImage` (→ `CachedNetworkImage.memCacheWidth`) y `CloudinaryNetworkImage` lo pasa como `physicalWidth`. Resultado: thumbnails piden y cachean en memoria la variante correcta, no el 4K original.

### PERF-APP2. Bootstrap: init serial bloquea primer frame ✅
- bootstrap.dart: awaits secuenciales (dateFormatting×2 → dotenv → Firebase.initializeApp → preloadThemeMode) antes de runApp. Firebase bloquea TTF. Paralelizar independientes (dotenv+dateFormatting) y diferir Firebase/FCM a post-first-frame.
- **Hecho** (commit `67f8f58b`): `preloadThemeMode()` lanzado antes del wait; `Future.wait([dateFormatting×2, dotenv, Firebase.initializeApp])` en paralelo. Sentry + runApp tras recoger el tema inicial. Orden de dependencia preservado.

### Correcciones honestas (NO bugs):
- Listas (contacts/testimonials/services): `PaginatedListView` → `ListView.separated` + paginación page/limit + `RepaintBoundary` en items. Virtualizado y correcto.
- Sin SQL raw inseguro, sin CORS abierto, sin secretos en NEXT_PUBLIC, sin eval, sin cert-bypass en Dio. bcrypt 12 consistente (login/change/reset/seed).
- main.dart: runZonedGuarded + SentryWidgetsFlutterBinding. Google Calendar scope mínimo.

---

## 📦 DEPENDENCIAS / A11Y (ronda 5 — empírico)

### DEP1. `pnpm audit`: 4 CVEs moderate (hono <4.12.21) ✅
- Todas vía path DEV de Prisma (`@prisma/client>prisma>@prisma/dev>@hono/node-server>hono`), NO en runtime de producción → riesgo real bajo. Pero `pnpm audit` ya no está limpio (consecuencia de quitar el bloque `overrides`). Re-pinnear hono>=4.12.21 en pnpm-workspace overrides o actualizar Prisma cuando traiga hono parcheado. (GHSA-f577-qrjj-4474, GHSA-2gcr-mfcq-wcc3)
- **Hecho**: `pnpm.overrides` en web/package.json — `"hono@*": "4.12.25"` y `"@hono/node-server@*": "1.19.13"`. `pnpm audit` limpio para estos CVEs.

### DEP2. Flutter deps atrasadas — minors ✅ / majors ⬜
- **Minors resueltos** (verificado en pubspec.lock 2026-06-18): firebase_messaging 16.3.0, sentry/sentry_flutter 9.22.0, dio 5.9.2, go_router 17.3.0, connectivity_plus 7.1.1, flutter_secure_storage 10.3.1. Las constraints `^` en pubspec.yaml ya cubrían estas versiones; pub.lock las resolvió al día.
- **Majors resueltos 2026-06-18**: image_cropper ^11→^12 (resuelto 12.2.1) y permission_handler ^11→^12 (resuelto 12.0.3). Uso limitado — `Permission.requestInstallPackages` y `ImageCropper().cropImage()` + `CropAspectRatioPreset.original` — ninguna API rota. `dart analyze` limpio.
- **flutter_local_notifications resuelto 2026-06-18**: ^20→^22 (resuelto 22.0.1). Uso: `FlutterLocalNotificationsPlugin`, `AndroidInitializationSettings`, `DarwinInitializationSettings`, `AndroidNotificationChannel`, `AndroidNotificationDetails`, `DarwinNotificationDetails`. Ninguna API rota. `dart analyze` limpio.
- **device_info_plus + package_info_plus resueltos 2026-06-18**: bump coordinado — `package_info_plus ^9→^10` (10.1.0) desbloqueó `device_info_plus ^10→^13` (13.1.0). Solo se usa `iosInfo.isPhysicalDevice` y `PackageInfo.fromPlatform()`. `dart analyze` limpio.

### A11Y1. a11y solo verificable parcialmente en estático ⬜
- Estático OK: 0 `<img>` sin alt, 110 `aria-*`, 15 `role=`, 11 archivos UI con `aria-label`. Pero correctitud real (lectores de pantalla, foco, contraste sobre el theme del CMS, orden de tabulación) NO se certifica leyendo código → requiere auditoría con screen-reader + Lighthouse/axe.

---

## 🔗 COMPARTIR EN REDES / ICONOS / METADATA (ronda 6 — lo que faltaba)

### SHARE1. ⭐ NO existe favicon.ico → icono de pestaña roto ✅
- No hay `favicon.ico` ni `src/app/icon.png`/`apple-icon.png` en ningún lado (solo el set `/icons/icon-*.png`). La metadata referencia `icon: site?.faviconUrl || '/favicon.ico'` → si el CMS no tiene faviconUrl, apunta a `/favicon.ico` que **da 404** → la pestaña del navegador muestra el icono por defecto. "Los iconos se ven mal" = esto. Fix: añadir `src/app/icon.png` (Next lo sirve automático) + `apple-icon.png`.
- **Hecho 2026-06-16** (commit `8080c2c4`): `public/favicon.ico` (ICO con PNG 32×32 embebido), `src/app/icon.png` (32×32), `src/app/apple-icon.png` (180×180). Next sirve `/icon.png` y `/apple-icon.png` automáticamente.

### SHARE2. ❌ RETRACTADO (falso positivo, verificado)
- Afirmé que `portfolio/[slug]` no tenía generateMetadata. ERROR: la ruta real es `portfolio/[category]/page.tsx` y SÍ tiene `generateMetadata` (línea 50) vía `buildSeoMetadata`, con OG image = `coverImageUrl || images[0].url || defaultOgImage` (línea 72). Las galerías SÍ comparten con su foto de portada. Sin hallazgo. (Lección: grepié una ruta inexistente; verificar el árbol antes de afirmar.)

### SHARE3. OG genérico solo-texto en home/raíz (no en galerías) ⬜
- opengraph-image.tsx (card raíz) pinta nombre+tagline+especialidad sobre fondo plano, sin foto ni logo. Las galerías ya usan su cover (SHARE2 ok), pero compartir la HOME muestra el card de texto. Para una maquilladora, la home compartida debería mostrar trabajo real. Fix opcional: componer el card raíz con una foto hero de fondo.

### SHARE4. ⭐ Fuente de marca del navbar ROTA (comilla mal cerrada) ✅
- (public)/layout.tsx:153 `font-family:'${navbarBrandFont}...,sans-serif !important;` — la comilla abre antes del nombre y NO cierra antes de la coma → genera `font-family:'Great Vibes,sans-serif` (comilla sin cerrar) = CSS inválido → el nombre de marca NO usa la fuente custom configurada en el CMS. Fix: `font-family:'${font}',sans-serif`.
- **Hecho 2026-06-16** (commit `774980dc`): añadida la comilla de cierre antes de la coma.

### SHARE5. apple-touch-icon tamaño no estándar ✅
- `apple: '/icons/icon-192x192.png'` — Apple espera 180×180. Funciona pero no ideal. Añadir icono 180.
- **Hecho 2026-06-16** (commit `8080c2c4`): `src/app/apple-icon.png` 180×180 (resize desde 192×192); metadata actualizado a `apple: [{url: '/apple-icon.png', sizes: '180x180'}]`.

### Verificado OK en esta capa: metadataBase presente (root + public), twitter summary_large_image, OG 1200×630, JsonLd ProfessionalService con sameAs (redes), robots/canonical correctos, skip-link a11y presente.

---

## 🎛️ CMS — editores, flujo guardar→render, paridad web↔app (ronda 7)

### CMS1. ⭐ Sin aviso de cambios sin guardar en Home/About/Contact ✅
- HomeEditor/AboutEditor/ContactEditor mantienen `settings` en `useState` local y solo persisten al pulsar "Guardar". NO hay `beforeunload`/isDirty → navegar o cerrar la pestaña con cambios pendientes los **pierde en silencio**. Solo ThemeEditor + editores de galería tienen guard. Fix: hook `useUnsavedChanges` compartido (beforeunload + confirm al navegar) en todos los editores.
- **Hecho 2026-06-16** (commit `7a9dc878`): nuevo hook `src/hooks/useUnsavedChanges.ts` (beforeunload cuando isDirty). HomeEditor: `isDirty` state manual, set en `handleUpdate`, clear en save exitoso. About/ContactEditor: `isDirty` de react-hook-form formState.

### CMS2. Guardado envía el objeto completo (no diff) ✅
- HomeEditor `updateHomeSettings(settings)` manda los ~100 campos en cada guardado, no solo lo cambiado → last-write-wins clobbea ediciones concurrentes (1 admin → riesgo bajo) + payload grande. Opcional: enviar diff.
- **Hecho 2026-06-17**: `HomeEditor` usa `savedBaselineRef` (useRef al estado inicial), calcula diff excluyendo `id` antes de cada save, actualiza el ref tras éxito. `AboutEditor`/`ContactEditor` usan `dirtyFields` de RHF para filtrar el payload + `reset(data)` tras éxito para actualizar el baseline de dirty tracking.

### CMS3. Paridad web↔app parcial (esperable) ✅ — documentado
- La app expone campos de contenido (títulos hero, foto, ilustración con opacidad/tamaño/rotación, CTA, destacados). El posicionamiento fino por arrastre (offsets X/Y, z-index, scrim, backdrop) es prácticamente solo-web. No es bug, pero si se espera "gestionar todo desde el móvil", hay gap.
- **Documentado 2026-06-18**:

| Tarea | App móvil | Solo web |
|---|---|---|
| Textos hero (título, subtítulo, nombre artista) | ✅ | |
| Foto hero (subir, alt, pie, estilo imagen) | ✅ | |
| Ilustración decorativa (subir, alt, opacidad, tamaño, rotación) | ✅ | |
| CTA (texto, enlace, variante, tamaño) | ✅ | |
| Sección destacados (título, cantidad) | ✅ | |
| Sección immersive (media URL, tipo, loop, muted, ajuste, poster) | ✅ | |
| Configuración About (bio, foto, ilustración, CTA) | ✅ | |
| Configuración Contact (texto, redes, mapa) | ✅ | |
| Tema (colores primarios, tipografía) | ✅ | |
| **Posicionamiento fino por arrastre (offsets X/Y, z-index)** | | ✅ PropertyEditor drag |
| **Scrim / velo del hero** (heroScrim*Show*, colores, opacidades) | | ✅ |
| **Backdrop blur** y controles de capa | | ✅ |
| **Preview visual en tiempo real** del render público exacto | | ✅ HeroContent isEditor=true |
| **Overrides de color por-elemento** (139 vars CSS) | | ✅ ThemeEditor pestaña Elementos |

**Regla práctica**: cambios de contenido del día a día (textos, fotos, CTAs) → app OK. Ajustes de maquetación/visual finos → web.

### ✅ CMS verificado correcto (arquitectura sólida):
- **Preview = render real (sin drift)**: público `HomePage→HeroSection→HeroContent(isEditor:false)` y editor `HeroPreview→HeroContent(isEditor:true)` usan EL MISMO componente con flag. El visual editor NO miente. (Consideré drift → verifiqué → no existe.)
- PropertyEditor config-driven (`ELEMENT_CONFIG`) con overrides móvil por campo.
- updateHomeSettings: requireAdmin + rate limit + validación Zod + validateFontUrl/validateColor + revalidatePath/Tag por tipo. Correcto.
- Singleton por `key`, boundaries de carga/error en todas las páginas admin.

---

## 🔤 FUENTES / CONTACTO (ronda 8)

### FONT1. ⭐ Picker de Google Fonts genera URL con pesos hardcodeados → fuentes que no cargan ✅
- /api/fonts/google línea 88: `family=${family}:wght@400;500;600;700&display=swap` para TODA fuente. Las fuentes sin esos pesos (muchas display/script — ej. **Great Vibes solo tiene 400**) devuelven **400 Bad Request** de Google → la fuente elegida por el CMS no carga (cae a fallback). Fix: usar `font.variants` reales (ya se fetchean) para construir el `:wght@`, o pedir solo `400` si no hay más.
- **Hecho 2026-06-16** (commit `82fce8b6`): extrae pesos numéricos de `font.variants` (mapeando `"regular"→"400"`), deduplica, ordena, fallback `"400"` si no hay ninguno.

### CONTACT1. ⭐ Form de contacto depende de que cargue reCAPTCHA → bloqueado con adblock ✅
- ContactForm.tsx:106 `token = executeRecaptcha ? await executeRecaptcha(...) : ''`. Si el script de reCAPTCHA no carga (adblock, bloqueo de privacidad, red), token='' → el server `verifyRecaptchaToken('')` devuelve false → `sendContactEmail` falla → toast de error. El usuario **no puede enviar el formulario de ninguna manera** y el mensaje no explica por qué. Fix: degradación elegante (fallback honeypot + rate-limit si reCAPTCHA no disponible) o mensaje claro.
- **Hecho 2026-06-16** (commit `bc7f48ce`): token vacío → pasa al rate-limit por IP (3 req/10 min) en lugar de rechazar. Token no vacío que falla → sigue rechazando.

### SOCIAL1. delete de social link inexistente → 500 (no 404) ✅
- settings/social DELETE: `prisma.socialLink.delete` sin pre-check → P2025 cae al catch genérico → 500 "Error al eliminar red social" en vez de 404. Cosmético (no crashea). Usar deleteMany o capturar P2025.
- **Hecho 2026-06-16** (commit `88376545`): `deleteMany` en route.ts (404 si count=0) y en server action social.ts (error message si count=0).

### ✅ Verificado OK: ThemeEditor MUESTRA ratio de contraste WCAG (AAA/AA/AA-Large, ThemeSemanticPreview:281-298) — CMS consciente de a11y (informativo, no bloqueante). EditorImageUpload reusa el flujo de upload firmado. Contact form: RHF + zodResolver + server action.

---

## 🎨 ARQUITECTURA DE COLOR / CLASES POR-ELEMENTO (revisión pedida)

Contexto: refactor para dar a CADA elemento su propia clase/variable (evita que cambiar el botón rompa el sidebar por clase compartida), colores fijos pero centralizados, paso previo a CMS por-elemento.

### ✅ Lo que está BIEN (verificado):
- `public-fixed-theme.css` (1005 líneas): **139 variables `--public-*` por-elemento** (`--public-nav-text`, `--public-about-testimonial-cta-bg`, etc.). Resuelve correctamente la colisión botón↔sidebar — cada elemento es independiente.
- **Paridad dark completa**: bloque `.dark .public-fixed-theme` (línea 151) redefine las 139 vars para dark. No quedó a medias.
- Público forzado a light ahora (`forcedTheme="light"` en AppProviders:33) — dark preparado pero apagado.
- ESLint prohíbe hex en TSX (`no-restricted-syntax`) → fuerza el uso de las vars. Buena disciplina.

> NOTA DE PRIORIDAD (aclarado por el usuario): el CMS NO debe funcionar todavía. La prioridad es que el sistema de color FIJO por-elemento funcione perfecto primero; luego se activa el CMS. Por eso "CMS sin cablear" NO es un bug — es el estado deseado. Lo de abajo es lo que SÍ importa ahora.

### ✅ Verificado: la migración por-elemento del PÚBLICO está COMPLETA
- Re-medición correcta (excluyendo componentes ADMIN que viven en `features/`): el render público real (páginas (public) + Hero* + Testimonial slider/card públicos) tiene **0 utilidades Tailwind brand/accent compartidas**. Navbar (10 clases `public-nav-*`, 0 semánticas), Footer (3,0), HeroCta (`public-hero-cta-button`). La colisión botón↔sidebar **está resuelta en público**.
- Los 223/71 usos de `bg-primary`/`text-primary` están en componentes ADMIN (ContactDetail, bookings/*, edit forms) → correcto, el admin es themeable con vars semánticas.

### COLOR-A. ⭐ El botón CTA del hero toma `--public-nav-bg` (no var propia) ✅
- `.public-hero-cta-button` (public-fixed-theme.css:426) usa `background: var(--public-nav-bg); color: var(--public-nav-text)`. El CTA NO tiene var propia → no podés colorearlo distinto del fondo del navbar. Si querés el botón de un color y el nav de otro, hoy NO se puede. Fix: `--public-hero-cta-bg/text/border` dedicadas.
- **Hecho 2026-06-16** (commit `56634b52`): añadidas `--public-hero-cta-bg/text/border` (light: `#6c0a0a`/`#ffaadd`/`#6c0a0a`; dark: `#ffaadd`/`#6c0a0a`/`#ffaadd`). `.public-hero-cta-button` usa las vars propias.

### COLOR-B. ⭐ Preview del editor ≠ render público en el CTA ✅
- HeroCta: rama `isEditor` renderiza `<Button variant={ctaVariant}>` (color desde `--primary`/variant), rama pública renderiza `<Link className="public-hero-cta-button">` (color desde `--public-nav-bg`). Son elementos distintos con fuentes de color distintas → **el botón en el editor NO muestra el color real del público**. (El resto del hero sí comparte `HeroContent`, pero el CTA diverge.) Fix: que el preview use el mismo `<Link className="public-hero-cta-button">`.
- **Hecho 2026-06-16** (commit `56634b52`): editor ahora renderiza `<a className="public-hero-cta-button">` (href="#" + e.preventDefault()). Eliminados imports `Button`, `mapButtonSize`, `mapCtaVariant` (ya innecesarios en HeroCta).

### COLOR-C. ⭐ Override por-elemento solo gana a Tailwind con `!important` (fragilidad) ✅
- Los 14 `!important` están en campos de testimonios + botones de cookie — donde un componente compartido aplica `bg-primary`/`bg-background` (Tailwind) y la clase `.public-*` (misma especificidad) tuvo que forzar con `!important` para ganar. Trampa latente: cualquier elemento nuevo que mezcle utilidad Tailwind de color + clase `.public-*` fallará silenciosamente el override salvo que se añada `!important`. Recomendación: estrategia de especificidad consistente (ej. envolver el público en un scope con mayor especificidad, o no aplicar Tailwind de color donde haya clase por-elemento).
- **Hecho 2026-06-16** (commit `ef942853`): reemplazados 11 de 14 `!important` por selectores compuestos `.public-fixed-theme .public-*` (especificidad 0-2-0 vs 0-1-0 de Tailwind). Los 3 restantes son en `.public-contact-instagram blockquote` (Instagram inyecta estilos inline propios — `!important` correcto ahí).

### COLOR2. Defaults duplicados (relevante para "ponerlos como querés") ✅
- Las 139 `--public-*` son literales: `#6c0a0a` aparece **73 veces** (light) + dark aparte; **0** referencian `var(--primary)`. Para asignar los colores que querés (sin CMS) editás literal por literal. Conviene: agrupar por rol y/o default `var(--primary)` para los que comparten brand, literal solo donde quieras divergir.
- **Hecho 2026-06-16** (commit `805ff3da`): 223 líneas de vars actualizadas. Light block: `#6c0a0a`→`var(--primary)`, `#ffaadd`→`var(--primary-foreground)`, `#fff1f9`→`var(--background)`, `#000000`→`var(--foreground)`. Dark block: invertido correctamente. Valores no-brand (`#fff8fc`, `#1a050a`, `#dcc3cd`) preservados literalmente.

### COLOR3. ⭐ 139 colores NO entran en el schema actual (heads-up del próximo paso) ✅
- Settings es singleton por-página con columnas nombradas; ya quitaron los JSON (`remove_all_json_fields`). 139 colores ×(light+dark) ≈ 278 valores NO caben como columnas. El paso CMS-funcional necesita un mecanismo genérico: tabla relacional `ThemeColorOverride { key, light, dark }` (no columnas, no JSON). Planificarlo antes de cablear.
- **Hecho 2026-06-17** (commit `d7b385a8`): modelo `ThemeColorOverride` añadido a `settings.prisma`. `key` = nombre de la var CSS sin prefijo `--public-` (ej. `"nav-bg"`), `light`/`dark` = valor CSS. Filas ausentes = fallback al default de `public-fixed-theme.css`. Migración `20260617120000_add_theme_color_overrides` aplicada en prod vía Neon MCP.

### COLOR4. 139 controles independientes = UI abrumadora (heads-up UX) ✅
- Exponer 139 colores sueltos a Paola es inmanejable. Agrupar por rol semántico, exponer pocos controles "brand" y DERIVAR el resto; permitir override fino solo donde haga falta.
- **Hecho 2026-06-17** (commit `c9346ac4`): nueva pestaña "Elementos" en ThemeEditor. 8 grupos semánticos (nav, hero, about, gallery, services, contact, testimonials, cookie). Cada grupo expone las keys de color primarias + sección "Avanzado" colapsable para el resto. Overrides persistidos en `theme_color_overrides`; aplicados en SSR vía `buildPublicColorInlineStylesheet` inyectado en el root layout.

---

## 🚧 LÍMITES DE LA AUDITORÍA — por qué NO existe "100% perfecto"

La revisión estática (leer código/config/schema) ya está **agotada** en superficie material + gates verdes (typecheck/lint/test/build/analyze) + audit de deps. Pero hay clases de defectos que NINGUNA lectura puede descartar; cada una necesita un método distinto:

| Clase de defecto | Por qué estático no la ve | Cómo cerrarla |
|---|---|---|
| Races bajo concurrencia real (C4/C6) | Solo aparecen con timing/carga | Test de carga + repro concurrente |
| Memory leaks / cold-start reales | Dependen de runtime sostenido | DevTools profiler, trace en device |
| Flujo update APK, FCM, OAuth Calendar, cámara | Integración nativa device | QA en Android/iOS reales |
| Web Vitals / LCP / bundle real | Depende de red+browser+CDN | Lighthouse (chrome-devtools MCP) + RUM |
| Planes de query DB bajo volumen | Tablas hoy casi vacías → EXPLAIN miente | Seed de volumen + EXPLAIN ANALYZE |
| A11y UX real | Presencia ≠ correctitud | Screen-reader + axe/Lighthouse |
| Lógica vs intención de negocio | El código no sabe qué necesita Paola | Validación con el usuario |
| Regresión visual (theme/breakpoints/dark) | Render no inspeccionable leyendo | Visual diffing (Percy/Chromatic) |
| CVEs futuros | "Limpio hoy" caduca | `pnpm audit` + Dependabot en CI |
| Auth bypass por input crafteado | Requiere ataque activo | Pen-test / fuzzing |

**Conclusión honesta:** lo máximo defendible es *"revisión estática + gates automáticos en verde + audit de deps; riesgo residual acotado a lo runtime/device/carga/humano listado arriba"*. Eso NO es 100% — es el estado correcto y profesional. El "100% sin nada" no es certificable en software real.

---

## 🗺️ PLAN DE REMEDIACIÓN (propuesto, por fases)

**Fase 0 — BBDD (con cuota ya disponible, NO ejecutar sin OK):** branch/backup Neon prod → `migrate deploy` en prod+dev+develop (C1) → añadir `migrate deploy` al pipeline (CI1/CI2) → limpiar índices sin uso + duplicado casing (D-DB1/D-DB2).

**Fase 1 — Desbloqueo app (1 rama, pocas líneas):** coerce price/totalAmount/paidAmount + enum IN_PROGRESS (C2/C3) + validar fontUrl/color en API settings (M19) + guestCount int positivo (M24).

**Fase 2 — Auth/seguridad:** interceptor Flutter doble-retry + logout por timeout (C4/C5) → refresh con transacción + grace (C6) → borrar /api/auth/verify (A14) → change-password revoca tokens (A15) → checkApiRateLimit throw (A16) → lockout login web (A7) → hash tokens en BD (A10) → restringir /api/upload legacy (A11).

**Fase 3 — Arquitectura:** contrato OpenAPI Zod→Dart (ARQ1, mata C2/C3 de raíz) → SettingsService genérico (ARQ3) → unificar auth core (ARQ2) → partir god files (ARQ4).

**Fase 4 — Offline app:** drift (SQLite) + repos offline-first + outbox queue (OFF1) → compresión image_picker (OFF2) → CachedNetworkImage (OFF3) → lazy dashboard (OFF4).

**Fase 5 — Limpieza:** CSRF muerto (A9), Session model sin uso (B29), config muerta next.config (B27), alinear versiones Prisma (B25), reCAPTCHA alerting (B31), TTL analytics verificar cron (D-DB4).

---

## ✅ Verificado correcto
- 34 rutas /api/admin con auth correcta (withAdminJwt / deploy-token / públicas por diseño).
- Server actions con requireAdmin(). Tokens app en secure storage cifrado.
- Update in-app HTTPS-only + SHA-256 obligatorio. CSP/HSTS/headers completos.
- Logout revoca refresh+push. Decimal→String consistente en GET. Pool Neon tuneado free tier.
- Rutas contacts/[id] + trash/[type]/[id]: validadas, soft-delete, slug-unmangle, purge con cleanup Cloudinary, P2003 (service con bookings) manejado.
- logger.ts: enmascarado PII en ctx (email/phone/token, depth+circular guards) — salvo el msg (LOG1).
- iOS ATS habilitado (`NSAllowsArbitraryLoads=false`), permission strings presentes.
- Google Calendar: scope mínimo `calendar.events`, tokens en GoogleSignIn SDK (no manuales).
- Sentry: replay maskAllText+blockAllMedia, gating dev/prod, sample rates correctos.
- map.tsx: ciclo de vida maplibre limpio (sin leak). Seeds admin sin password fallback.
- iOS/Android: signing fail-closed, R8 minify, allowBackup=false, action SHAs pinneadas.
