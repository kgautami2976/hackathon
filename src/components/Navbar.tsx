import React from 'react';
import { 
  ShieldCheck, 
  Camera, 
  PlusCircle, 
  LayoutDashboard, 
  QrCode, 
  Key, 
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { CabinetStats } from '../types/medicine';

export type ActiveTab = 'landing' | 'dashboard' | 'scan' | 'add' | 'scanner';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: CabinetStats;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onOpenApiKeyModal,
  hasApiKey,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="relative">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-white rounded-full"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  Medi<span className="text-teal-600">QR</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-teal-50 text-teal-700 border border-teal-200/60">
                  Team Paradox
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block leading-none">
                Every tablet knows its expiry
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'landing'
                  ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200/80 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              Demo & Story
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === 'dashboard'
                  ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200/80 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-600" />
              Safety Cabinet
              {stats.expired > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white animate-pulse">
                  {stats.expired} Expired
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'scan'
                  ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200/80 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Camera className="w-4 h-4 text-teal-600" />
              1. Scan & Identify (OCR)
            </button>

            <button
              onClick={() => setActiveTab('add')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'add'
                  ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200/80 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-teal-600" />
              2. Save Medicine Card
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/30'
                  : 'text-teal-700 bg-teal-50 hover:bg-teal-100/80 border border-teal-200'
              }`}
            >
              <QrCode className="w-4 h-4" />
              Verify QR Code
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Status Pill */}
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-200 transition-colors"
              title="Click to view cabinet breakdown"
            >
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {stats.safe} Safe
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {stats.expiringSoon} Expiring
              </span>
              {stats.expired > 0 && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1 text-rose-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    {stats.expired} Expired
                  </span>
                </>
              )}
            </div>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                hasApiKey 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Configure Google Gemini Free Tier API Key"
            >
              <Key className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Gemini API:</span>
              <span>{hasApiKey ? 'Connected' : 'Free Demo'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Mobile-First UX) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1">
        <div className="grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[11px] font-medium transition-colors ${
              activeTab === 'landing' ? 'text-teal-700 font-bold' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span>Story</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[11px] font-medium relative transition-colors ${
              activeTab === 'dashboard' ? 'text-teal-700 font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Cabinet</span>
            {stats.expired > 0 && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scan')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[11px] font-medium transition-colors ${
              activeTab === 'scan' ? 'text-teal-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Camera className="w-5 h-5 mb-0.5" />
            <span>OCR Scan</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[11px] font-medium transition-colors ${
              activeTab === 'add' ? 'text-teal-700 font-bold' : 'text-slate-500'
            }`}
          >
            <PlusCircle className="w-5 h-5 mb-0.5" />
            <span>Add Card</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[11px] font-medium transition-colors ${
              activeTab === 'scanner' ? 'text-teal-700 font-bold' : 'text-slate-500'
            }`}
          >
            <QrCode className="w-5 h-5 mb-0.5 text-teal-600" />
            <span>Scan QR</span>
          </button>
        </div>
      </div>
    </header>
  );
};
