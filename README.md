# Ragda-HRIS Portal

Portal HRIS internal PT Ragdalion Revolusi Industri untuk mencatat kehadiran, pengajuan izin/cuti/sakit, dan perjalanan dinas karyawan, serta dilengkapi dengan Event Logging kepatuhan ISO 27001 ISMS.

![Ragda HRIS](https://img.shields.io/badge/Status-ISMS_Compliant-emerald) ![React](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-6.x-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4.x-cyan)

## 🎯 Purpose

Aplikasi ini dirancang untuk mempermudah operasional HRD dan manajemen PT Ragdalion dalam memonitor kehadiran staf IT (di kantor) serta tim OT/IoT (yang sering melakukan Genba di plant customer). Semua aksi dicatat dalam Audit Trail untuk memenuhi standar keamanan informasi **ISO 27001 (Klausul A.12.4.1 - Event Logging)**.

## ✨ Fitur Utama

1. **Presensi Harian (Attendance)**
   - Check-in & Check-out real-time.
   - Pilihan lokasi kerja dengan simulasi Geofencing GPS (Head Office vs Client Plant).
   - Penentuan status otomatis: Tepat Waktu, Terlambat, atau Perjalanan Dinas.

2. **Pengajuan Cuti / Sakit / Izin (Leaves & Permissions)**
   - Form digital untuk Cuti Tahunan, Sakit, dan Izin Khusus.
   - Kebijakan penyerahan surat keterangan dokter 2x24 jam untuk pengajuan sakit (kepatuhan ISO).
   - Tracker status persetujuan (Pending, Approved, Rejected).

3. **Perjalanan Dinas / Visit Plant (Business Travels)**
   - Pengajuan dinas luar kota khusus tim lapangan (visit plant client seperti Sugity, Toyota, Koito, dll).
   - Pencatatan estimasi budget operasional & moda transportasi.

4. **Portal Approval HR / Manager**
   - Halaman khusus bagi HRD/Manager untuk menyetujui atau menolak permohonan izin/dinas secara instan.
   - Fitur pemberian feedback / catatan dari pihak HRD.

5. **Audit Log ISO 27001 (ISMS Compliance)**
   - Event Logging yang aman dan bersifat *read-only*.
   - Merekam Timestamp, Aktor, Aksi, dan Detail Target mutasi data secara presisi.

## 🛠️ Tech Stack

- **React 18.3**
- **Vite 6.x**
- **Tailwind CSS 4.x**
- **React Router 6**
- **Lucide Icons**
- **LocalStorage** (Data persistence lokal tanpa database server tambahan)

## 📦 Jalankan Aplikasi Secara Lokal

```bash
# Clone repository
git clone https://github.com/DwikiDawn/ragda-hris.git
cd ragda-hris

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di **http://localhost:5173** (atau port lain yang tersedia).

## 🚀 Deployment ke Vercel

Aplikasi ini sudah dikonfigurasi untuk siap di-deploy secara instan ke Vercel:
1. Hubungkan akun Vercel Anda dengan GitHub.
2. Impor proyek **DwikiDawn/ragda-hris**.
3. Vercel akan mendeteksi pengaturan Vite secara otomatis.
4. Klik **Deploy**!

---

**Developed with ❤️ by Dawn Agent for PT Ragdalion Revolusi Industri**
