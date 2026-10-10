# MediQR — Every Tablet Knows Its Expiry 💊

> **A tablet-level QR system for medicine safety.**
> Built by **Team Paradox** for Healthcare Hackathon.

---

## 🎯 The Problem
Traditional medicine packaging only stamps batch numbers and expiration dates onto the **outer box** or the **far foil edge** of a blister strip. 

When blister strips are **cut or separated** (to fit a wallet, pocket, or travel pouch):
- The expiration date and batch code are **permanently severed and lost**.
- Patients and elderly users risk consuming expired pharmaceuticals or throwing away perfectly safe medications out of fear.
- This creates severe public health risks and massive household medicine waste.

---

## 💡 The MediQR Solution
MediQR provides a **tablet-level QR identity system** that guarantees every single pill retains its expiration date and dosage instructions — even after the strip is cut!

- **Phase 1 Prototype**: Generate and print 10mm × 10mm micro QR labels sized for individual blister cell cavities.
- **Phase 2 & 3 Production**: Laser/inkjet 2D DataMatrix marking directly on the foil cell during manufacture (GS1 compliant).

---

## 🚀 The 3 Core Features

### 1. 📷 Scan & Identify (Vision OCR)
- Upload or capture photos of medicine blister strips.
- Powered by **Google Gemini 1.5 Flash Vision OCR** (free tier API).
- Detects Drug Name, Strength, Batch Number, and Expiration Date.
- **"Expiry Not Found" Detection**: If the strip was cut and the expiry stamp is missing, MediQR explicitly flags: `⚠️ Expiry Not Found (Cut Strip Detected)` and offers 1-click conversion to a secured MediQR card!
- Includes built-in 1-click **Hackathon Demo Presets** for instant presentation.

### 2. 💊 Save Medicine Card & QR Generator
- Form to log medicine name, dosage, category, batch number, usage notes, and remaining tablet inventory.
- **Instant Offline QR Generation**: Encodes complete medicine data directly into a self-contained 2D QR payload. **Works 100% offline without internet.**
- **Blister-Cell Sticker Sheet**: Generates a printable sheet of micro QR labels (1cm × 1cm) formatted for sticker sheets to attach to cut tablet cells.

### 3. 🚦 Expiry Safety Dashboard
- Visual status badges for every saved medication:
  - 🟢 **SAFE**: Clean green status with safe time window countdown (e.g. `Expires in 240 days`).
  - 🟡 **EXPIRING SOON**: Amber warning for medications within 30 days of expiry (e.g. `Expires in 16 days`).
  - 🔴 **EXPIRED**: Urgent red warning (e.g. `Expired 24 days ago — DO NOT CONSUME`).
- Live countdown calculation down to the day.
- Pill counter with `+` and `-` buttons to track remaining doses as they are taken.
- Search and filter by category or safety status.
- **In-App Camera QR Scanner**: Point camera at any MediQR code or upload an image to instantly verify safety status with Web Audio chimes.

---

## 🛠️ Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Medical Teal & Navy palette)
- **Icons**: Lucide React
- **QR Codes**: `qrcode` + `html5-qrcode` (Live Camera & Barcode Decoder)
- **OCR Engine**: Google Gemini API Free Tier (`gemini-1.5-flash`) + Smart Fallback Engine
- **Persistence**: LocalStorage with Export/Import backup

---

## 🏃 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

Open `http://localhost:3000` in your browser.

---

## 🏆 Presentation Highlights
- **Team**: Paradox
- **Target Audience**: Elderly patients, Caregivers, Home medicine cabinets, Rural clinics, Pharmacies.
- **Offline Usability**: All critical data is stored inside the QR code itself — zero internet required at scan time.
