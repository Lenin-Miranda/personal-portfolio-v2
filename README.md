# Personal Portfolio v2

Monorepo base para la segunda versión del portfolio de Lenin Miranda.

## Estructura

```text
apps/
  web/                  Aplicación Next.js
assets/
  brand/                Assets originales, todavía sin integrar
packages/
  typescript-config/    Configuración compartida de TypeScript
```

## Comandos

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
```

La aplicación local se ejecuta en `http://localhost:3000`.

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
