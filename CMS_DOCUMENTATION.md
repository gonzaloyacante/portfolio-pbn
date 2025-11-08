# 🎨 Sistema CMS Portfolio PBN

## ✅ Sistema Completamente Implementado

El portfolio ahora es **100% dinámico y configurable desde el admin** sin tocar código. Como WordPress, pero mejor.

---

## 🎯 Características Principales

### 1. **Design System Completo** (`/admin/design`)
Controla TODOS los aspectos visuales del sitio:

#### Colores
- Color primario
- Color secundario  
- Color de fondo
- Color de texto
- Color de acento

#### Tipografía
- Fuente para títulos (ej: Parisienne, serif)
- Fuente para cuerpo (ej: Inter, sans-serif)
- Tamaño de títulos (ej: 4rem)
- Tamaño de texto (ej: 1rem)
- Altura de línea (ej: 1.6)

#### Espaciados y Layout
- Ancho máximo del contenedor (ej: 1200px)
- Padding de secciones (ej: 4rem 2rem)
- Espaciado entre elementos (ej: 2rem)
- Radio de bordes (ej: 0.5rem)

#### Efectos y Animaciones
- Sombra de caja (box-shadow)
- Transformación hover (ej: translateY(-4px))
- Velocidad de transiciones (ej: 0.3s)

**Vista previa en vivo** antes de guardar cambios.

---

### 2. **Layout Manager** (`/admin/layout-manager`)
Control total sobre estructura de páginas:

#### Funcionalidades
- **Drag & Drop** para reordenar secciones
- Toggle visibilidad (mostrar/ocultar secciones)
- Selector de página (home, about, projects, contact)
- Configuración específica por tipo de sección

#### Configuración de Skills
- Layout: Cuadrícula / Circular / Lista
- Número de columnas (2-6)
- Tamaño de iconos (ej: 3rem)
- Mostrar barra de progreso (sí/no)

#### Configuración de Proyectos
- Número de columnas (1-4)
- Proyectos por página (3-12)

**Orden dinámico**: Arrastra para cambiar el orden de CUALQUIER sección.

---

### 3. **Content Blocks Manager** (`/admin/content-blocks`)
Bloques de contenido reutilizables:

#### Tipos de Bloques
- **TEXT**: Bloques de texto enriquecido
- **IMAGE**: Imágenes con metadata
- **CTA**: Call-to-action buttons
- **STATS**: Estadísticas/métricas
- **TESTIMONIAL**: Testimonios de clientes
- **CUSTOM_HTML**: HTML personalizado

#### Funcionalidades
- CRUD completo (crear, editar, eliminar)
- Editor JSON para contenido flexible
- Toggle visibilidad
- Sistema de orden
- Slugs únicos para referencia

---

## 🏗️ Arquitectura Técnica

### Backend (API)

#### Modelos Prisma
```prisma
model DesignSettings {
  id                String   @id @default("singleton")
  primaryColor      String   @default("#8B1538")
  secondaryColor    String   @default("#FFC0CB")
  backgroundColor   String   @default("#FFFFFF")
  textColor         String   @default("#1A1A1A")
  accentColor       String   @default("#D4AF37")
  headingFont       String   @default("Parisienne, serif")
  bodyFont          String   @default("Inter, sans-serif")
  headingSize       String   @default("4rem")
  bodySize          String   @default("1rem")
  lineHeight        String   @default("1.6")
  containerMaxWidth String   @default("1200px")
  sectionPadding    String   @default("4rem 2rem")
  elementSpacing    String   @default("2rem")
  borderRadius      String   @default("0.5rem")
  boxShadow         String   @default("0 4px 6px rgba(0,0,0,0.1)")
  hoverTransform    String   @default("translateY(-4px)")
  transitionSpeed   String   @default("0.3s")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model PageSection {
  id          String      @id @default(uuid())
  pageName    String      // "home", "about", "projects", "contact"
  sectionType SectionType // HERO, ABOUT, SKILLS, PROJECTS, CONTACT, CUSTOM
  title       String
  subtitle    String?
  order       Int         @default(0)
  visible     Boolean     @default(true)
  config      Json        // Configuración flexible por tipo
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model ContentBlock {
  id        String           @id @default(uuid())
  slug      String           @unique
  name      String
  type      ContentBlockType // TEXT, IMAGE, CTA, STATS, TESTIMONIAL, CUSTOM_HTML
  content   Json             // Contenido flexible
  order     Int              @default(0)
  visible   Boolean          @default(true)
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
}
```

#### API Endpoints

**Design Settings**
- `GET /api/design-settings` - Obtener configuración (público)
- `PUT /api/design-settings` - Actualizar configuración (admin)

**Page Sections**
- `GET /api/page-sections?pageName=home` - Listar secciones (público)
- `GET /api/page-sections/:id` - Obtener sección específica
- `POST /api/page-sections` - Crear sección (admin)
- `PUT /api/page-sections/:id` - Actualizar sección (admin)
- `PUT /api/page-sections/reorder` - Reordenar secciones (admin)
- `DELETE /api/page-sections/:id` - Eliminar sección (admin)

**Content Blocks**
- `GET /api/content-blocks` - Listar bloques (público)
- `GET /api/content-blocks/:id` - Obtener bloque específico
- `POST /api/content-blocks` - Crear bloque (admin)
- `PUT /api/content-blocks/:id` - Actualizar bloque (admin)
- `DELETE /api/content-blocks/:id` - Eliminar bloque (admin)

---

### Frontend (Next.js)

#### Design Provider
```tsx
// components/design-provider.tsx
// Carga settings del CMS y aplica CSS variables a :root
// Variables disponibles:
// --cms-primary-color
// --cms-secondary-color
// --cms-background-color
// --cms-text-color
// --cms-accent-color
// --cms-heading-font
// --cms-body-font
// --cms-heading-size
// --cms-body-size
// --cms-line-height
// --cms-container-max-width
// --cms-section-padding
// --cms-element-spacing
// --cms-border-radius
// --cms-box-shadow
// --cms-hover-transform
// --cms-transition-speed
```

#### Componentes Dinámicos
Todos los componentes públicos ahora leen del CMS:

**Hero**
- Título y subtítulo desde PageSection
- CTAs configurables (texto de botones)
- Estadísticas dinámicas
- Estilos desde DesignSettings

**About**
- Texto completo editable
- Imagen configurable
- Especialidades desde config.specialties
- Estilos dinámicos

**Skills**
- Layout: grid / circular / list (configurable)
- Columnas ajustables
- Tamaño de iconos
- Barra de progreso opcional
- Lee de API /api/skills

**Projects**
- Configuración de columnas
- Items por página
- Filtros por categoría

**Contact**
- Formulario con validación
- Info de contacto desde settings

---

## 📊 Datos de Seed

El seed inicializa:
- ✅ Design Settings con paleta burgundy/pink
- ✅ 5 PageSections para home (HERO, ABOUT, SKILLS, PROJECTS, CONTACT)
- ✅ Usuario admin (admin@paolabolivar.com / Admin123!)

---

## 🚀 Uso del Sistema

### 1. Cambiar Colores del Sitio
1. Ir a `/admin/design`
2. Modificar colores usando color pickers
3. Ver preview en vivo
4. Guardar cambios
5. **Cambios aplicados instantáneamente** en toda la web

### 2. Reordenar Secciones
1. Ir a `/admin/layout-manager`
2. Seleccionar página (home, about, etc.)
3. **Arrastrar secciones** para cambiar orden
4. Toggle 👁️ para mostrar/ocultar
5. Guardar layout

### 3. Configurar Skills Layout
1. En Layout Manager, buscar sección "SKILLS"
2. Cambiar layout: grid → circular
3. Ajustar columnas: 3 → 4
4. Activar "Mostrar Progreso"
5. Guardar

### 4. Crear Content Block
1. Ir a `/admin/content-blocks`
2. Click "Nuevo Bloque"
3. Nombre: "Hero Background"
4. Slug: "hero-bg"
5. Tipo: IMAGE
6. Content JSON:
```json
{
  "url": "https://...",
  "alt": "Hero background"
}
```
7. Guardar

---

## 🎨 Casos de Uso

### Cambio Completo de Branding
**Escenario**: Cliente quiere cambiar de burgundy/pink a azul/dorado

1. `/admin/design`:
   - Primary: #1E40AF (azul)
   - Secondary: #FBBF24 (dorado)
   - Accent: #60A5FA (azul claro)
   - Guardar

**Resultado**: TODO el sitio ahora es azul/dorado. Cero código.

### Reorganizar Home Page
**Escenario**: Quiero mostrar Projects antes de About

1. `/admin/layout-manager`
2. Seleccionar "home"
3. Arrastrar "PROJECTS" arriba de "ABOUT"
4. Guardar

**Resultado**: Orden cambiado instantáneamente.

### Skills en Círculos
**Escenario**: "Las skills cuadradas, las pongo cuadradas. Circulares, van circulares."

1. Layout Manager → Sección SKILLS
2. Layout: grid → circular
3. Guardar

**Resultado**: Skills ahora se muestran en círculos.

---

## 🔧 Mejoras Futuras (Opcional)

- [ ] Preview iframe en tiempo real en admin
- [ ] Editor WYSIWYG para Content Blocks
- [ ] Sistema de temas predefinidos
- [ ] Import/export de configuraciones
- [ ] Historial de cambios (rollback)
- [ ] A/B testing de layouts
- [ ] Modo dark/light automático

---

## 📝 Notas Técnicas

### CSS Variables
El sistema inyecta variables CSS en `:root`, permitiendo:
```css
.my-element {
  color: var(--cms-primary-color);
  font-family: var(--cms-heading-font);
  padding: var(--cms-section-padding);
}
```

### Caché
- Frontend usa SWR para cache de API calls
- Settings se cargan 1 vez al montar la app
- Método `refresh()` disponible para forzar recarga

### Seguridad
- Endpoints de escritura protegidos con JWT
- Solo role ADMIN puede modificar
- Validación en backend y frontend

---

## 🎉 Conclusión

**El portfolio es ahora 100% CMS-driven.**

El administrador puede:
- ✅ Cambiar colores, fuentes, espaciados
- ✅ Reordenar secciones con drag & drop
- ✅ Cambiar layouts (grid/circular/list)
- ✅ Editar TODO el texto del sitio
- ✅ Ocultar/mostrar secciones
- ✅ Crear bloques de contenido reutilizables
- ✅ Ver preview antes de guardar

**Sin tocar una línea de código. Literalmente WordPress, pero mejor.**

---

**Desarrollado con ❤️ para Portfolio PBN v2**
