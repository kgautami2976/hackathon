import React, { useEffect, useState } from 'react';
import { X, Printer, Info, Check, ShieldCheck } from 'lucide-react';
import { MedicineItem } from '../types/medicine';
import { generateQrDataUrl, buildQrPayload } from '../utils/qrUtils';
import { formatDate } from '../utils/dateUtils';

interface BlisterStickerSheetProps {
  item: MedicineItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BlisterStickerSheet: React.FC<BlisterStickerSheetProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [stickerCount, setStickerCount] = useState<number>(10);

  useEffect(() => {
    if (!item) return;
    const generate = async () => {
      try {
        const payload = buildQrPayload(item);
        const url = await generateQrDataUrl(payload, { width: 140, margin: 0 });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Failed to generate sticker QR', err);
      }
    };
    generate();
  }, [item]);

  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-extrabold">
                Blister-Cell Sticker Sheet (Phase 1 Prototype)
              </h3>
              <p className="text-[11px] text-teal-200">
                10mm × 10mm micro QR labels sized for individual blister cells
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-300 hover:text-white hover:bg-teal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-teal-50 px-6 py-3 border-b border-teal-100 flex items-center justify-between text-xs text-teal-950">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Stick one mini QR code onto each tablet blister foil to prevent expiry confusion when cut.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">Count:</span>
            <select
              value={stickerCount}
              onChange={(e) => setStickerCount(Number(e.target.value))}
              className="bg-white border border-teal-300 rounded px-2 py-0.5 text-xs font-bold"
            >
              <option value={6}>6 stickers</option>
              <option value={10}>10 stickers</option>
              <option value={15}>15 stickers</option>
              <option value={20}>20 stickers</option>
            </select>
          </div>
        </div>

        {/* Printable Sheet Area */}
        <div className="p-6 bg-slate-100/60" id="printable-sticker-area">
          <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
            
            {/* Sheet Title for Print */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300 mb-4">
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase">
                MediQR Tablet Sticker Labels • {item.name} {item.dosage && `(${item.dosage})`}
              </span>
              <div className="text-[10px] text-slate-500 font-mono">
                Lot: {item.batchNumber} | Expiry: {formatDate(item.expiryDate)}
              </div>
            </div>

            {/* Grid of Micro Stickers */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Array.from({ length: stickerCount }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-2 border-2 border-dashed border-teal-400/80 flex flex-col items-center justify-center text-center shadow-sm relative group hover:border-teal-600 transition-colors"
                  style={{ minHeight: '90px' }}
                >
                  {/* Micro Sticker Header */}
                  <div className="text-[8px] font-black text-slate-900 uppercase tracking-tighter truncate w-full">
                    {item.name.substring(0, 12)}
                  </div>

                  {/* QR Image */}
                  {qrDataUrl && (
                    <img
                      src={qrDataUrl}
                      alt="Micro QR"
                      className="w-12 h-12 my-1"
                    />
                  )}

                  {/* Expiry line */}
                  <div className="text-[8px] font-mono font-bold text-teal-800 leading-none">
                    EXP: {item.expiryDate.substring(2)}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sticker Sheet</span>
          </button>
        </div>

      </div>
    </div>
  );
};
