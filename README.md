# FOODLY Font CDN

Production-ready self-hosted font CDN for serving FOODLY brand fonts and static design assets from `https://fonts.foodly.live`.

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

## Ubuntu Deployment

1. Install Nginx:

   ```bash
   sudo apt update
   sudo apt install -y nginx
   ```

2. Create the application root:

   ```bash
   sudo mkdir -p /var/www/fonts.foodly.live
   sudo chown -R www-data:www-data /var/www/fonts.foodly.live
   ```

3. Copy the project files:

   ```bash
   sudo rsync -av ./public/ /var/www/fonts.foodly.live/
   sudo cp ./nginx/nginx.conf /etc/nginx/sites-available/fonts.foodly.live.conf
   ```

4. Enable the site:

   ```bash
   sudo ln -s /etc/nginx/sites-available/fonts.foodly.live.conf /etc/nginx/sites-enabled/fonts.foodly.live.conf
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. Enable TLS:

   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d fonts.foodly.live
   ```

6. Verify:

   ```bash
   curl -I https://fonts.foodly.live/v1/fonts.css
   curl -I https://fonts.foodly.live/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2
   curl -I https://fonts.foodly.live/v1/fonts/DejaVu-Sans/dejavu-sans-bold.woff2
   ```

## Cloudflare Setup

### DNS

- Add an `A` or `AAAA` record for `fonts.foodly.live` pointing to the origin server.
- Enable the orange cloud proxy.

### SSL/TLS

- Use `Full (strict)` after the origin certificate is installed.
- Enable HTTP/2 and HTTP/3.
- Keep Brotli enabled in Cloudflare.

### Cache Rules

Create a rule targeting `fonts.foodly.live/*`:

- Cache eligibility: `Eligible for cache`
- Edge TTL: `Respect existing headers`
- Browser TTL: `Respect existing headers`

Optional stronger rule for versioned assets:

- Expression: hostname equals `fonts.foodly.live` and URI path matches `^/v[0-9]+/.*`
- Cache level: `Cache Everything`
- Edge TTL: `1 month` or `Respect existing headers`

## Example Usage

### Generic HTML

```html
<link rel="preconnect" href="https://fonts.foodly.live" crossorigin>
<link rel="preload" href="https://fonts.foodly.live/v1/fonts/FiraGO/Roman/FiraGO-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://fonts.foodly.live/v1/fonts.css">
```

### React

Import the stylesheet once in your app shell, or include it in `public/index.html`.
Use `font-family: 'FiraGO', sans-serif;` for the main UI and preload only the exact font files used above the fold.

### Laravel Blade

Add the stylesheet in the main layout `<head>` and apply the relevant family where needed.

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
