export type ExpiryStatus = 'safe' | 'expiring_soon' | 'expired';

export type MedicineCategory = 
  | 'Pain Relief / Fever' 
  | 'Antibiotics' 
  | 'Antihistamines / Allergy' 
  | 'Digestive / Antacid' 
  | 'Cardiovascular / BP' 
  | 'Diabetes' 
  | 'Vitamins & Supplements' 
  | 'Other';

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string; // e.g. "500 mg"
  category: MedicineCategory;
  expiryDate: string; // YYYY-MM-DD
  mfgDate?: string;   // YYYY-MM-DD
  batchNumber: string;
  dosageNotes: string; // e.g. "1 tablet after meal twice daily"
  quantity: number; // e.g. 6
  unit: string; // e.g. "tablets", "capsules"
  storageLocation?: string; // e.g. "Kitchen First Aid Box"
  addedAt: string; // ISO string
  source: 'scan' | 'manual' | 'demo';
  qrCodeData?: string;
  notes?: string;
}

export interface ScanResult {
  medicineName: string | null;
  dosage: string | null;
  batchNumber: string | null;
  expiryDate: string | null; // YYYY-MM-DD or null
  mfgDate: string | null;
  expiryFound: boolean;
  confidence: 'high' | 'medium' | 'low';
  category?: MedicineCategory;
  rawText?: string;
  notes?: string;
}

export interface CabinetStats {
  total: number;
  safe: number;
  expiringSoon: number;
  expired: number;
}
