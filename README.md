# Portofolio Rafli Setiawan

Situs portofolio satu halaman, dibuat dengan Vite+, Vue 3, TypeScript, dan Tailwind CSS.

## Menjalankan

Butuh [Vite+](https://viteplus.dev/guide/) (CLI `vp`).

```bash
vp install
vp dev
```

Untuk chatbot, salin `.env.example` menjadi `.env.local`, lalu isi `PORTFOLIO_GEMINI_API_KEY`. Tanpa key ini situs tetap jalan, tetapi chatbot menampilkan pesan error.

## Chatbot

Widget "Ask AI" memakai Gemini API dari Google AI Studio.

- `src/components/chat/` dan `src/composables/useChat.ts`: tampilan di browser.
- `server/chat.ts`: aturan bot, model, batas pesan, dan pemanggilan Gemini. Pengetahuan bot diambil dari `src/data/`, jadi ikut berubah saat konten diedit.
- `api/chat.ts`: endpoint untuk Vercel. `server/devPlugin.ts`: endpoint yang sama untuk `vp dev` dan `vp preview`.

API key hanya dipakai di server. Jangan menamainya dengan awalan `VITE_`, karena key akan ikut terkirim ke browser pengunjung.

## Mengedit konten

Semua konten ada di `src/data/`, jadi template tidak perlu disentuh.

| File                     | Isi                                                     |
| ------------------------ | ------------------------------------------------------- |
| `src/data/profile.ts`    | Nama, jabatan, tagline, teks About dan Contact, link CV |
| `src/data/experience.ts` | Riwayat kerja, terbaru di atas                          |
| `src/data/projects.ts`   | Kartu project                                           |
| `src/data/education.ts`  | Pendidikan                                              |
| `src/data/socials.ts`    | Email, GitHub, LinkedIn                                 |
| `src/data/navigation.ts` | Item navigasi section                                   |

Warna kedua tema ada di bagian atas `src/assets/main.css`.

### Yang perlu diisi sebelum online

- **CV:** letakkan file di `public/cv.pdf`. Gunakan versi publik tanpa nomor telepon dan tanpa detail internal.
- **Data pipeline demo:** di `src/data/projects.ts`, perbarui teksnya, tambahkan `url`, lalu hapus `placeholder: true`.
- **Open Graph:** setelah domain diketahui, ubah `og:image` di `index.html` menjadi URL absolut, misalnya `https://domain-anda.com/og-image.png`.

## Pemeriksaan

```bash
vp check
vp run typecheck
vp test
```

`vp check` menjalankan format, lint, dan type-check untuk file TypeScript. Template `.vue` diperiksa oleh `vp run typecheck`, yang memakai `vue-tsc`.

## Build

```bash
vp run build
vp preview
```

`vp run build` menjalankan type-check lalu build ke folder `dist/`. `vp build` hanya menjalankan build tanpa type-check.

## Deploy

Deploy yang disarankan adalah [Vercel](https://vercel.com), karena `api/chat.ts` sudah mengikuti format Vercel Functions:

1. Hubungkan repo GitHub ke Vercel.
2. Isi **Build command** `pnpm run build` dan **Output directory** `dist`.
3. Tambahkan environment variable `PORTFOLIO_GEMINI_API_KEY`.

[Netlify](https://www.netlify.com) dan [Cloudflare Pages](https://pages.cloudflare.com) bisa memakai pengaturan build yang sama, tetapi `api/chat.ts` perlu dipindahkan ke format function masing-masing layanan. `server/chat.ts` tidak perlu diubah, karena memakai `Request` dan `Response` standar. GitHub Pages hanya melayani file statis, jadi chatbot tidak bisa berjalan di sana.
