import { ScanResult } from '../types/medicine';

export interface DemoStripSample {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  svgDataUri: string;
  expectedResult: ScanResult;
}

// Generate an SVG showing a cut blister strip with jagged cut edge and missing expiry
const cutBlisterSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
  <defs>
    <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cbd5e1" />
      <stop offset="50%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <filter id="blisterShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background foil with jagged cut on right -->
  <path d="M 20 20 L 260 20 L 270 50 L 255 80 L 275 110 L 250 140 L 280 180 L 255 210 L 270 240 L 20 240 Z" 
        fill="url(#foilGrad)" stroke="#64748b" stroke-width="2" filter="url(#blisterShadow)"/>

  <!-- Perforations and grid lines -->
  <line x1="140" y1="20" x2="140" y2="240" stroke="#94a3b8" stroke-dasharray="4,4" stroke-width="1.5" />
  <line x1="20" y1="130" x2="260" y2="130" stroke="#94a3b8" stroke-dasharray="4,4" stroke-width="1.5" />

  <!-- Blister cavities (Pills) -->
  <circle cx="80" cy="75" r="38" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" filter="url(#blisterShadow)" />
  <circle cx="80" cy="75" r="28" fill="#e2e8f0" />
  <text x="80" y="80" font-family="sans-serif" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle">TABLET</text>

  <circle cx="200" cy="75" r="38" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" filter="url(#blisterShadow)" />
  <circle cx="200" cy="75" r="28" fill="#e2e8f0" />
  <text x="200" y="80" font-family="sans-serif" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle">TABLET</text>

  <circle cx="80" cy="185" r="38" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" filter="url(#blisterShadow)" />
  <circle cx="80" cy="185" r="28" fill="#e2e8f0" />
  <text x="80" y="190" font-family="sans-serif" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle">TABLET</text>

  <circle cx="200" cy="185" r="38" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" filter="url(#blisterShadow)" />
  <circle cx="200" cy="185" r="28" fill="#e2e8f0" />
  <text x="200" y="190" font-family="sans-serif" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle">TABLET</text>

  <!-- Printed Text on Foil -->
  <text x="35" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e293b">CROCIN 650</text>
  <text x="35" y="56" font-family="sans-serif" font-size="10" fill="#334155">Paracetamol Tablets IP 650mg</text>
  <text x="35" y="148" font-family="sans-serif" font-size="10" fill="#475569">B.No. CR-9021</text>
  <text x="35" y="162" font-family="sans-serif" font-size="10" fill="#dc2626" font-weight="bold">[EXPIRY CUT OFF HERE...]</text>

  <!-- Cut line warning graphic -->
  <line x1="270" y1="20" x2="270" y2="240" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4" />
  <rect x="275" y="100" width="115" height="45" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5" />
  <text x="332" y="118" font-family="sans-serif" font-size="10" font-weight="bold" fill="#b91c1c" text-anchor="middle">✂️ CUT EDGE</text>
  <text x="332" y="134" font-family="sans-serif" font-size="9" fill="#991b1b" text-anchor="middle">Expiry Date Lost</text>
</svg>
`)}`;

// Generate SVG for Safe Full Strip
const safeBlisterSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
  <defs>
    <linearGradient id="foilGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
  </defs>
  <rect x="20" y="20" width="360" height="220" rx="8" fill="url(#foilGrad2)" stroke="#0d9488" stroke-width="2" />
  <circle cx="80" cy="90" r="35" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />
  <circle cx="160" cy="90" r="35" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />
  <circle cx="240" cy="90" r="35" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />
  <circle cx="320" cy="90" r="35" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />

  <text x="40" y="160" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">AMOXICILLIN CAPSULES IP</text>
  <text x="40" y="180" font-family="sans-serif" font-size="12" fill="#334155">Strength: 500 mg | Batch: AMX-8821B</text>
  <text x="40" y="200" font-family="sans-serif" font-size="11" fill="#475569">MFG: 02/2025</text>
  <text x="40" y="222" font-family="sans-serif" font-size="13" font-weight="bold" fill="#059669">EXP. DATE: 11/2027</text>
  
  <rect x="260" y="170" width="105" height="45" rx="6" fill="#d1fae5" stroke="#10b981" stroke-width="1.5" />
  <text x="312" y="192" font-family="sans-serif" font-size="11" font-weight="bold" fill="#065f46" text-anchor="middle">FULL STRIP</text>
  <text x="312" y="206" font-family="sans-serif" font-size="10" fill="#047857" text-anchor="middle">Expiry Visible</text>
</svg>
`)}`;

// Generate SVG for Expired Strip
const expiredBlisterSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
  <rect x="20" y="20" width="360" height="220" rx="8" fill="#f1f5f9" stroke="#ef4444" stroke-width="2" />
  <circle cx="100" cy="80" r="30" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
  <circle cx="200" cy="80" r="30" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
  <circle cx="300" cy="80" r="30" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
  
  <text x="40" y="145" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">CETIRIZINE HCl 10mg</text>
  <text x="40" y="168" font-family="sans-serif" font-size="12" fill="#334155">B.No: CTZ-4011</text>
  <text x="40" y="190" font-family="sans-serif" font-size="12" fill="#475569">MFG: 05/2024</text>
  <text x="40" y="215" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">EXP. DATE: 08/2026 (EXPIRED)</text>
  
  <rect x="260" y="160" width="105" height="45" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5" />
  <text x="312" y="182" font-family="sans-serif" font-size="11" font-weight="bold" fill="#991b1b" text-anchor="middle">EXPIRED</text>
  <text x="312" y="196" font-family="sans-serif" font-size="10" fill="#b91c1c" text-anchor="middle">Do not consume</text>
</svg>
`)}`;

export const DEMO_STRIP_SAMPLES: DemoStripSample[] = [
  {
    id: 'cut-strip-crocin',
    title: 'Cut Blister Strip (Crocin 650mg)',
    subtitle: 'Classic problem: Cut edge with expiry date lost!',
    badge: 'Expiry Missing',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    svgDataUri: cutBlisterSvg,
    expectedResult: {
      medicineName: 'Crocin 650',
      dosage: '650 mg',
      batchNumber: 'CR-9021',
      expiryDate: null,
      mfgDate: null,
      expiryFound: false, // Highlights core problem statement!
      category: 'Pain Relief / Fever',
      confidence: 'high',
      notes: '⚠️ Blister strip has been cut or separated from packaging. Expiry date and batch stamp are missing on this tablet cell.',
      rawText: 'CROCIN 650 Paracetamol Tablets IP 650mg B.No. CR-9021 [EXPIRY CUT OFF]',
    },
  },
  {
    id: 'safe-strip-amox',
    title: 'Full Strip Back (Amoxicillin 500mg)',
    subtitle: 'Complete blister foil with clear expiry stamp',
    badge: 'Valid & Safe',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    svgDataUri: safeBlisterSvg,
    expectedResult: {
      medicineName: 'Amoxicillin Capsules IP',
      dosage: '500 mg',
      batchNumber: 'AMX-8821B',
      expiryDate: '2027-11-30',
      mfgDate: '2025-02-10',
      expiryFound: true,
      category: 'Antibiotics',
      confidence: 'high',
      notes: 'Expiry date is verified. Safe for consumption under prescribed shelf-life.',
      rawText: 'AMOXICILLIN CAPSULES IP 500mg B.No: AMX-8821B MFG: 02/2025 EXP: 11/2027',
    },
  },
  {
    id: 'expired-strip-cetirizine',
    title: 'Old Strip (Cetirizine 10mg)',
    subtitle: 'Expired medication detected from packaging',
    badge: 'Expired Strip',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    svgDataUri: expiredBlisterSvg,
    expectedResult: {
      medicineName: 'Cetirizine HCl',
      dosage: '10 mg',
      batchNumber: 'CTZ-4011',
      // Past date
      expiryDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      mfgDate: '2024-05-15',
      expiryFound: true,
      category: 'Antihistamines / Allergy',
      confidence: 'high',
      notes: '🚨 ATTENTION: Expiration date on this packaging has already elapsed. Safe disposal recommended.',
      rawText: 'CETIRIZINE HCl 10mg B.No: CTZ-4011 MFG: 05/2024 EXP: PAST',
    },
  },
];
