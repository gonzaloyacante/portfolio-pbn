/**
 * Feature flags del proyecto.
 *
 * Cada flag documenta QUÉ hace y CÓMO se activa. Mientras un flag esté en
 * `false`, la feature existe en el código pero no afecta el render (la app se
 * comporta como antes). Para activarla: cambiar a `true` y mergear.
 *
 * Por qué un flag en vez de borrar el código: el form/schema/DB ya exponen
 * estos campos, y borrarlos rompe la regla "nunca borrar del form". El flag
 * mantiene la funcionalidad "perfecta pero dormida" hasta el día del switch.
 */

/**
 * Colores per-elemento del hero / featured.
 *
 * Por defecto: `false`. Los colores se siguen sirviendo exclusivamente desde
 * `public-fixed-theme.css` (+ overrides vía `ThemeColorOverride`).
 *
 * Cuando se flip a `true`, los campos `heroTitle1Color`, `heroTitle2Color`,
 * `ownerNameColor`, `featuredTitleColor` (y sus variantes Dark) empiezan a
 * aplicarse como `color` inline en el render público, con fallback a los
 * CSS vars del theme cuando el campo está vacío.
 *
 * Próximo paso cuando se active: descomentar las props en `HomePage.tsx`
 * (líneas 60-61) para pasar `titleColor` / `titleColorDark` a
 * `FeaturedCategories`, y reemplazar `void s.XxxColor` por aplicación inline.
 */
export const CMS_HERO_COLORS_ENABLED = false
