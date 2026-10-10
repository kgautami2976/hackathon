import React, { useEffect, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Pill, 
  ExternalLink 
} from 'lucide-react';
import { MedicineItem } from '../types/medicine';
import { generateQrDataUrl, buildQrPayload } from '../utils/qrUtils';
import { getExpiryStatus, getDaysRemaining, formatDate } from '../utils/dateUtils';

interface QRModalProps {
  item: MedicineItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStickerSheet: (item: MedicineItem) => void;
}

export const QRModal: React.FC<QRModalProps> = ({
  item,
  isOpen,
  onClose,
  onOpenStickerSheet,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!item) return;
    const generate = async () => {
      try {
        const payload = buildQrPayload(item);
        const url = await generateQrDataUrl(payload, { width: 320 });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Failed to generate modal QR', err);
      }
    };
    generate();
  }, [item]);

  if (!isOpen || !item) return null;

  const status = getExpiryStatus(item.expiryDate);
  const daysLeft = getDaysRemaining(item.expiryDate);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `mediqr-${item.name.toLowerCase().replace(/\s+/g, '-')}-${item.batchNumber}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-400" />
              MediQR Identity Card
            </h3>
            <p className="text-[11px] text-slate-300">Offline tablet-level 2D code</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-center">
          
          {/* Status Badge */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-left ${
            status === 'safe'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : status === 'expiring_soon'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <div className="flex items-center gap-2">
              {status === 'safe' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              )}
              <div>
                <div className="text-xs font-black uppercase tracking-wider">
                  {status === 'safe' && 'SAFE MEDICATION'}
                  {status === 'expiring_soon' && 'EXPIRING SOON'}
                  {status === 'expired' && 'EXPIRED — DO NOT USE'}
                </div>
                <div className="text-[11px] font-bold">
                  {daysLeft >= 0 ? `Expires in ${daysLeft} days` : `Expired ${Math.abs(daysLeft)} days ago`}
                </div>
              </div>
            </div>
            <span className="font-mono text-xs font-bold">
              {formatDate(item.expiryDate)}
            </span>
          </div>

          {/* QR Code Graphic */}
          <div className="inline-block p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-inner">
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="w-52 h-52 mx-auto"
              />
            )}
            <div className="mt-2 text-center">
              <span className="font-black text-sm text-slate-900 block truncate">
                {item.name} {item.dosage && `(${item.dosage})`}
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Batch: {item.batchNumber}
              </span>
            </div>
          </div>

          {/* Detail specs */}
          <div className="bg-slate-50 rounded-xl p-3 text-xs text-left text-slate-700 space-y-1.5 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-semibold">{item.category}</span>
            </div>
            {item.dosageNotes && (
              <div className="flex justify-between">
                <span className="text-slate-500">Instructions:</span>
                <span className="font-semibold text-right max-w-[220px] truncate">{item.dosageNotes}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Remaining Quantity:</span>
              <span className="font-semibold">{item.quantity} {item.unit || 'tablets'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download PNG
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenStickerSheet(item);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-md shadow-teal-600/20"
            >
              <Printer className="w-4 h-4" />
              Print Stickers
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
