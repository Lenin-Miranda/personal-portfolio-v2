# Personal Portfolio v2

Segunda versión del portfolio de Lenin Miranda. El proyecto parte de cero como monorepo con Turborepo, Next.js, TypeScript y Tailwind CSS.

## Estructura

```text
apps/
  web/          Sitio público en Next.js
packages/
  content/      Contenido y tipos compartidos
```

## Desarrollo

```bash
pnpm install
pnpm dev
```

La app queda disponible en `http://localhost:3000`.

## Verificación

```bash
pnpm check
pnpm build
```

## Galaxie Copernicus

La interfaz declara `Galaxie Copernicus` como primera familia para titulares y usa Newsreader como fallback temporal. La fuente comercial no estaba presente en Descargas ni en las fuentes instaladas del sistema.

Cuando estén disponibles los webfonts con licencia, añade estas variantes en `apps/web/src/app/fonts/`:

```text
GalaxieCopernicus-Book.woff2
GalaxieCopernicus-BookItalic.woff2
GalaxieCopernicus-Semibold.woff2
```

Después se conectarán con `next/font/local` en `apps/web/src/app/layout.tsx`. Los archivos de fuente no deben subirse a un repositorio público si la licencia no lo permite.

## Dirección visual

- Portfolio editorial contemporáneo con composición asimétrica.
- Tema completo según la preferencia clara u oscura del sistema.
- Cian de la marca como único acento.
- Medios con radio de 24 px y controles interactivos tipo píldora.
- Movimiento moderado para jerarquía y feedback, con reducción de movimiento respetada.
