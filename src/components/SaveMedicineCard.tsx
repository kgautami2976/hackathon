import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  PlusCircle, 
  QrCode, 
  Save, 
  Printer, 
  Calendar, 
  Pill, 
  FileText, 
  Tag, 
  MapPin, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { MedicineItem, MedicineCategory } from '../types/medicine';
import { addMedicine } from '../services/storageService';
import { generateQrDataUrl, buildQrPayload } from '../utils/qrUtils';
import { getExpiryStatus, getDaysRemaining, formatDate, playSafetyChime } from '../utils/dateUtils';
import { ActiveTab } from './Navbar';

const CATEGORIES: MedicineCategory[] = [
  'Pain Relief / Fever',
  'Antibiotics',
  'Antihistamines / Allergy',
  'Digestive / Antacid',
  'Cardiovascular / BP',
  'Diabetes',
  'Vitamins & Supplements',
  'Other',
];

interface SaveMedicineCardProps {
  prefillData?: {
    name: string;
    dosage: string;
    batch: string;
    expiryDate: string;
    category: MedicineCategory;
    notes?: string;
  } | null;
  onSaved: (item: MedicineItem) => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenStickerSheet: (item: MedicineItem) => void;
}

export const SaveMedicineCard: React.FC<SaveMedicineCardProps> = ({
  prefillData,
  onSaved,
  onNavigate,
  onOpenStickerSheet,
}) => {
  // Form State
  const [name, setName] = useState<string>(prefillData?.name || '');
  const [dosage, setDosage] = useState<string>(prefillData?.dosage || '500 mg');
  const [category, setCategory] = useState<MedicineCategory>(prefillData?.category || 'Pain Relief / Fever');
  
  // Default expiry date: 1 year from now if empty
  const defaultFutureDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  };

  const [expiryDate, setExpiryDate] = useState<string>(prefillData?.expiryDate || defaultFutureDate());
  const [batchNumber, setBatchNumber] = useState<string>(prefillData?.batch || 'MED-' + Math.floor(10000 + Math.random() * 90000));
  const [dosageNotes, setDosageNotes] = useState<string>(prefillData?.notes || '1 tablet after food as directed');
  const [quantity, setQuantity] = useState<number>(6);
  const [storageLocation, setStorageLocation] = useState<string>('Home Medicine Box');

  // Live QR Code data URL preview
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const [lastSavedItem, setLastSavedItem] = useState<MedicineItem | null>(null);

  // Update when prefillData changes
  useEffect(() => {
    if (prefillData) {
      if (prefillData.name) setName(prefillData.name);
      if (prefillData.dosage) setDosage(prefillData.dosage);
      if (prefillData.category) setCategory(prefillData.category);
      if (prefillData.expiryDate) setExpiryDate(prefillData.expiryDate);
      if (prefillData.batch) setBatchNumber(prefillData.batch);
      if (prefillData.notes) setDosageNotes(prefillData.notes);
    }
  }, [prefillData]);

  // Generate live QR preview on input changes
  useEffect(() => {
    let isCancelled = false;
    const generatePreview = async () => {
      try {
        const payload = buildQrPayload({
          name: name || 'Medicine Name',
          dosage,
          batchNumber,
          expiryDate,
          dosageNotes,
          quantity,
        });
        const url = await generateQrDataUrl(payload, { width: 280 });
        if (!isCancelled) {
          setQrDataUrl(url);
        }
      } catch (err) {
        console.error('Failed to generate preview QR', err);
      }
    };

    generatePreview();
    return () => {
      isCancelled = true;
    };
  }, [name, dosage, batchNumber, expiryDate, dosageNotes, quantity]);

  // Real-time calculated status
  const currentStatus = getExpiryStatus(expiryDate);
  const daysLeft = getDaysRemaining(expiryDate);

  // Quick preset expiry date buttons
  const setPresetMonths = (monthsToAdd: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsToAdd);
    setExpiryDate(d.toISOString().split('T')[0]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a medicine name.');
      return;
    }

    if (!expiryDate) {
      alert('Please select an expiry date.');
      return;
    }

    const newItem = addMedicine({
      name: name.trim(),
      dosage: dosage.trim(),
      category,
      expiryDate,
      batchNumber: batchNumber.trim() || 'UNKNOWN',
      dosageNotes: dosageNotes.trim(),
      quantity: Number(quantity) || 1,
      unit: 'tablets',
      storageLocation: storageLocation.trim(),
      source: prefillData ? 'scan' : 'manual',
      notes: `Per-tablet MediQR assigned on ${new Date().toLocaleDateString()}`,
    });

    setLastSavedItem(newItem);
    setJustSaved(true);
    playSafetyChime(currentStatus);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0d9488', '#10b981', '#3b82f6'],
      });
    } catch {
      // ignore
    }

    onSaved(newItem);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1.5">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Core Feature 2</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Save Medicine Card & Generate QR
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Create a digital identity for separated tablets. Generates an offline 2D QR code for instant safety checks.
        </p>
      </div>

      {/* Success Notification Banner after saving */}
      {justSaved && lastSavedItem && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 sm:p-5 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.3]" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">
                Medicine Card Saved to Cabinet!
              </h4>
              <p className="text-xs text-emerald-800">
                "{lastSavedItem.name}" ({lastSavedItem.dosage}) is secured with a per-tablet QR code.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => onOpenStickerSheet(lastSavedItem)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>Print Blister Stickers</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow"
            >
              <span>View Cabinet</span>
            </button>
          </div>
        </div>
      )}

      {/* Two Column Layout: Form on Left, Live QR Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                Medicine Details
              </span>
              <span className="text-[11px] text-slate-400">* Required fields</span>
            </div>

            {/* Medicine Name & Strength */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol / Crocin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Strength / Dosage
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Category & Batch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-teal-600" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MedicineCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium text-slate-800 bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Batch / Lot Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. PCT231045"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-mono text-slate-900"
                />
              </div>
            </div>

            {/* Expiry Date Field with Quick Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  Expiry Date *
                </label>
                <span className="text-[11px] text-slate-500">Quick set:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold text-slate-900"
                />

                {/* Quick Presets */}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPresetMonths(1)}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-colors"
                    title="1 month from now (Expiring soon test)"
                  >
                    +1 Mo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetMonths(6)}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-colors"
                  >
                    +6 Mo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetMonths(12)}
                    className="px-2 py-1.5 rounded-lg border border-teal-200 bg-teal-50/50 hover:bg-teal-100/50 text-[11px] font-bold text-teal-800 transition-colors"
                  >
                    +1 Yr
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetMonths(24)}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-colors"
                  >
                    +2 Yr
                  </button>
                </div>
              </div>
            </div>

            {/* Dosage Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                Dosage & Usage Instructions
              </label>
              <textarea
                rows={2}
                placeholder="e.g. 1 tablet after breakfast and dinner. Take with a glass of water."
                value={dosageNotes}
                onChange={(e) => setDosageNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-normal text-slate-800"
              />
            </div>

            {/* Quantity and Storage Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Remaining Tablet Count
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold text-slate-900"
                  />
                  <span className="text-xs text-slate-500 shrink-0 font-medium">tablets</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  Storage Box / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kitchen Cabinet, Travel Kit"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-800"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Save className="w-5 h-5" />
                <span>Save Medicine Card & Generate QR</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live QR Preview & Tablet Sticker Simulation (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Live QR Preview Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 text-center">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-teal-600" />
                Live QR Code Preview
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Self-Contained Data
              </span>
            </div>

            {/* Live Expiry Status Pill Banner */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-left ${
              currentStatus === 'safe'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : currentStatus === 'expiring_soon'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${
                  currentStatus === 'safe'
                    ? 'bg-emerald-500'
                    : currentStatus === 'expiring_soon'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                } animate-pulse`}></div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider">
                    {currentStatus === 'safe' && 'SAFE TO USE'}
                    {currentStatus === 'expiring_soon' && 'EXPIRING SOON'}
                    {currentStatus === 'expired' && 'EXPIRED MEDICATION'}
                  </div>
                  <div className="text-[11px] opacity-90 font-bold">
                    {daysLeft >= 0 ? `Expires in ${daysLeft} days` : `Expired ${Math.abs(daysLeft)} days ago`}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold font-mono">
                {formatDate(expiryDate)}
              </span>
            </div>

            {/* The QR Image */}
            <div className="inline-block p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Medicine QR Code"
                  className="w-48 h-48 mx-auto"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-300">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
              )}
              
              <div className="mt-2 text-center">
                <div className="text-xs font-extrabold text-slate-900 truncate max-w-[200px] mx-auto">
                  {name || 'Medicine Name'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  EXP: {expiryDate || 'YYYY-MM-DD'}
                </div>
              </div>
            </div>

            {/* Blister Cell Micro Sticker Preview */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Blister-Cell Sticker Size:</span>
                <span className="font-mono text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  10mm × 10mm
                </span>
              </div>
              
              <p className="text-[11px] text-slate-600 leading-relaxed">
                MediQR formats this code for printing directly onto tiny adhesive labels to stick over each blister cell.
              </p>

              {lastSavedItem && (
                <button
                  type="button"
                  onClick={() => onOpenStickerSheet(lastSavedItem)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors"
                >
                  <Printer className="w-4 h-4 text-teal-600" />
                  <span>Generate Printable Sticker Sheet</span>
                </button>
              )}
            </div>

            {/* Offline guarantee note */}
            <p className="text-[10px] text-slate-400">
              🔒 No internet required to scan this code later — drug name, batch, and expiry date are encoded offline inside the 2D matrix.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};
