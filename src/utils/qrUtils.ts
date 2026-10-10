import QRCode from 'qrcode';
import { MedicineItem } from '../types/medicine';

export interface MediQRPayload {
  mediqr: boolean;
  v: number;
  id?: string;
  name: string;
  dosage: string;
  batch: string;
  exp: string; // YYYY-MM-DD
  mfg?: string;
  notes?: string;
  qty?: number;
}

/**
 * Creates the standardized MediQR payload from a medicine item
 */
export function buildQrPayload(med: Partial<MedicineItem>): string {
  const payload: MediQRPayload = {
    mediqr: true,
    v: 1,
    id: med.id,
    name: med.name || 'Medicine',
    dosage: med.dosage || '',
    batch: med.batchNumber || 'N/A',
    exp: med.expiryDate || '',
    mfg: med.mfgDate,
    notes: med.dosageNotes,
    qty: med.quantity,
  };
  return JSON.stringify(payload);
}

/**
 * Generates high quality Data URL QR Code
 */
export async function generateQrDataUrl(
  text: string,
  options?: {
    width?: number;
    margin?: number;
    darkColor?: string;
    lightColor?: string;
  }
): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 300,
      margin: options?.margin ?? 1,
      color: {
        dark: options?.darkColor || '#0f172a',
        light: options?.lightColor || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR code data URL', err);
    throw err;
  }
}

/**
 * Parses scanned QR text into MediQRPayload or fallback structure
 */
export function parseScannedQr(rawText: string): MediQRPayload | null {
  if (!rawText) return null;
  
  try {
    const parsed = JSON.parse(rawText);
    if (parsed && (parsed.mediqr || parsed.name || parsed.exp)) {
      return {
        mediqr: true,
        v: parsed.v || 1,
        id: parsed.id,
        name: parsed.name || 'Unknown Drug',
        dosage: parsed.dosage || '',
        batch: parsed.batch || parsed.batchNumber || 'N/A',
        exp: parsed.exp || parsed.expiryDate || '',
        mfg: parsed.mfg || parsed.mfgDate,
        notes: parsed.notes || parsed.dosageNotes || '',
        qty: parsed.qty || parsed.quantity,
      };
    }
  } catch {
    // If not JSON, maybe simple formatted text like "MEDIQR: Paracetamol | EXP: 2027-06-30 | BATCH: PCT..."
    const expMatch = rawText.match(/(?:exp|expiry|exp\.date)[:=\s]+([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{2}\/[0-9]{4})/i);
    const nameMatch = rawText.match(/(?:med|drug|name)[:=\s]+([a-zA-Z0-9\s]+)/i);
    if (expMatch || nameMatch) {
      return {
        mediqr: true,
        v: 1,
        name: nameMatch ? nameMatch[1].trim() : 'Scanned Medicine',
        dosage: '',
        batch: 'Extracted',
        exp: expMatch ? expMatch[1].trim() : '',
      };
    }
  }

  return null;
}
