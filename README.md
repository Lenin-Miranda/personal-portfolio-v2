# Personal Portfolio v2

Segunda versión del portfolio de Lenin Miranda: aplicación Next.js con páginas de proyectos, navegación animada, adaptación a movimiento reducido y un formulario de contacto con envío desde el servidor.

## Estructura

```text
apps/
  web/                  Aplicación Next.js
assets/
  brand/                Assets originales, todavía sin integrar
packages/
  typescript-config/    Configuración compartida de TypeScript
```

## Requisitos e instalación

El manifest fija **pnpm 9.15.9** y requiere **Node.js >=20.9.0**.

```bash
git clone https://github.com/Lenin-Miranda/personal-portfolio-v2.git
cd personal-portfolio-v2
npm install --global pnpm@9.15.9
pnpm install --frozen-lockfile
```

## Comandos

Ejecuta desde la raíz:

```bash
pnpm dev
pnpm check
pnpm build
pnpm test:e2e
```

La aplicación local se ejecuta en `http://localhost:3000`.

Las pruebas de navegación usan Playwright sobre un build de producción local.
Instala el navegador una vez con `pnpm --filter @portfolio/web exec playwright install chromium`.
La arquitectura visual y de movimiento está documentada en [docs/motion-system.md](docs/motion-system.md).

## Formulario de contacto

El formulario envía mensajes desde el servidor mediante la API REST de
SendGrid; no expone la API key al navegador y no necesita un paquete adicional.

1. Crea una API key en SendGrid con permiso para enviar correo.
2. Verifica la dirección que usarás como remitente en **Settings → Sender
   Authentication → Single Sender Verification**.
3. Copia el ejemplo local:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

4. Completa `SENDGRID_API_KEY` y `SENDGRID_FROM_EMAIL`. Puedes cambiar
   `CONTACT_TO_EMAIL`; si lo omites, se usa el correo público del portfolio.
5. En Vercel, agrega las mismas variables en **Project → Settings →
   Environment Variables** para Production y Preview, y luego vuelve a
   desplegar.

Sin esas variables, el sitio sigue compilando y el formulario ofrece el enlace
de email directo como fallback.

## Guías del proyecto

- [Pruebas de navegador](apps/web/e2e/README.md): perfiles, ejecución y diagnóstico.
- [Fuentes](apps/web/public/fonts/README.md): tipografía local y archivo opcional.
- [Sistema de movimiento](docs/motion-system.md): responsabilidades de animación y navegación.

## Verificar cambios

`pnpm check` agrupa lint y revisión de tipos. Ejecuta el build y las pruebas de navegador secuencialmente para evitar escrituras concurrentes de Next.js. Las pruebas de contacto deben interceptar las peticiones; no requieren enviar correo real.
