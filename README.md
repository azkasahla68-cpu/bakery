
# Levant Boulangerie — Static Website
Siap upload ke GitHub Pages.

## Struktur
- `index.html`
- `assets/css/style.css`
- `assets/js/app.js`
- `assets/img/product-*.svg`, `logo.svg`

## Cara Deploy ke GitHub Pages
1. Buat repo baru di GitHub, misal `levant-boulangerie`.
2. Upload seluruh isi folder ini (atau ekstrak ZIP lalu drag-drop).
3. Masuk ke Settings → Pages → Source: `Deploy from a branch`, pilih `main` dan `/ (root)`.
4. Tunggu beberapa menit sampai halaman aktif.

## Catatan
- Formulir (kritik/saran & testimoni) disimpan di `localStorage` (demo). Integrasi backend bisa ditambahkan kemudian (mis. Formspree/Netlify).
- Keranjang & checkout bersifat demo (alert total). Dapat dihubungkan ke payment gateway di tahap berikutnya.
