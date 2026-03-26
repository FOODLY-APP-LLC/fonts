# FOODLY Font CDN

Production-ready self-hosted font CDN for serving FOODLY brand fonts and static design assets from `https://fonts.foodlyapp.ge`.

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

The current `v1` release exposes these families via [public/v1/fonts.css](E:\development\fonts.foodly.live\public\v1\fonts.css):

- `FiraGO`: `400 Regular`, `500 Medium`, `700 Bold`
- `DejaVu Sans`: `400 Regular`, `400 Italic`, `700 Bold`, `700 Bold Italic`
- `Dachi the Lynx`: `400 Regular`

## What This Setup Provides

- Versioned asset delivery through `/v1`, `/v2`, and later versions
- Cross-origin font loading for all FOODLY apps
- Long-term immutable caching for versioned assets
- Safe static-only Nginx configuration
- Ready path for multiple font families, icon sets, and SVG/logo assets

## Files

- [nginx/nginx.conf](E:\development\fonts.foodly.live\nginx\nginx.conf): production Nginx server config
- [public/v1/fonts.css](E:\development\fonts.foodly.live\public\v1\fonts.css): generated `@font-face` rules for all current font families
- [examples/test.html](E:\development\fonts.foodly.live\examples\test.html): browser smoke test
- [examples/react-app.tsx](E:\development\fonts.foodly.live\examples\react-app.tsx): React usage example
- [examples/laravel.blade.php](E:\development\fonts.foodly.live\examples\laravel.blade.php): Laravel Blade usage example

## Font Asset Preparation

1. Keep source fonts grouped by family under `public/v1/fonts/`.
2. Prefer `WOFF2` as the primary delivery format.
3. Keep `WOFF` as fallback where legacy support is needed.
4. Do not overwrite released assets inside an existing version folder.
5. For a new release, create `public/v2/`, copy only the assets you want to publish, and generate a new `fonts.css` there.

## Forge Setup

This project works best on Laravel Forge as a plain static site hosted by Nginx.

### Recommended Site Setup

1. Create a new site in Forge: `fonts.foodlyapp.ge`
2. Select your AWS server
3. Use the web directory as:

   ```text
   /home/forge/fonts.on-forge.com/public
   ```

4. Connect the site to this GitHub repository:

   ```text
   https://github.com/FOODLY-APP-LLC/fonts.git
   ```

5. Enable SSL in Forge for `fonts.foodlyapp.ge`
6. In Cloudflare, keep SSL mode on `Full (strict)`

### Nginx Root

In Forge, the site should serve files directly from the repository `public/` folder.
That means the effective document root should be:

```text
/home/forge/fonts.on-forge.com/public
```

### Deploy Script

A minimal Forge deploy script can be:

```bash
cd /home/forge/fonts.on-forge.com

git pull origin main

$FORGE_COMPOSER install --no-dev --no-interaction --prefer-dist || true

sudo service nginx reload
```

Because this is a static project, Composer is not required. If you want a cleaner deploy script, use this instead:

```bash
cd /home/forge/fonts.on-forge.com

git pull origin main

sudo service nginx reload
```

### Custom Nginx Notes

- Use the rules from [nginx/nginx.conf](E:\development\fonts.foodly.live\nginx\nginx.conf)
- Make sure the site root points to the `public/` directory
- Keep CORS enabled for font files
- Keep immutable cache headers on `/v1/...` assets
- Allow only `GET` and `HEAD`

### Post-Deploy Checks

After deployment, verify:

```bash
curl -I https://fonts.foodlyapp.ge/v1/fonts.css
curl -I https://fonts.foodlyapp.ge/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2
curl -I https://fonts.foodlyapp.ge/v1/fonts/DejaVu-Sans/dejavu-sans-bold.woff2
```

Expected response characteristics:

- `200 OK`
- `Access-Control-Allow-Origin: *`
- `Cache-Control: public, max-age=31536000, immutable`
- correct `content-type` for `woff2` and `woff`
## Cloudflare Setup

### DNS

- Add an `A` or `AAAA` record for `fonts.foodlyapp.ge` pointing to the origin server.
- Enable the orange cloud proxy.

### SSL/TLS

- Use `Full (strict)` after the origin certificate is installed.
- Enable HTTP/2 and HTTP/3.
- Keep Brotli enabled in Cloudflare.

### Cache Rules

Create a rule targeting `fonts.foodlyapp.ge/*`:

- Cache eligibility: `Eligible for cache`
- Edge TTL: `Respect existing headers`
- Browser TTL: `Respect existing headers`

Optional stronger rule for versioned assets:

- Expression: hostname equals `fonts.foodlyapp.ge` and URI path matches `^/v[0-9]+/.*`
- Cache level: `Cache Everything`
- Edge TTL: `1 month` or `Respect existing headers`

## Example Usage

### Generic HTML

```html
<link rel="preconnect" href="https://fonts.foodlyapp.ge" crossorigin>
<link rel="preload" href="https://fonts.foodlyapp.ge/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://fonts.foodlyapp.ge/v1/fonts.css">
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
    <link rel="preconnect" href="https://fonts.foodlyapp.ge" crossorigin>
    <link rel="preload" href="https://fonts.foodlyapp.ge/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="https://fonts.foodlyapp.ge/v1/fonts.css">
    <style>
        body { font-family: 'FiraGO', sans-serif; }
        .hero-title { font-weight: 700; }
        .badge { font-family: 'Dachi the Lynx', cursive; }
    </style>
</head>
<body>
    <h1 class="hero-title">Foodly Fonts CDN</h1>
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
            <link rel="preconnect" href="https://fonts.foodlyapp.ge" crossOrigin="anonymous" />
            <link
                rel="preload"
                href="https://fonts.foodlyapp.ge/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2"
                as="font"
                type="font/woff2"
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="https://fonts.foodlyapp.ge/v1/fonts.css" />

            <main style={{ fontFamily: "'FiraGO', sans-serif" }}>
                <h1 style={{ fontWeight: 700 }}>Foodly App</h1>
                <p>Shared brand font loaded from fonts.foodlyapp.ge.</p>
            </main>
        </>
    );
}
```

### Laravel Blade

```blade
<head>
    <link rel="preconnect" href="https://fonts.foodlyapp.ge" crossorigin>
    <link rel="preload" href="https://fonts.foodlyapp.ge/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="https://fonts.foodlyapp.ge/v1/fonts.css">
</head>
<body style="font-family: 'FiraGO', sans-serif;">
    <h1 style="font-weight: 700;">Foodly Blade App</h1>
    <p style="font-family: 'DejaVu Sans', sans-serif;">Helper text</p>
</body>
```

### Recommended Font Mapping

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

- Nginx disables directory listing
- Only `GET` and `HEAD` are allowed
- No upload endpoints or app runtime are exposed
- Font and static asset paths are rooted to `public/`

## Performance Notes

- Prefer `WOFF2` for all modern browsers
- Keep immutable caching on all versioned assets
- Preload only fonts used on first render
- Avoid preloading decorative fonts like `Dachi the Lynx` unless they are above the fold
- Consider subsetting by language/script for large families such as `FiraGO`
- If you later move storage to S3 or Cloudflare R2, keep the same versioned path contract

## Recommended Usage

- `FiraGO` as the primary FOODLY brand font for body, UI, and headings
- `DejaVu Sans` as fallback or secondary utilitarian text family
- `Dachi the Lynx` only for decorative titles, campaigns, or special labels

## Future Extensions

This layout is ready for:

- Additional font families under `public/v2/fonts/<family>/`
- Icon fonts or sprite sheets
- SVG logos and UI assets under `public/assets/`
- Manifest-driven CSS generation from a build pipeline




