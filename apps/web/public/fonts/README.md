# Portfolio Fonts

This directory is reserved for optional webfont assets used by the portfolio.

## Current behavior

[globals.css](../../src/app/globals.css) declares Galaxie Copernicus through `local(...)` font sources. Browsers use an installed matching font or fall back to the configured serif stack. The repository does not currently include a font binary in this directory.

## Optional webfont

The intended filename is:

```text
GalaxieCopernicus-Book.woff2
```

Only add a file that your license permits you to serve and redistribute. Copying the file here alone does not activate it: the current `@font-face` also needs a corresponding `url("/fonts/GalaxieCopernicus-Book.woff2")` source if the font is to be served over HTTP.

## Verification

After any font integration, inspect the browser network request, computed font and layout on a machine without the font installed. Keep a readable fallback and check wrapping and layout shifts.

[Project setup](../../../../README.md).
