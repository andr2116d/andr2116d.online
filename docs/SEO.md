# Estrategia SEO

Objetivo: que una búsqueda de **«Johel Andreé Vargas Villanueva»** (y variantes como «Andreé Vargas» o «andr2116d») muestre esta web y los perfiles enlazados, y que el portafolio sea comprensible para buscadores. No se puede garantizar ninguna posición: el orden lo decide cada buscador.

El 23-10-2026, una búsqueda del nombre completo entre comillas no devolvía resultados sobre esta persona, así que la competencia por la consulta exacta es baja. Aun así, la indexación y la posición dependen de que Google descubra el sitio y confíe en él.

## Hecho durante el desarrollo

| Área                    | Implementación                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Títulos y descripciones | Únicos por página e idioma, ≤ 62 y ≤ 160 caracteres; validados por `tests/seo.spec.ts`.                                                                                                                                                                                                                                                                              |
| Nombre completo         | En el `h1` de la portada, en el `<title>`, en JSON-LD, en el pie y en el CV.                                                                                                                                                                                                                                                                                         |
| URLs                    | Limpias, en minúsculas, con barra final coherente (`trailingSlash: "always"`).                                                                                                                                                                                                                                                                                       |
| Canonical               | Absoluta en cada página, construida desde `site`.                                                                                                                                                                                                                                                                                                                    |
| Idiomas                 | `lang="es-PE"` / `lang="en"`, `hreflang` recíproco + `x-default`, también en el sitemap.                                                                                                                                                                                                                                                                             |
| Sitemap                 | `/sitemap-index.xml` con `lastmod` y alternativas; excluye la 404.                                                                                                                                                                                                                                                                                                   |
| robots.txt              | Generado con la URL del sitemap del dominio configurado.                                                                                                                                                                                                                                                                                                             |
| Datos estructurados     | `@graph` con `Person` (nombre, nombres alternativos, afiliación a UNT y UPAO, `sameAs` a GitHub, LinkedIn e Instagram), `WebSite`, `ProfilePage` en la portada, `SoftwareSourceCode` en cada proyecto. Sin `BreadcrumbList`: el sitio tiene solo dos niveles, no muestra migas de pan visibles y Google pide que los datos estructurados reflejen contenido visible. |
| Open Graph / Twitter    | Título, descripción, `og:locale` + alternativo e imagen propia de 1200×630 por página.                                                                                                                                                                                                                                                                               |
| Enlazado interno        | Navegación por secciones, tarjetas → casos, casos ↔ caso anterior/siguiente y tabla de stack → proyectos. Textos de enlace descriptivos.                                                                                                                                                                                                                             |
| Rendimiento             | Core Web Vitals de laboratorio en verde (LCP < 2 s en móvil simulado, CLS 0).                                                                                                                                                                                                                                                                                        |
| 404                     | Con estado HTTP 404 y `noindex`.                                                                                                                                                                                                                                                                                                                                     |

## Requiere publicar el sitio (por orden)

1. **Publicar en `https://andr2116d.online`** con HTTPS y una sola versión del dominio (redirigir `www` ↔ raíz con 301).
2. **Google Search Console**: añadir una propiedad de tipo _Dominio_ y verificarla con el registro DNS TXT que indique Search Console en el panel del registrador.
3. En Search Console, **enviar** `https://andr2116d.online/sitemap-index.xml`.
4. Usar **Inspección de URL** en `/` y `/en/` y pulsar «Solicitar indexación».
5. **Bing Webmaster Tools**: importar la propiedad desde Search Console (cubre Bing, y en parte DuckDuckGo y Yahoo).
6. **Señales de identidad** (las más importantes para el nombre):
   - GitHub: campo _Website_ del perfil → `https://andr2116d.online`; enlace en el README del perfil.
   - LinkedIn: «Información de contacto» → sitio web, y en la sección Destacados.
   - Instagram: enlace en la biografía.
   - Así los `sameAs` del JSON-LD quedan confirmados en ambos sentidos.
7. Validar los datos estructurados con la [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results) y el [validador de Schema.org](https://validator.schema.org/).
8. Comprobar las vistas previas sociales (LinkedIn Post Inspector, por ejemplo).

## Requiere datos reales (semanas después)

- **Rendimiento en Search Console**: consultas por las que aparece el sitio, CTR y posición media. Ajustar títulos y descripciones según lo que la gente busque realmente.
- **Core Web Vitals (datos de campo, CrUX)**: aparecen en Search Console y PageSpeed Insights solo con tráfico suficiente. Hasta entonces, valen los datos de laboratorio (`pnpm lighthouse`).
- **Cobertura de indexación**: revisar el informe «Páginas» para detectar URLs excluidas o duplicadas.

## Buenas prácticas a futuro

- Mantener actualizado `SITE.updated` y el contenido (nuevos proyectos, cursos, logros verificables).
- Escribir casos de proyecto más completos cuando haya material: decisiones, aprendizajes, capturas. El contenido original y útil es lo que más ayuda.
- Conseguir enlaces legítimos: README de los proyectos apuntando al caso, perfiles académicos, publicaciones o eventos en los que participes.
- Evitar técnicas engañosas: relleno de palabras clave, texto oculto, granjas de enlaces o reseñas falsas. Además de no funcionar, pueden penalizar el sitio.
