# Decisiones técnicas

Registro breve de las decisiones importantes y su motivo. Fecha de referencia: 23-10-2026.

## Plataforma

| Decisión                                  | Motivo                                                                                                                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Astro 7, salida 100 % estática**        | Contenido que cambia poco; HTML prerenderizado da el mejor LCP y SEO, y se puede alojar en cualquier CDN.                                                                                               |
| **Sin React/Vue ni Tailwind**             | La interactividad es mínima. Componentes `.astro` con CSS con alcance + tokens evitan runtime y dependencias.                                                                                           |
| **TypeScript 6.0, no 7**                  | `@astrojs/check` aún no es compatible con TypeScript 7 (peer `^5 \|\| ^6`) y `typescript-eslint` exige `<6.1`.                                                                                          |
| **`eslint-plugin-jsx-a11y-x`**            | El paquete original no admite ESLint 10; el fork sí y `eslint-plugin-astro` lo reconoce.                                                                                                                |
| **`prettier-plugin-astro` 1.1.1**         | La 1.1.2 se publicó el mismo día; se respetó la espera mínima de pnpm frente a ataques de cadena de suministro.                                                                                         |
| **Fonts API de Astro (local)**            | Manrope variable autoalojada, `preload` y _fallback_ métrico generado: sin peticiones a terceros ni salto de diseño (CLS 0).                                                                            |
| **Servidor estático propio para pruebas** | En entornos sin TTY, `astro preview` de Astro 7 se ejecuta como _daemon_; los _test runners_ no pueden supervisarlo. `scripts/serve-dist.mjs` además imita a un hosting real (404 con estado correcto). |

## Arquitectura

- **Features** (`src/features/*`): cada sección es autónoma (componentes, lógica, textos). Las páginas en `src/pages` solo eligen idioma y vista.
- **Fuente única de datos**: `shared/config/site.ts` (identidad), `content/projects` (proyectos). El CV, el JSON-LD, la portada y las imágenes OG reutilizan los mismos datos.
- **i18n con rutas estáticas**: español en la raíz y español peruano (`es-PE`), inglés en `/en/`. Cada página declara sus alternativas para `hreflang`. Los slugs de sección se traducen (`/proyectos/` ↔ `/en/projects/`), y el sitemap los empareja con `serialize`.

## Diseño

- **Concepto**: la intersección entre química y software. Dos tonos de marca: menta (química) y lila (sistemas e IA), presentes en el nudo de partículas, el diagrama de Venn, la tabla periódica y los acentos.
- **Tokens con `light-dark()`**: un único juego de variables para ambos temas; el tema elegido se guarda y se aplica antes del primer pintado. Sin elección, sigue al sistema operativo.
- **Proyectos ilustrados**: cada tarjeta es un panel con paleta propia y una composición HTML/CSS que evoca el producto (evolución del prototipo). Escalan con _container queries_, así la misma ilustración sirve en la tarjeta y en grande en la página del caso. Las capturas reales de las demos aparecen dentro de cada caso («Así se ve»), y el diagrama de flujo (notación PFD de ingeniería química) queda como detalle técnico.
- **Pantallas muy grandes**: todo está en `rem`; a partir de 1800 px se aumenta el tamaño raíz por tramos (hasta 187,5 % en 4K) para que la composición crezca en proporción en lugar de quedar como una columna estrecha.
- **Logotipos institucionales sobre placa blanca** en ambos temas: el manual de UPAO prohíbe su versión a color sobre fondo oscuro, y ambos manuales prohíben alterarlos.

## Accesibilidad

- HTML semántico, un `h1` por página, `skip link`, foco visible, objetivos táctiles ≥ 44 px y textos alternativos descriptivos.
- **Menú móvil con Popover API**: funciona sin JavaScript, se cierra con Escape y al pulsar fuera.
- **Tabla periódica con radios nativos**: flechas del teclado, anuncio «n de 12», descripción enlazada con `aria-describedby` y detalle revelado solo con CSS.
- **Movimiento**: la animación del hero respeta `prefers-reduced-motion`, tiene botón de pausa (WCAG 2.2.2), se detiene fuera de pantalla y en pestañas ocultas. Las animaciones de aparición son CSS (`animation-timeline`) y se omiten con movimiento reducido.
- El color nunca es el único portador de información (grupos de la tabla y estado «En equipo» llevan texto).
- Contraste verificado en dos niveles: `pnpm contrast` (tokens) y axe en las páginas reales (ambos temas).

## Rendimiento

- Canvas del hero inicializado en `requestIdleCallback`, 30 fps como máximo, partículas agrupadas por capas (≈12 `fill()` por fotograma en vez de ≈6 000).
- Imágenes con `<Picture>` (AVIF/WebP, `srcset`, `sizes`, `loading="lazy"` salvo la captura principal del caso).
- _Prefetch_ de las páginas de proyecto al pasar el cursor.

## Seguridad

- **CSP** generada por Astro con hashes de scripts y estilos en línea. Por eso el código evita atributos `style` y CSS generado en tiempo de compilación.
- Cabeceras extra en `public/_headers` (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS).
- Sin analítica ni rastreadores de terceros.

## Contenido y veracidad

- Los proyectos se describen solo con lo documentado en su repositorio público. Los proyectos en equipo indican la participación documentada (README, flujo de revisión o autoría de commits).
- No se publican edad, empleadores, fechas de graduación, nivel de idiomas ni métricas de impacto.
- El escudo de la UNT se usa como identificación con aviso de licencia (ver `src/assets/logos/README.md`).
