import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Search, 
  Filter, 
  QrCode, 
  Trash2, 
  Plus, 
  Minus, 
  Pill, 
  Clock, 
  Printer, 
  RotateCcw, 
  Download, 
  Upload, 
  Eye, 
  Sparkles 
} from 'lucide-react';
import { MedicineItem, ExpiryStatus } from '../types/medicine';
import { 
  getDaysRemaining, 
  getExpiryStatus, 
  formatCountdown, 
  formatDate, 
  playSafetyChime 
} from '../utils/dateUtils';
import { updateMedicine, deleteMedicine, resetToDefaults, exportCabinetJSON } from '../services/storageService';
import { ActiveTab } from './Navbar';

interface ExpiryDashboardProps {
  medicines: MedicineItem[];
  onRefresh: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenQrModal: (item: MedicineItem) => void;
  onOpenStickerSheet: (item: MedicineItem) => void;
}

export const ExpiryDashboard: React.FC<ExpiryDashboardProps> = ({
  medicines,
  onRefresh,
  onNavigate,
  onOpenQrModal,
  onOpenStickerSheet,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ExpiryStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Calculate live statistics
  const stats = useMemo(() => {
    let safe = 0;
    let expiringSoon = 0;
    let expired = 0;

    medicines.forEach((m) => {
      const s = getExpiryStatus(m.expiryDate);
      if (s === 'safe') safe++;
      else if (s === 'expiring_soon') expiringSoon++;
      else expired++;
    });

    return {
      total: medicines.length,
      safe,
      expiringSoon,
      expired,
    };
  }, [medicines]);

  // Filtered medicines list
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const status = getExpiryStatus(m.expiryDate);
      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesBatch = m.batchNumber.toLowerCase().includes(query);
        const matchesNotes = m.dosageNotes.toLowerCase().includes(query);
        const matchesLoc = m.storageLocation?.toLowerCase().includes(query);
        if (!matchesName && !matchesBatch && !matchesNotes && !matchesLoc) return false;
      }

      return true;
    });
  }, [medicines, statusFilter, categoryFilter, searchQuery]);

  // Handle inventory increment/decrement
  const handleQuantityChange = (id: string, delta: number) => {
    const target = medicines.find((m) => m.id === id);
    if (!target) return;
    const nextQty = Math.max(0, target.quantity + delta);
    updateMedicine(id, { quantity: nextQty });
    onRefresh();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from your medicine cabinet?`)) {
      deleteMedicine(id);
      onRefresh();
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Restore standard hackathon demo medicines into your cabinet?')) {
      resetToDefaults();
      onRefresh();
    }
  };

  const handleExportData = () => {
    const jsonStr = exportCabinetJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mediqr-cabinet-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Core Feature 3</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Expiry Safety Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time status tracking for every saved tablet: Safe, Expiring Soon, or Expired.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('add')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Medicine</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            title="Restore sample medicines for demo"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Medicines */}
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-75">
              Total Cabinet
            </span>
            <Pill className={`w-5 h-5 ${statusFilter === 'all' ? 'text-teal-400' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl sm:text-3xl font-black">{stats.total}</div>
          <div className="text-[11px] opacity-75 mt-0.5">Tracked medications</div>
        </div>

        {/* Safe */}
        <div 
          onClick={() => setStatusFilter('safe')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'safe'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-emerald-50/70 text-emerald-950 border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-85 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Safe
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black">{stats.safe}</div>
          <div className="text-[11px] opacity-80 mt-0.5">&gt; 30 days remaining</div>
        </div>

        {/* Expiring Soon */}
        <div 
          onClick={() => setStatusFilter('expiring_soon')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'expiring_soon'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md'
              : 'bg-amber-50/70 text-amber-950 border-amber-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-85 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Expiring Soon
            </span>
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black">{stats.expiringSoon}</div>
          <div className="text-[11px] opacity-80 mt-0.5">Within 30 days window</div>
        </div>

        {/* Expired */}
        <div 
          onClick={() => setStatusFilter('expired')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'expired'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md'
              : 'bg-rose-50/70 text-rose-950 border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-85 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              Expired
            </span>
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black">{stats.expired}</div>
          <div className="text-[11px] opacity-80 mt-0.5">Do not consume</div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medicine, batch, note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Status Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({medicines.length})
          </button>
          
          <button
            onClick={() => setStatusFilter('safe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === 'safe'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            🟢 Safe ({stats.safe})
          </button>

          <button
            onClick={() => setStatusFilter('expiring_soon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === 'expiring_soon'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            🟡 Expiring Soon ({stats.expiringSoon})
          </button>

          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === 'expired'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            🔴 Expired ({stats.expired})
          </button>
        </div>

        {/* Export / Backup button */}
        <button
          onClick={handleExportData}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-600"
          title="Backup cabinet data"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

      </div>

      {/* Medicine Cards Grid */}
      {filteredMedicines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((med) => {
            const status = getExpiryStatus(med.expiryDate);
            const countdown = formatCountdown(med.expiryDate);
            const daysLeft = getDaysRemaining(med.expiryDate);

            return (
              <div
                key={med.id}
                className={`bg-white rounded-2xl border-2 transition-all hover:shadow-lg flex flex-col justify-between overflow-hidden relative ${
                  status === 'safe'
                    ? 'border-emerald-200/80 shadow-sm hover:border-emerald-400'
                    : status === 'expiring_soon'
                    ? 'border-amber-300 shadow-md shadow-amber-500/5 hover:border-amber-400'
                    : 'border-rose-300 shadow-md shadow-rose-500/5 hover:border-rose-400'
                }`}
              >
                {/* Top Status Header Banner */}
                <div className={`px-4 py-2.5 flex items-center justify-between text-xs font-extrabold ${
                  status === 'safe'
                    ? 'bg-emerald-50/90 text-emerald-800 border-b border-emerald-100'
                    : status === 'expiring_soon'
                    ? 'bg-amber-50/90 text-amber-900 border-b border-amber-200'
                    : 'bg-rose-50/90 text-rose-900 border-b border-rose-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      status === 'safe'
                        ? 'bg-emerald-500'
                        : status === 'expiring_soon'
                        ? 'bg-amber-500 animate-ping'
                        : 'bg-rose-500 animate-pulse'
                    }`}></span>
                    <span className="uppercase tracking-wider">
                      {status === 'safe' && 'SAFE TO USE'}
                      {status === 'expiring_soon' && 'EXPIRING SOON'}
                      {status === 'expired' && 'EXPIRED — DO NOT USE'}
                    </span>
                  </div>

                  <span className="font-mono text-[11px] bg-white/80 px-2 py-0.5 rounded shadow-sm">
                    {formatDate(med.expiryDate)}
                  </span>
                </div>

                {/* Main Card Body */}
                <div className="p-5 space-y-4 flex-1">
                  
                  {/* Medicine Name & Category */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {med.name}
                      </h3>
                      {med.dosage && (
                        <span className="text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 shrink-0">
                          {med.dosage}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {med.category} • Batch: <span className="font-mono text-slate-700">{med.batchNumber}</span>
                    </div>
                  </div>

                  {/* Countdown Badge with Icon */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    status === 'safe'
                      ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                      : status === 'expiring_soon'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${
                        status === 'safe'
                          ? 'text-emerald-600'
                          : status === 'expiring_soon'
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`} />
                      <div>
                        <div className="text-xs font-black">
                          {countdown.text}
                        </div>
                        {countdown.subtext && (
                          <div className="text-[10px] opacity-75 font-medium">
                            {countdown.subtext}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold block text-slate-500">
                        {daysLeft >= 0 ? `${daysLeft}d left` : `${Math.abs(daysLeft)}d ago`}
                      </span>
                    </div>
                  </div>

                  {/* Dosage Notes */}
                  {med.dosageNotes && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-0.5 text-[10px] uppercase">
                        Dosage Note:
                      </span>
                      {med.dosageNotes}
                    </div>
                  )}

                  {/* Inventory Counter (+ / -) */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-700">
                      Remaining Tablets:
                    </span>
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 border border-slate-200">
                      <button
                        onClick={() => handleQuantityChange(med.id, -1)}
                        className="w-6 h-6 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold shadow-sm transition-colors"
                        title="Dose taken: Decrement 1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-extrabold text-slate-900">
                        {med.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(med.id, 1)}
                        className="w-6 h-6 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold shadow-sm transition-colors"
                        title="Increment 1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {med.storageLocation && (
                    <div className="text-[10px] text-slate-400">
                      📍 Stored at: {med.storageLocation}
                    </div>
                  )}

                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* View QR Button */}
                    <button
                      onClick={() => onOpenQrModal(med)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors shadow-sm"
                      title="View offline MediQR code"
                    >
                      <QrCode className="w-3.5 h-3.5 text-teal-600" />
                      <span>View QR</span>
                    </button>

                    {/* Blister Stickers Sheet */}
                    <button
                      onClick={() => onOpenStickerSheet(med)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
                      title="Print blister cell micro sticker sheet"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Stickers</span>
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(med.id, med.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove medicine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Pill className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No medicines match this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try changing the status filter above, or add a new medicine card to start protecting cut tablet strips.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Clear Filters
            </button>
            <button
              onClick={() => onNavigate('add')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20"
            >
              Add Medicine
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
