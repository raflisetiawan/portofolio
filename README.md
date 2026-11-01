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
- `server/standalone.ts`: server Node untuk VPS. `server/devPlugin.ts`: endpoint yang sama untuk `vp dev` dan `vp preview`.

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

`vp run build` menjalankan type-check, lalu menghasilkan situs di `dist/` dan server chat di `dist-server/`. `vp build` hanya membuat situsnya, tanpa type-check dan tanpa server chat.

## Deploy

Situs berjalan di VPS, di https://raflisetiawan.tech. Nginx melayani file statis dari `/var/www/portfolio/public` dan meneruskan `/api/chat` ke service `portfolio-chat` di `127.0.0.1:3001`. Konfigurasinya ada di folder `deploy/`.

Untuk deploy, commit perubahan, pastikan kunci SSH sudah dimuat, lalu jalankan dari **cmd**:

```bash
ssh-add -l
```

```bash
deploy\deploy.cmd
```

Skrip ini membangun situs di laptop lalu mengirim hasilnya ke server. Server menyimpan 5 build terakhir di `~/releases/`. Untuk rollback, jalankan `./deploy-portfolio.sh ~/releases/<arsip>.tar.gz` lewat `ssh staging`.
