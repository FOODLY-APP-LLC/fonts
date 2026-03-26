# FOODLY Font CDN

Self-hosted font CDN for serving FOODLY brand fonts and static design assets.

## Project Structure

```text
/
|-- nginx/
|   `-- nginx.conf
|-- public/
|   |-- index.html
|   |-- v1/
|   |   |-- fonts.css
|   |   `-- fonts/
|   |       |-- Dachi-the-Lynx/
|   |       |   |-- Dachi-the-Lynx.woff
|   |       |   `-- Dachi-the-Lynx.woff2
|   |       |-- DejaVu-Sans/
|   |       |   |-- dejavu-sans.woff
|   |       |   |-- dejavu-sans.woff2
|   |       |   |-- dejavu-sans-oblique.woff
|   |       |   |-- dejavu-sans-oblique.woff2
|   |       |   |-- dejavu-sans-bold.woff
|   |       |   |-- dejavu-sans-bold.woff2
|   |       |   |-- dejavu-sans-bold-oblique.woff
|   |       |   `-- dejavu-sans-bold-oblique.woff2
|   |       `-- FiraGO/
|   |           |-- Roman/
|   |           |   |-- FiraGO-Regular.woff
|   |           |   |-- FiraGO-Regular.woff2
|   |           |   |-- FiraGO-Medium.woff
|   |           |   |-- FiraGO-Medium.woff2
|   |           |   |-- FiraGO-Bold.woff
|   |           |   `-- FiraGO-Bold.woff2
|   |           `-- Italic/
|   `-- v2/
|       `-- .gitkeep
`-- examples/
    |-- test.html
    |-- react-app.tsx
    `-- laravel.blade.php
```

## Included Font Families

The current `v1` release exposes these families via [`public/v1/fonts.css`](./public/v1/fonts.css):

- `FiraGO`: `400 Regular`, `500 Medium`, `700 Bold`
- `DejaVu Sans`: `400 Regular`, `400 Italic`, `700 Bold`, `700 Bold Italic`
- `Dachi the Lynx`: `400 Regular`

## What This Setup Provides

- Versioned asset delivery through `/v1`, `/v2`, and later versions
- Cross-origin font loading
- Long-term immutable caching for versioned assets
- Static-only Nginx configuration
- Ready path for multiple font families, icon sets, and SVG/logo assets

## Key Files

- [`nginx/nginx.conf`](./nginx/nginx.conf): Nginx server config
- [`public/v1/fonts.css`](./public/v1/fonts.css): generated `@font-face` rules for all current font families
- [`examples/test.html`](./examples/test.html): browser smoke test
- [`examples/react-app.tsx`](./examples/react-app.tsx): React usage example
- [`examples/laravel.blade.php`](./examples/laravel.blade.php): Laravel Blade usage example

## Font Asset Preparation

1. Keep source fonts grouped by family under `public/v1/fonts/`.
2. Prefer `WOFF2` as the primary delivery format.
3. Keep `WOFF` as fallback where legacy support is needed.
4. Do not overwrite released assets inside an existing version folder.
5. For a new release, create `public/v2/`, copy only the assets you want to publish, and generate a new `fonts.css` there.

## Example Usage

### Generic HTML

```html
<link rel="stylesheet" href="https://your-font-host.example/v1/fonts.css">
```

### Preload Example

```html
<link rel="preload" href="https://your-font-host.example/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

### Basic CSS Usage

```css
body {
    font-family: 'FiraGO', sans-serif;
}

h1,
h2,
h3 {
    font-family: 'FiraGO', sans-serif;
    font-weight: 700;
}

.ui-note {
    font-family: 'DejaVu Sans', sans-serif;
    font-weight: 400;
}

.campaign-title {
    font-family: 'Dachi the Lynx', cursive;
    font-weight: 400;
}
```

### Full HTML Page Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://your-font-host.example" crossorigin>
    <link rel="preload" href="https://your-font-host.example/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="https://your-font-host.example/v1/fonts.css">
    <style>
        body { font-family: 'FiraGO', sans-serif; }
        .hero-title { font-weight: 700; }
        .badge { font-family: 'Dachi the Lynx', cursive; }
    </style>
</head>
<body>
    <h1 class="hero-title">Font CDN</h1>
    <p>Primary UI text uses FiraGO.</p>
    <span class="badge">Special Offer</span>
</body>
</html>
```

### React

```tsx
import React from 'react';

export function App() {
    return (
        <>
            <link rel="preconnect" href="https://your-font-host.example" crossOrigin="anonymous" />
            <link
                rel="preload"
                href="https://your-font-host.example/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2"
                as="font"
                type="font/woff2"
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="https://your-font-host.example/v1/fonts.css" />

            <main style={{ fontFamily: "'FiraGO', sans-serif" }}>
                <h1 style={{ fontWeight: 700 }}>App</h1>
                <p>Shared brand font loaded from the central font host.</p>
            </main>
        </>
    );
}
```

### Laravel Blade

```blade
<head>
    <link rel="preconnect" href="https://your-font-host.example" crossorigin>
    <link rel="preload" href="https://your-font-host.example/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="https://your-font-host.example/v1/fonts.css">
</head>
<body style="font-family: 'FiraGO', sans-serif;">
    <h1 style="font-weight: 700;">Blade App</h1>
    <p style="font-family: 'DejaVu Sans', sans-serif;">Helper text</p>
</body>
```

## Recommended Font Mapping

- `FiraGO` for body text, buttons, forms, headings, and general product UI
- `DejaVu Sans` for fallback or secondary utility text
- `Dachi the Lynx` for decorative titles and campaign-style labels only

## Versioning Strategy

- Use folder-based versioning only: `/v1`, `/v2`, `/v3`
- Never replace files inside an existing released version
- Publish a new `fonts.css` inside the new version folder
- Keep previous versions online until every dependent app is migrated
- Treat version folders as immutable artifacts

## Security Notes

- Disable directory listing
- Allow only `GET` and `HEAD`
- Expose no upload endpoints or app runtime
- Serve font and static asset paths from the public web root

## Performance Notes

- Prefer `WOFF2` for modern browsers
- Keep immutable caching on all versioned assets
- Preload only fonts used on first render
- Avoid preloading decorative fonts unless they are above the fold
- Consider subsetting by language/script for large families
- If storage later moves to S3 or R2, keep the same versioned path contract

## Future Extensions

This layout is ready for:

- Additional font families under `public/v2/fonts/<family>/`
- Icon fonts or sprite sheets
- SVG logos and UI assets under `public/assets/`
- Manifest-driven CSS generation from a build pipeline
