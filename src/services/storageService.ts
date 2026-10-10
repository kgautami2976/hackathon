import { MedicineItem, CabinetStats } from '../types/medicine';
import { getExpiryStatus } from '../utils/dateUtils';

const STORAGE_KEY = 'mediqr_medicine_cabinet_v1';

// Seed sample medicines calculated relative to current date (or 2026-10)
const DEFAULT_MEDICINES: MedicineItem[] = [
  {
    id: 'med-paracetamol-500',
    name: 'Paracetamol',
    dosage: '500 mg',
    category: 'Pain Relief / Fever',
    expiryDate: '2027-06-30',
    mfgDate: '2025-06-01',
    batchNumber: 'PCT231045',
    dosageNotes: '1 tablet after food every 6 hours as needed for fever or body ache',
    quantity: 8,
    unit: 'tablets',
    storageLocation: 'Living Room Cabinet #2',
    addedAt: '2026-09-01T10:00:00.000Z',
    source: 'demo',
    notes: 'Cut strip from 10-pack; blister cells labelled with MediQR'
  },
  {
    id: 'med-amoxicillin-500',
    name: 'Amoxicillin',
    dosage: '500 mg',
    category: 'Antibiotics',
    // Expiring soon: ~16 days from now
    expiryDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mfgDate: '2025-02-10',
    batchNumber: 'AMX-8821B',
    dosageNotes: '1 capsule twice daily after meals. Complete full 5-day course.',
    quantity: 4,
    unit: 'capsules',
    storageLocation: 'Bedroom Nightstand',
    addedAt: '2026-09-15T12:30:00.000Z',
    source: 'demo',
    notes: 'Prescribed for throat infection. 4 capsules remaining.'
  },
  {
    id: 'med-cetirizine-10',
    name: 'Cetirizine HCl',
    dosage: '10 mg',
    category: 'Antihistamines / Allergy',
    // Expired: ~24 days ago
    expiryDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mfgDate: '2024-05-15',
    batchNumber: 'CTZ-4011',
    dosageNotes: '1 tablet at bedtime for allergic rhinitis or dust allergy',
    quantity: 3,
    unit: 'tablets',
    storageLocation: 'Kitchen First-Aid Kit',
    addedAt: '2026-08-10T14:20:00.000Z',
    source: 'demo',
    notes: 'Cut blister strip without original box. Warning: EXPIRED.'
  },
  {
    id: 'med-pantoprazole-40',
    name: 'Pantoprazole Gastro-Resistant',
    dosage: '40 mg',
    category: 'Digestive / Antacid',
    // Expiring very soon: ~7 days from now
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mfgDate: '2025-04-12',
    batchNumber: 'PAN-1029',
    dosageNotes: '1 tablet 30 minutes before breakfast with water',
    quantity: 5,
    unit: 'tablets',
    storageLocation: 'Kitchen Counter',
    addedAt: '2026-09-20T08:00:00.000Z',
    source: 'demo',
    notes: 'Antacid for reflux/heartburn.'
  },
  {
    id: 'med-azithromycin-500',
    name: 'Azithromycin',
    dosage: '500 mg',
    category: 'Antibiotics',
    expiryDate: '2027-09-15',
    mfgDate: '2025-09-01',
    batchNumber: 'AZM-7719',
    dosageNotes: '1 tablet once daily 1 hour before or 2 hours after meals',
    quantity: 3,
    unit: 'tablets',
    storageLocation: 'Living Room Cabinet #2',
    addedAt: '2026-09-25T11:15:00.000Z',
    source: 'demo',
    notes: '3-tablet pack for respiratory infection.'
  }
];

export function getMedicines(): MedicineItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveMedicines(DEFAULT_MEDICINES);
      return DEFAULT_MEDICINES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse medicines from storage, reverting to defaults', err);
    return DEFAULT_MEDICINES;
  }
}

export function saveMedicines(items: MedicineItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to write to localStorage', err);
  }
}

export function addMedicine(item: Omit<MedicineItem, 'id' | 'addedAt'>): MedicineItem {
  const medicines = getMedicines();
  const newItem: MedicineItem = {
    ...item,
    id: 'med-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    addedAt: new Date().toISOString(),
  };
  const updated = [newItem, ...medicines];
  saveMedicines(updated);
  return newItem;
}

export function updateMedicine(id: string, updates: Partial<MedicineItem>): MedicineItem | null {
  const medicines = getMedicines();
  let updatedItem: MedicineItem | null = null;
  const nextList = medicines.map((med) => {
    if (med.id === id) {
      updatedItem = { ...med, ...updates };
      return updatedItem;
    }
    return med;
  });
  if (updatedItem) {
    saveMedicines(nextList);
  }
  return updatedItem;
}

export function deleteMedicine(id: string): void {
  const medicines = getMedicines();
  saveMedicines(medicines.filter((m) => m.id !== id));
}

export function resetToDefaults(): MedicineItem[] {
  saveMedicines(DEFAULT_MEDICINES);
  return DEFAULT_MEDICINES;
}

export function calculateStats(medicines: MedicineItem[]): CabinetStats {
  const stats: CabinetStats = {
    total: medicines.length,
    safe: 0,
    expiringSoon: 0,
    expired: 0,
  };

  medicines.forEach((med) => {
    const status = getExpiryStatus(med.expiryDate);
    if (status === 'safe') stats.safe++;
    else if (status === 'expiring_soon') stats.expiringSoon++;
    else stats.expired++;
  });

  return stats;
}

export function exportCabinetJSON(): string {
  const meds = getMedicines();
  return JSON.stringify({ version: '1.0', exportedAt: new Date().toISOString(), medicines: meds }, null, 2);
}

export function importCabinetJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed.medicines)) {
      saveMedicines(parsed.medicines);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
