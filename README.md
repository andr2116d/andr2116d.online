# andr2116d.online

Web personal de **Johel Andreé Vargas Villanueva**, estudiante de Ingeniería Química (UNT) y de Ingeniería de Sistemas e Inteligencia Artificial (UPAO) en Trujillo, Perú. Portafolio de proyectos, formación, stack y CV, en español e inglés.

Sitio estático hecho con [Astro 7](https://astro.build): sin frameworks de UI, con JavaScript mínimo (tema, menú, canvas del hero y copiar correo) y contenido verificable a partir de repositorios públicos.

## Requisitos

- Node.js ≥ 22.23.4 (el proyecto usa Node 24, ver `.nvmrc`)
- pnpm ≥ 10 (desarrollado con pnpm 12)
- Para pruebas y auditorías: Chromium de Playwright (`pnpm exec playwright install chromium`)

## Instalación

```sh
pnpm install
pnpm exec playwright install chromium   # solo para pruebas, OG y Lighthouse
pnpm dev                                # http://localhost:4321
```

## Comandos

| Comando                             | Qué hace                                                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                          | Servidor de desarrollo con recarga.                                                                                                               |
| `pnpm build`                        | Genera el sitio estático en `dist/`.                                                                                                              |
| `pnpm preview`                      | Sirve `dist/` con Astro (en terminales sin TTY corre en segundo plano).                                                                           |
| `pnpm check`                        | Validación de tipos de Astro y TypeScript.                                                                                                        |
| `pnpm lint`                         | ESLint con reglas de Astro y accesibilidad (`jsx-a11y`).                                                                                          |
| `pnpm format` / `pnpm format:check` | Prettier.                                                                                                                                         |
| `pnpm contrast`                     | Verifica el contraste WCAG de todos los pares de color de `tokens.css`.                                                                           |
| `pnpm test`                         | Playwright sobre la build: axe (WCAG 2.2 AA, claro y oscuro), SEO, teclado, sin JS, móvil y escritorio.                                           |
| `pnpm lighthouse`                   | Lighthouse móvil (4G lenta simulada) y escritorio; informes en `reports/lighthouse/`. Requiere `pnpm build`.                                      |
| `pnpm cv:pdf`                       | Compila y genera los PDF del CV de una página (`public/cv/`); falla si el contenido no cabe en un A4. Ejecutar tras editar el CV o los proyectos. |
| `pnpm verify`                       | Formato, lint, tipos, contraste, build y pruebas en cadena.                                                                                       |

Scripts de mantenimiento (`scripts/`):

| Script                                 | Uso                                                                                           |
| -------------------------------------- | --------------------------------------------------------------------------------------------- |
| `node scripts/capture-projects.mjs`    | Vuelve a capturar las demos públicas en `src/assets/projects/`.                               |
| `node scripts/generate-og.mjs`         | Regenera las imágenes Open Graph (1200×630) en `public/og/`. Ejecutar tras cambiar proyectos. |
| `node scripts/generate-icons.mjs`      | Regenera favicon ICO/PNG desde `public/favicon.svg`.                                          |
| `node scripts/serve-dist.mjs [puerto]` | Servidor estático mínimo de `dist/` (usado por pruebas y Lighthouse).                         |

## Estructura

Arquitectura por _features_: cada carpeta agrupa sus componentes, lógica, textos y estilos. Lo compartido vive en `shared/`.

```text
src/
├── content.config.ts        Esquema Zod de la colección de proyectos
├── content/projects/*.json  Un archivo por proyecto (ES y EN), basado en su repositorio
├── features/
│   ├── hero/                Presentación + figura de partículas (canvas diferido)
│   ├── projects/            Tarjetas, portadas, página de caso y diagrama de flujo
│   ├── education/           Formación con logotipos oficiales y diagrama de Venn
│   ├── stack/               Tabla periódica accesible (radios nativos, sin JS)
│   ├── contact/             Correo, copiar y perfiles
│   ├── cv/                  CV imprimible en A4
│   ├── home/                Composición de la portada
│   ├── navigation/          Cabecera, menú (Popover API) y pie
│   ├── theme/               Tema claro/oscuro sin parpadeo
│   └── seo/                 <head>, Open Graph, hreflang y JSON-LD (Schema.org)
├── shared/
│   ├── config/site.ts       Identidad, enlaces y fecha de revisión (fuente única)
│   ├── i18n/                Idiomas, rutas localizadas y textos de interfaz
│   └── ui/                  Icono, marca y encabezado de sección
├── layouts/BaseLayout.astro
├── pages/                   Rutas finas que solo eligen idioma y vista
├── styles/                  tokens.css (light-dark) y global.css
└── assets/                  Fuente Manrope, logotipos y capturas
scripts/                     Generadores y auditorías
tests/                       Playwright + axe
docs/                        Decisiones técnicas y estrategia SEO
prototipos/                  Prototipo HTML original (referencia, no se publica)
```

### Rutas

| Español              | Inglés                 |
| -------------------- | ---------------------- |
| `/`                  | `/en/`                 |
| `/proyectos/<slug>/` | `/en/projects/<slug>/` |
| `/cv/`               | `/en/cv/`              |

Además: `/404.html`, `/robots.txt`, `/sitemap-index.xml`.

## Editar contenido

- **Datos personales y enlaces**: `src/shared/config/site.ts`. Actualiza `updated` al revisar contenido (se usa en el sitemap y en JSON-LD).
- **Proyectos**: añade o edita `src/content/projects/<slug>.json`. El esquema valida campos y longitudes al compilar. Luego ejecuta `node scripts/generate-og.mjs`. Las pruebas detectan el nuevo proyecto automáticamente.
- **Textos de secciones**: archivo `*.content.ts` de cada feature; textos de interfaz en `src/shared/i18n/ui.ts`.
- **Ciclo y egreso**: `src/features/education/education.content.ts` (`since`, `cycle`, `cycles`, `expected`). Es la fuente única para la web y el CV: **actualiza `cycle` cada semestre** y ejecuta `pnpm cv:pdf`.
- **CV**: datos opcionales que solo tú puedes confirmar (teléfono, fechas de estudio, ciclo, idiomas y certificaciones) en `src/features/cv/cv.content.ts`. Los bloques vacíos no se muestran. Las viñetas del CV están en el campo `highlights` de cada proyecto. Después ejecuta `pnpm cv:pdf`.
- **Stack**: `src/features/stack/stack.content.ts` (cada tecnología enlaza a los proyectos donde se usa).

Regla del proyecto: no se añade experiencia, métricas, roles ni características sin respaldo verificable (repositorio, perfil público o confirmación del autor).

## Despliegue

El resultado es estático (`dist/`) y funciona en cualquier hosting estático. Pasos generales:

1. Conectar el repositorio al hosting (Cloudflare Pages, Netlify o Vercel) con:
   - Comando de build: `pnpm build`
   - Directorio de salida: `dist`
   - Versión de Node: 24
2. Configurar el dominio `andr2116d.online` con HTTPS y redirección de `www` al dominio raíz (o al revés, pero uno solo).
3. `public/_headers` aplica cabeceras de seguridad y caché en Cloudflare Pages y Netlify. En Vercel, replicarlas en `vercel.json`.
4. Si el dominio cambia, compila con `SITE_URL=https://otro-dominio pnpm build` (canonical, sitemap, OG y `robots.txt` se ajustan solos) y actualiza `SITE.domain`.

Tras publicar, sigue la lista de `docs/SEO.md` (Search Console, sitemap, enlaces desde perfiles).

## Calidad verificada

En la build local (datos de laboratorio, no de usuarios reales):

- Lighthouse móvil: Rendimiento 99–100, Accesibilidad 100, Buenas prácticas 100, SEO 100; LCP 1,5–1,8 s, CLS 0, TBT 0 ms.
- 101 pruebas Playwright en escritorio y móvil, incluidas axe WCAG 2.2 AA en ambos temas sin infracciones.
- JavaScript externo: 1,1 KB gzip; CSS de la portada ≈ 7,5 KB gzip.

## Licencias y créditos

- Código y textos: © 2026 Johel Andreé Vargas Villanueva.
- Tipografía Manrope: SIL Open Font License (`src/assets/fonts/OFL.txt`).
- Logotipos de la UNT y de la UPAO: propiedad de cada universidad, usados solo como identificación académica. Procedencia y avisos en `src/assets/logos/README.md`.
- Capturas de proyectos: interfaces públicas de los propios proyectos.
