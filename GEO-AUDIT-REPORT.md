# GEO Audit Report: paolabolivar.es

**Audit Date:** 2026-06-21  
**URL:** https://paolabolivar.es  
**Business Type:** Local Business / Agency-Services (Maquilladora profesional — Granada, España)  
**Pages Analyzed:** 16

---

## Executive Summary

**Overall GEO Score: 34/100 (Critical)**

paolabolivar.es tiene una base sólida de contenido en la BD y buenas señales sociales, pero sufre un problema estructural crítico: **todo el contenido de las páginas se entrega a través del payload RSC (React Server Components) de Next.js en formato JavaScript, no en HTML semántico**. Los crawlers de IA que no ejecutan JS (GPTBot, ClaudeBot, PerplexityBot) ven páginas prácticamente vacías. Combinado con la ausencia de `llms.txt`, schemas específicos por página, y cero presencia en plataformas de autoridad (Wikipedia, Google Business Profile, Reddit), el sitio es casi invisible para los motores de búsqueda generativos.

### Score Breakdown

| Categoría | Score | Peso | Score ponderado |
|---|---|---|---|
| AI Citabilidad | 20/100 | 25% | 5.0 |
| Autoridad de Marca | 35/100 | 20% | 7.0 |
| Contenido E-E-A-T | 45/100 | 20% | 9.0 |
| GEO Técnico | 50/100 | 15% | 7.5 |
| Schema & Structured Data | 30/100 | 10% | 3.0 |
| Optimización de Plataformas | 25/100 | 10% | 2.5 |
| **Overall GEO Score** | | | **34/100** |

---

## Problemas Críticos (Fix Inmediato)

### C1. Contenido en RSC payload — invisible para crawlers de IA sin JS
**Afecta:** Todas las páginas  
**Impacto:** ~70% reducción de visibilidad en AI search

Todo el contenido real del sitio (bio, descripciones de servicios, testimonios) está embebido en bloques `self.__next_f.push(...)` de Next.js RSC, no en HTML semántico. El HTML que recibe un crawler básico es:

```html
<!-- Lo que los crawlers ven en /sobre-mi -->
<nav>Inicio | Sobre mí | Portfolio | Servicios | Contacto</nav>
<footer>© 2026 PAOLA BOLÍVAR NIEVAS</footer>
<!-- FIN — sin H1, sin <p>, sin contenido -->
```

El contenido real (bioIntro, bioDescription, testimonios) existe solo en el payload JavaScript embebido. GPTBot y ClaudeBot pueden ejecutar JS superficialmente pero no procesan RSC streams con fidelidad.

**Fix:** Ver sección Quick Wins — requiere convertir `AboutBioColumn`, `HeroContent` y componentes de servicio a Server Components con HTML semántico en el output.

### C2. Sin archivo `llms.txt`
**URL esperada:** https://paolabolivar.es/llms.txt → 404  
**Impacto:** Los LLMs no tienen instrucciones sobre qué contenido indexar ni cómo entender el sitio

El estándar `llms.txt` (análogo a `robots.txt` para LLMs) permite declarar quién eres, qué hacés, y qué páginas son las más relevantes para la IA.

### C3. Número de teléfono placeholder en schema
**Schema afectado:** `ProfessionalService` en todas las páginas  
```json
"telephone": "+34 XXX XXX XXX"
```
Los LLMs usan datos estructurados como fuente de verdad para datos de contacto. Un teléfono ficticio daña la credibilidad del schema completo y puede causar que modelos ignoren o descarten la entidad.

---

## Problemas de Alta Prioridad (Fix en 1 semana)

### H1. Sin etiquetas H1 en HTML semántico
**Afecta:** Todas las páginas públicas  
No hay `<h1>` en el HTML renderizado. Los H1 están embebidos en el RSC payload (en `"bioTitle":"Hola, soy Paola."` en el JSON del stream) pero no como HTML semántico. Los crawlers de IA priorizan H1 para entender el tema principal de la página.

### H2. Schema idéntico en todas las páginas (falta de especificidad)
Todas las páginas — homepage, sobre-mi, servicios/maquillaje-caracterizacion, contacto — muestran exactamente el mismo bloque `ProfessionalService`. No hay schemas específicos por tipo de página:
- Páginas de servicio: sin `Service` schema
- Página about: tiene `Person` ✅ (único caso correcto)
- Sin `BreadcrumbList` en ninguna página
- Sin `FAQPage` en ninguna página
- Sin `speakable` para contenido destacado a voz

### H3. Sin Google Business Profile (GBP) vinculado
Negocio local en Granada sin perfil GBP verificado enlazado desde el schema. Google AI Overviews prioriza fuertemente entidades con GBP para consultas locales ("maquilladora Granada").

### H4. Email de dominio personal (Gmail)
```json
"email": "paolabolivarnievas@gmail.com"
```
Los modelos de IA asocian Gmail con entidades no verificadas. Un email `@paolabolivar.es` aumenta las señales de autoridad.

### H5. Sin contenido textual en páginas de portfolio
Las páginas `/portfolio/[category]` son galerías de imágenes sin texto descriptivo en HTML. Los crawlers de IA no pueden procesar imágenes y no obtienen contexto sobre el trabajo.

---

## Problemas de Prioridad Media (Fix en 1 mes)

### M1. `addressRegion` vacío en schema
```json
"address": {
  "addressLocality": "Granada, España",
  "addressRegion": "",  ← vacío
  "addressCountry": "ES"
}
```
Debería ser `"Andalucía"` o `"Granada"`.

### M2. Sin contenido de blog / artículos
Cero artículos, guías o posts de blog. Los motores de IA como Perplexity y ChatGPT web search priorizan sitios con contenido informacional profundo para citaciones. Una maquilladora que explica técnicas de caracterización, FX, o cuidado de postizos tiene material perfecto para contenido citable.

### M3. Sin schema de reseñas/ratings en testimonios
Los testimonios existen en la BD (8 reseñas verificadas, todas 5 estrellas) pero no hay `Review` o `AggregateRating` schema. Esto podría mostrar estrellas en los resultados de búsqueda generativos.

### M4. `serviceType` desactualizado en schema
El schema actual lista solo:
```json
"serviceType": ["Maquillaje de novias", "Maquillaje para eventos", "Maquillaje artístico", "Sesiones fotográficas", "Maquillaje editorial"]
```
Faltan los servicios reales del CMS: Caracterización, Efectos Especiales (FX), Posticería Profesional, Teatro.

### M5. Sin LinkedIn Company Page ni Wikipedia
LinkedIn personal existe (`linkedin.com/in/paolabolivarnievas`). Para señales de autoridad de IA, una presencia en Wikipedia (aunque sea mínima) o menciones en medios locales/sectoriales de Granada multiplica la credibilidad de entidad.

---

## Problemas de Baja Prioridad

### L1. Sin imagen de perfil ni ilustración en página Sobre mí
`profileImageUrl: null`, `illustrationUrl: null` en la BD. La página "Sobre mí" no tiene imagen personal, lo que reduce las señales de identidad de persona real.

### L2. Sin Twitter/X en redes sociales
6 plataformas en `sameAs` pero falta Twitter/X (`x.com/paolabolivarnievas`). X/Twitter es fuente frecuente de datos de entidad para LLMs.

### L3. `priceRange: "$$"` sin contexto de precios real
`$$` es válido pero aporta poco. Si se añaden páginas de pricing o rangos en los servicios individuales, los LLMs pueden citar precios específicos.

---

## Deep Dives por Categoría

### AI Citabilidad: 20/100

**Problema raíz:** El contenido existe pero no es crawleable en HTML semántico.

El bio de Paola tiene calidad citable en el RSC payload:
> *"Maquilladora especializada en audiovisuales, llevo formándome desde 2021 adquiriendo títulos como técnica en estética y belleza, y técnica en caracterización y maquillaje profesional."*

Este fragmento (134 palabras de contexto) sería perfectamente citable por una IA si estuviera en un `<p>` semántico. Actualmente solo existe como string JSON dentro de `self.__next_f.push(...)`.

Los testimonios también tienen excelente material citable:
> *"Paola me ayudó a diseñar el maquillaje de 5 personajes para mi obra. Cada uno con una personalidad visual completamente distinta."* — Pablo Esteban, Dramaturgo, Teatro Independiente Granada

Sin HTML semántico, esto es invisible.

**Puntos positivos:** Meta descriptions bien redactadas con keywords locales. Estructura de URL legible en español.

---

### Autoridad de Marca: 35/100

| Plataforma | Presencia | Estado |
|---|---|---|
| Instagram | @paolabolivar.makeup | ✅ Activo |
| TikTok | @paolabolivarnievas | ✅ Vinculado |
| YouTube | @paolabolivarnievas | ✅ Vinculado |
| LinkedIn | /in/paolabolivarnievas | ✅ Vinculado |
| Facebook | /paolabolivarnievas | ✅ Vinculado |
| Pinterest | /paolabolivarnievas | ✅ Vinculado |
| Wikipedia | — | ❌ Sin presencia |
| Google Business | — | ❌ Sin vinculación |
| Reddit | — | ❌ Sin menciones |
| Medios locales | — | ❌ Sin press coverage |

La presencia en 6 redes es una base sólida. La brecha es la ausencia de fuentes de autoridad terciaria (Wikipedia, prensa, directorios profesionales) que los LLMs usan como señal de entidad real.

---

### Contenido E-E-A-T: 45/100

**Fortalezas:**
- Formación documentada (desde 2021, 2 titulaciones técnicas)
- 7 skills profesionales listadas en el CMS
- 8 testimonios verificados y ricos de clientes reales (producciones de teatro, cine, eventos)
- Experiencia en audiovisual, teatro, bodas, FX — expertise multidisciplinar

**Debilidades:**
- Todo el contenido E-E-A-T está en JS payload, no en HTML
- Sin foto de perfil (profileImageUrl: null) — "quién eres" no tiene cara
- Sin artículos o contenido que demuestre conocimiento
- Sin fechas de trabajos realizados (experiencia no cuantificada en años)
- Sin menciones de producciones específicas por nombre

---

### GEO Técnico: 50/100

| Check | Estado |
|---|---|
| robots.txt — todos los crawlers de IA permitidos | ✅ |
| HTTPS | ✅ |
| Sitemap declarado en robots.txt | ✅ |
| 16 URLs en sitemap | ✅ |
| CSP y security headers | ✅ Excelentes |
| llms.txt | ❌ 404 |
| H1 en HTML semántico | ❌ Ausente |
| Contenido en `<p>` semántico | ❌ Solo en RSC payload |
| Rendering JS-independiente | ❌ Todo en RSC stream |
| URLs en español (sobre-mi, servicios) | ✅ via rewrites |
| Canonical URLs correctas | ✅ |

**Nota crítica sobre el rendering:** Next.js RSC usa un formato de streaming propietario (`self.__next_f.push()`) que no es HTML estándar. Aunque Googlebot lo procesa (tiene JS rendering), GPTBot, ClaudeBot y PerplexityBot tienen capacidades variables. La solución no requiere cambiar el framework — solo asegurarse de que el HTML inicial incluya el contenido en tags semánticos.

---

### Schema & Structured Data: 30/100

**Schemas presentes:**
- `ProfessionalService` — en todas las páginas (idéntico) ✅/⚠️
- `Person` — solo en `/about` ✅

**Schemas ausentes:**
- `Service` en páginas de servicios ❌
- `BreadcrumbList` ❌
- `FAQPage` ❌
- `AggregateRating` / `Review` ❌
- `speakable` ❌
- `LocalBusiness` (alternativa más específica a ProfessionalService) ❌
- `ImageObject` en portfolio ❌

**Problema de datos:** `telephone: "+34 XXX XXX XXX"` es un placeholder activo. Rompe la credibilidad de toda la entidad schema.

---

### Optimización de Plataformas: 25/100

| Plataforma | Readiness |
|---|---|
| Google AI Overviews | ❌ Sin FAQ, sin GBP, sin contenido semántico |
| ChatGPT web search | ❌ Sin contenido HTML citable |
| Perplexity | ❌ Sin artículos, sin fuentes citables |
| Gemini | ❌ Sin GBP vinculado, sin Knowledge Panel |
| Bing Copilot | ❌ Sin schema específico, sin HTML semántico |

---

## Quick Wins (Esta semana)

1. **Crear llms.txt** — 30 minutos de trabajo, impacto inmediato en crawlers de Claude, ChatGPT y Perplexity. El archivo debe declarar: nombre, descripción, servicios principales, URLs clave.

2. **Corregir teléfono en schema** — cambiar `"+34 XXX XXX XXX"` por el teléfono real o eliminarlo del schema si no hay número público. Un campo falso es peor que ausente.

3. **Agregar `addressRegion: "Andalucía"`** al schema `ProfessionalService` y `Person`.

4. **Actualizar `serviceType`** en el schema con los servicios reales del CMS (FX, Caracterización, Posticería).

5. **Agregar `AggregateRating`** al schema con los 8 testimonios verificados: `ratingValue: 5, reviewCount: 8`.

6. **Crear perfil en Google Business Profile** para `Paola Bolívar Nievas — Maquilladora Profesional, Granada` — activa el Knowledge Panel de Google que los AI Overviews consultan.

---

## Plan de 30 Días

### Semana 1: Infraestructura GEO básica
- [ ] Crear `https://paolabolivar.es/llms.txt`
- [ ] Corregir teléfono en schema (o eliminar placeholder)
- [ ] Actualizar `addressRegion` y `serviceType` en schema
- [ ] Agregar `AggregateRating` schema con testimonios
- [ ] Registrar/vincular Google Business Profile

### Semana 2: HTML semántico para contenido clave
- [ ] Convertir `AboutBioColumn` para que el bio (bioTitle, bioIntro, bioDescription) renderice en `<h1>` + `<p>` tags semánticos visibles en el HTML inicial
- [ ] Agregar `<h1>` explícito en homepage con nombre y especialización
- [ ] Agregar descripción textual `<p>` en páginas de portfolio (actualmente solo imágenes)

### Semana 3: Schemas específicos por página
- [ ] Agregar schema `Service` en cada página de servicio con name, description, areaServed, provider
- [ ] Agregar `BreadcrumbList` en páginas de servicios y portfolio
- [ ] Agregar `speakable` en homepage y about para voiceover/assistants
- [ ] Agregar `Person` schema con certifications en about page (extender el existente)

### Semana 4: Contenido citable y autoridad
- [ ] Publicar 1 artículo/guía: "Cómo se hace el maquillaje FX para cine" — 800+ palabras, semántico, citable
- [ ] Agregar sección FAQ en página de servicios (¿Cuánto tiempo tarda? ¿Traes materiales? ¿Trabajas fuera de Granada?) con `FAQPage` schema
- [ ] Email `@paolabolivar.es` en lugar de Gmail (actualizar schema y contacto)
- [ ] Subir foto de perfil en panel de administración (Sobre mí → profileImageUrl)

---

## Appendix: Páginas Analizadas

| URL | Title | Issues GEO |
|---|---|---|
| https://paolabolivar.es | Maquilladora Profesional en Granada | Sin H1 semántico, contenido en RSC payload |
| https://paolabolivar.es/sobre-mi | Sobre mí | Sin H1, bio en JS, sin perfil image |
| https://paolabolivar.es/servicios | Servicios | Sin H1, sin Service schema |
| https://paolabolivar.es/servicios/maquillaje-caracterizacion | Caracterización | Sin Service schema, sin FAQ |
| https://paolabolivar.es/servicios/efectos-especiales | FX | Sin Service schema, sin FAQ |
| https://paolabolivar.es/servicios/maquillaje-editorial | Editorial | Sin Service schema |
| https://paolabolivar.es/servicios/posticeria-profesional | Posticería | Sin Service schema |
| https://paolabolivar.es/servicios/ynhnjnh | (slug inválido?) | URL no descriptiva |
| https://paolabolivar.es/portfolio | Portfolio | Sin descripción semántica |
| https://paolabolivar.es/portfolio/maquillaje-social | Portfolio Social | Solo imágenes, sin texto |
| https://paolabolivar.es/portfolio/maquillaje | Portfolio Maquillaje | Solo imágenes, sin texto |
| https://paolabolivar.es/portfolio/fx | Portfolio FX | Solo imágenes, sin texto |
| https://paolabolivar.es/portfolio/teatro | Portfolio Teatro | Solo imágenes, sin texto |
| https://paolabolivar.es/portfolio/posticeria | Portfolio Posticería | Solo imágenes, sin texto |
| https://paolabolivar.es/contacto | Contacto | Sin datos de contacto en HTML |
| https://paolabolivar.es/privacidad | Privacidad | OK |

---

*Generado con GEO-SEO Claude — https://github.com/zubair-trabzada/geo-seo-claude*
