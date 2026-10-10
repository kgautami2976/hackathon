import React, { useState } from 'react';
import { Scissors, RefreshCw, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';

export const CutStripDemoInteractive: React.FC = () => {
  const [isCut, setIsCut] = useState(false);
  const [activeCell, setActiveCell] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-teal-800/40 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 mb-2">
              <span>Interactive Demonstration</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Why Tablets Need MediQR
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              Click the scissors button to simulate cutting a blister strip into individual doses.
            </p>
          </div>

          <button
            onClick={() => {
              setIsCut(!isCut);
              setActiveCell(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
              isCut 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/30'
            }`}
          >
            {isCut ? (
              <>
                <RefreshCw className="w-4 h-4" /> Reset Full Strip
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4 animate-bounce" /> Cut The Blister Strip
              </>
            )}
          </button>
        </div>

        {/* The Blister Strip Graphic Container */}
        <div className="bg-slate-800/90 rounded-xl p-4 sm:p-6 border border-slate-700 relative">
          
          {/* Header indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <span>Leftover Cell 1 to 4</span>
            <span className="font-semibold text-teal-400">
              {isCut ? '✂️ Strip cut into separated tablets!' : 'Full 10-Tablet Strip (Uncut)'}
            </span>
            <span>Cell 5 to 8 + Margin</span>
          </div>

          {/* Grid of tablet cells */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative">
            
            {/* Cut line overlay if not cut yet */}
            {!isCut && (
              <div className="hidden sm:flex absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 border-r-2 border-dashed border-rose-400/80 z-20 items-center justify-center pointer-events-none">
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow -rotate-90">
                  Cut Line
                </span>
              </div>
            )}

            {/* Tablet Cells 1 to 4 (The cut piece separated from the margin) */}
            {[1, 2, 3, 4].map((cellNum) => (
              <div
                key={cellNum}
                onClick={() => setActiveCell(cellNum)}
                className={`relative rounded-xl p-3 border cursor-pointer transition-all ${
                  isCut
                    ? 'bg-slate-900/90 border-amber-500/50 shadow-md shadow-amber-500/10 hover:border-amber-400'
                    : 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
                } ${activeCell === cellNum ? 'ring-2 ring-teal-400' : ''}`}
              >
                {/* Simulated Foil Blister Cell */}
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-b from-slate-200 to-slate-400 flex items-center justify-center shadow-inner border border-slate-400/80 mb-2 relative">
                  <div className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-[10px] font-extrabold text-slate-600">
                    Tab {cellNum}
                  </div>
                  
                  {/* MediQR micro sticker on the foil */}
                  <div className="absolute -bottom-1 -right-1 bg-teal-500 text-slate-950 font-black text-[8px] px-1 py-0.2 rounded border border-white shadow">
                    QR
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[11px] font-bold text-slate-200 truncate">Paracetamol 500</div>
                  <div className="text-[10px] text-slate-400">Single blister</div>
                  
                  {/* Status when cut */}
                  {isCut ? (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800">
                      <span className="inline-flex items-center text-[10px] font-bold text-amber-400">
                        <AlertOctagon className="w-3 h-3 mr-0.5 inline" /> Expiry Lost!
                      </span>
                    </div>
                  ) : (
                    <div className="mt-1 text-[9px] text-slate-500">Connected to pack</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Foil Margin where the expiry was originally stamped */}
          <div className={`mt-4 p-3 rounded-lg border transition-all ${
            isCut
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : 'bg-slate-900/80 border-slate-700 text-slate-300'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono px-2 py-0.5 rounded bg-black/40 border border-slate-600 font-bold text-[11px]">
                  FOIL MARGIN: B.No. PCT231045 | EXP. DATE: 11/2026
                </span>
              </div>
              <div className="text-[11px]">
                {isCut ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Discarded or lost outer edge! Cut tablets have no date!
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Expiry is stamped only on this far edge.
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Explanation callout */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              The Real-World Risk
            </h4>
            <p className="text-xs text-rose-100/90 mt-1 leading-relaxed">
              When pills are cut from a strip to fit a handbag or travel kit, the expiry date is left behind on the outer edge. Patients are left guessing: <em>"Is this medicine still safe?"</em>
            </p>
          </div>

          <div className="bg-teal-950/40 border border-teal-700/50 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              The MediQR Solution
            </h4>
            <p className="text-xs text-teal-100/90 mt-1 leading-relaxed">
              By printing or sticking a mini 2D QR code on <strong>every individual tablet cell</strong>, scanning any single pill instantly recovers drug name, batch number, and verified expiry countdown!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
