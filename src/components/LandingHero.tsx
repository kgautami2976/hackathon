import React from 'react';
import { 
  ShieldCheck, 
  Camera, 
  QrCode, 
  LayoutDashboard, 
  ArrowRight, 
  Sparkles, 
  Users, 
  HeartHandshake, 
  Home, 
  Building2, 
  Stethoscope, 
  WifiOff, 
  CheckCircle, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { CutStripDemoInteractive } from './CutStripDemoInteractive';
import { ActiveTab } from './Navbar';
import { CabinetStats } from '../types/medicine';

interface LandingHeroProps {
  onNavigate: (tab: ActiveTab) => void;
  stats: CabinetStats;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate, stats }) => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white px-6 py-12 sm:py-16 sm:px-12 shadow-2xl">
        {/* Abstract Background Shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Team / Hackathon Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-bold tracking-wide uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Team Paradox presents</span>
            <span className="text-teal-400">•</span>
            <span>Healthcare Demo MVP</span>
          </div>

          {/* Main Slogan & Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Medi<span className="text-teal-400">QR</span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-teal-100 tracking-tight">
              EVERY TABLET KNOWS ITS EXPIRY.
            </p>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              A tablet-level QR system for medicine safety. When tablets are cut from blister strips, they lose their expiry date. MediQR makes every individual dose traceable, verifiable, and safe.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('scan')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-teal-400/20 transition-all hover:scale-105 active:scale-95"
            >
              <Camera className="w-5 h-5 text-slate-950" />
              <span>1. Scan Cut Strip (OCR)</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
            >
              <LayoutDashboard className="w-5 h-5 text-teal-300" />
              <span>Safety Cabinet ({stats.total})</span>
            </button>

            <button
              onClick={() => onNavigate('scanner')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-teal-600/60 hover:bg-teal-500/60 text-white font-bold text-sm sm:text-base border border-teal-400/40 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
            >
              <QrCode className="w-5 h-5" />
              <span>Verify QR Code</span>
            </button>
          </div>

          {/* Key Value Highlights */}
          <div className="pt-6 border-t border-teal-700/50 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Per-Tablet Granularity</span>
            </div>
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-teal-300" />
              <span>Works 100% Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Zero New Edible Ink Approvals</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Demonstration Section */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600">
            The Blister Strip Dilemma
          </h2>
          <p className="text-2xl font-black text-slate-900">
            What Happens When A Strip Is Cut?
          </p>
          <p className="text-xs sm:text-sm text-slate-600">
            Try the interactive simulator below to see why conventional medicine packaging fails at the tablet level.
          </p>
        </div>

        <CutStripDemoInteractive />
      </section>

      {/* 3 Core Features Walkthrough */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Demo Capabilities
          </h2>
          <p className="text-2xl font-black text-slate-900">
            3 Simple Pillars of MediQR
          </p>
          <p className="text-xs sm:text-sm text-slate-600">
            Built for immediate ease of use: Identify cut strips, generate tablet QR cards, and monitor expiry countdowns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Scan & Identify */}
          <div 
            onClick={() => onNavigate('scan')}
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-400 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                Feature 1
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                📷 Scan & Identify (OCR)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take a photo or choose a sample blister strip. Powered by Google Gemini Vision OCR. If the expiry date was cut off, it alerts: <strong>“Expiry Not Found”</strong>.
              </p>
            </div>
            
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
              <span>Test OCR Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Save Medicine Card & QR */}
          <div 
            onClick={() => onNavigate('add')}
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-400 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Feature 2
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                💊 Save Card & Generate QR
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Save medicine name, expiry date, dosage notes, and quantity. Instantly generates a unique self-contained QR code and <strong>printable mini blister stickers</strong>.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Create Medicine QR</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Expiry Safety Dashboard */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-400 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Feature 3
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                🚦 Expiry Safety Dashboard
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live color-coded status badges: <strong>SAFE (🟢)</strong>, <strong>EXPIRING SOON (🟡)</strong>, and <strong>EXPIRED (🔴)</strong> with live countdowns like <em>“Expires in 24 days”</em>.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>View Safety Cabinet</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* Who It Helps Section (Slide 3) */}
      <section className="bg-slate-100/80 rounded-3xl p-6 sm:p-10 border border-slate-200/80 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Impact & Reach
          </h2>
          <p className="text-2xl font-black text-slate-900">
            Who MediQR Protects
          </p>
          <p className="text-xs text-slate-600">
            Designed for vulnerable populations, families, and everyday households.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm hover:shadow transition-shadow">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center mb-2">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Elderly Patients</h4>
            <p className="text-[11px] text-slate-500 mt-1">Check medicines with confidence & large text</p>
          </div>

          <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm hover:shadow transition-shadow">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center mb-2">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Caregivers</h4>
            <p className="text-[11px] text-slate-500 mt-1">Ensure correct use & dosage for loved ones</p>
          </div>

          <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm hover:shadow transition-shadow">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center mb-2">
              <Home className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Home Cabinets</h4>
            <p className="text-[11px] text-slate-500 mt-1">Stay on top of what is safe to use, reduce waste</p>
          </div>

          <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm hover:shadow transition-shadow">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center mb-2">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Rural Clinics</h4>
            <p className="text-[11px] text-slate-500 mt-1">Offline-capable checks with limited resources</p>
          </div>

          <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm hover:shadow transition-shadow col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center mb-2">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Pharmacies</h4>
            <p className="text-[11px] text-slate-500 mt-1">Dispense partial strips with verified labels</p>
          </div>
        </div>
      </section>

      {/* Uniqueness Table Section (Slide 5) */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold">MediQR vs Conventional Packaging</h3>
            <p className="text-xs text-slate-300">Why tablet-level identification stands apart</p>
          </div>
          <span className="text-xs font-mono bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2.5 py-1 rounded">
            Competitive Advantage
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Dimension</th>
                <th className="py-3 px-4 text-slate-500">Current Industry Standard</th>
                <th className="py-3 px-4 text-teal-700 bg-teal-50/50 font-black">MediQR Solution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">Granularity</td>
                <td className="py-3 px-4 text-slate-600">Expiry stamped only on outer carton or strip edge</td>
                <td className="py-3 px-4 font-bold text-teal-700 bg-teal-50/30">
                  Per-tablet 2D code directly on the blister cell foil
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">Offline Usability</td>
                <td className="py-3 px-4 text-slate-600">Requires central cloud database & active internet</td>
                <td className="py-3 px-4 font-bold text-teal-700 bg-teal-50/30">
                  Works 100% offline — all critical data is inside the QR payload
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">Regulatory Impact</td>
                <td className="py-3 px-4 text-slate-600">Direct pill stamping requires complex edible ink approvals</td>
                <td className="py-3 px-4 font-bold text-teal-700 bg-teal-50/30">
                  Foil-backed laser/thermal marking — zero ingestible ink hurdles
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">Home Cabinet Reminders</td>
                <td className="py-3 px-4 text-slate-600">No integrated home tracking or expiry warnings</td>
                <td className="py-3 px-4 font-bold text-teal-700 bg-teal-50/30">
                  Automatic countdown badges (Safe / Expiring Soon / Expired)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
