import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { ScanIdentify } from './components/ScanIdentify';
import { SaveMedicineCard } from './components/SaveMedicineCard';
import { ExpiryDashboard } from './components/ExpiryDashboard';
import { QRModal } from './components/QRModal';
import { BlisterStickerSheet } from './components/BlisterStickerSheet';
import { QRScannerModal } from './components/QRScannerModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { MedicineItem, MedicineCategory } from './types/medicine';
import { getMedicines, calculateStats } from './services/storageService';
import { getStoredApiKey } from './services/geminiService';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Prefill data when transferring from Scan & Identify to Save Card
  const [prefillForSave, setPrefillForSave] = useState<{
    name: string;
    dosage: string;
    batch: string;
    expiryDate: string;
    category: MedicineCategory;
    notes?: string;
  } | null>(null);

  // Modals state
  const [selectedQrItem, setSelectedQrItem] = useState<MedicineItem | null>(null);
  const [selectedStickerItem, setSelectedStickerItem] = useState<MedicineItem | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // Load medicines & api key status
  const refreshCabinet = () => {
    const list = getMedicines();
    setMedicines(list);
  };

  useEffect(() => {
    refreshCabinet();
    setHasApiKey(Boolean(getStoredApiKey()));
  }, []);

  const stats = calculateStats(medicines);

  // Handle transfer from Scan to Save Card
  const handleTransferToSave = (prefill: {
    name: string;
    dosage: string;
    batch: string;
    expiryDate: string;
    category: MedicineCategory;
    notes?: string;
  }) => {
    setPrefillForSave(prefill);
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSavedNewMedicine = (newItem: MedicineItem) => {
    refreshCabinet();
    // Keep user on the page or let them explore
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'scanner') {
            setIsScannerOpen(true);
          } else {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        stats={stats}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 lg:pb-12">
        {activeTab === 'landing' && (
          <LandingHero
            onNavigate={(tab) => {
              if (tab === 'scanner') {
                setIsScannerOpen(true);
              } else {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            stats={stats}
          />
        )}

        {activeTab === 'scan' && (
          <ScanIdentify
            onTransferToCard={handleTransferToSave}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        )}

        {activeTab === 'add' && (
          <SaveMedicineCard
            prefillData={prefillForSave}
            onSaved={handleSavedNewMedicine}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenStickerSheet={(item) => setSelectedStickerItem(item)}
          />
        )}

        {activeTab === 'dashboard' && (
          <ExpiryDashboard
            medicines={medicines}
            onRefresh={refreshCabinet}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenQrModal={(item) => setSelectedQrItem(item)}
            onOpenStickerSheet={(item) => setSelectedStickerItem(item)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-xs">
              M
            </div>
            <span className="font-extrabold text-slate-800">MediQR</span>
            <span className="text-slate-300">|</span>
            <span>Every tablet knows its expiry</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span>Built by</span>
            <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Team Paradox
            </span>
            <span>for Healthcare Hackathon</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Phase 1 Prototype • Offline-Ready QR System
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QRModal
        item={selectedQrItem}
        isOpen={Boolean(selectedQrItem)}
        onClose={() => setSelectedQrItem(null)}
        onOpenStickerSheet={(item) => {
          setSelectedQrItem(null);
          setSelectedStickerItem(item);
        }}
      />

      <BlisterStickerSheet
        item={selectedStickerItem}
        isOpen={Boolean(selectedStickerItem)}
        onClose={() => setSelectedStickerItem(null)}
      />

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onMedicineUpdated={refreshCabinet}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={() => setHasApiKey(Boolean(getStoredApiKey()))}
      />

    </div>
  );
};
export default App;
