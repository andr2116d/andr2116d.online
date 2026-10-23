# Andreé — Intersección

Prototipos locales de portafolio personal y perfil curricular, hechos con HTML, CSS y JavaScript sin frameworks ni proceso de compilación.

## Abrir

Abre `index.html` directamente en tu navegador. Para una vista previa mediante HTTP, desde la carpeta del proyecto:

```sh
python3 -m http.server 4175 --bind 127.0.0.1 --directory prototipos
```

Después abre http://127.0.0.1:4175. El CV está en http://127.0.0.1:4175/cv.html.

## Incluye

- Portafolio en español e inglés; idioma, título, metadatos y nombres accesibles actualizados juntos.
- Temas claro y oscuro, guardados localmente. En la primera visita se presenta el tema oscuro.
- Escultura matemática de partículas en Canvas 2D; respuesta al puntero, pausa manual y movimiento reducido.
- Seis proyectos basados en repositorios públicos, filtros por área, fichas de detalle y enlaces a código y demos.
- Perfil con formación en curso en UNT y UPAO.
- Tabla periódica interactiva con doce tecnologías y ejemplos concretos de uso.
- Contacto mediante GitHub y LinkedIn; botón para copiar el perfil público de GitHub.
- Segunda página de CV, bilingüe, con una hoja de estilos para impresión en A4. El botón abre la impresión del navegador, donde se puede elegir «Guardar como PDF».
- Menú móvil, enlaces de navegación, foco visible, cierre de diálogos con Escape y retorno al control que los abrió.
- Tipografía Manrope variable alojada localmente. No necesita conectarse a Google Fonts.

## Archivos

```text
prototipos/
├── index.html          Portafolio
├── cv.html             Perfil curricular
├── DESIGN.md           Dirección visual, decisiones y fuentes
├── assets/
│   ├── styles.css      Diseño, responsive, temas y estilos de impresión
│   ├── init.js         Preferencias antes del primer render
│   ├── data.js         Textos ES/EN, proyectos y tecnologías
│   ├── app.js          Traducción, filtros, fichas, menú y CV
│   ├── field.js        Figura de partículas y gestión de movimiento
│   ├── favicon.svg     Marca para la pestaña
│   └── fonts/          Manrope y licencia SIL OFL
└── qa/                 Evidencia de contraste y revisión
```

## Editar el contenido

Los textos están agrupados por idioma en `assets/data.js`. Cada proyecto tiene su descripción, problema, solución, tecnologías y enlaces. Los datos se incluyen en el prototipo: no depende de la API de GitHub para cargar.

`?lang=es` y `?lang=en` permiten abrir un idioma concreto. Al cambiarlo desde los controles se actualiza el parámetro existente. Las preferencias usan `localStorage` cuando está disponible; la página también funciona si el navegador lo bloquea.

Las miniaturas de productos son representaciones conceptuales realizadas con HTML, CSS y SVG. Los detalles lo indican. Los proyectos en equipo identifican el alcance documentado de la participación. No se han añadido empleadores, fechas de estudios, graduación, nivel de inglés ni métricas de impacto no verificadas.

## Verificación

Se revisaron en el navegador las vistas de escritorio y móvil, los dos idiomas, ambos temas, filtros, fichas, cierre con Escape, menú móvil, selección de tecnologías, enlace al CV y persistencia del idioma. El desbordamiento detectado a 320 px se corrigió. No se encontraron textos web visibles por debajo de 14 px en los estados inspeccionados ni errores de consola en la revisión inicial.

`qa/contrast.json` registra los contrastes de los roles principales, mediante WCAG 2 y APCA. Los pares evaluados cumplen 4.5:1; el texto de lectura en modo oscuro supera |Lc| 75. Esto es una comprobación de los tokens, no una auditoría completa de accesibilidad de todos los estados.

El movimiento reducido y la suspensión de la animación fuera de pantalla se implementan en `field.js`; no se ha hecho una medición de rendimiento en un teléfono físico. La impresión cuenta con estilos A4; no se incluye un PDF exportado.

Todo el trabajo se limita a `prototipos`. No hay backend, formularios que envíen mensajes, analítica ni publicación remota. Las demos son enlaces externos a los proyectos originales y dependen de su disponibilidad.
