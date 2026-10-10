import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  X, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Pill, 
  Zap, 
  ShieldCheck, 
  Minus, 
  Plus,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { MedicineItem, ExpiryStatus } from '../types/medicine';
import { parseScannedQr, MediQRPayload, buildQrPayload } from '../utils/qrUtils';
import { getDaysRemaining, getExpiryStatus, formatCountdown, formatDate, playSafetyChime } from '../utils/dateUtils';
import { getMedicines, updateMedicine, addMedicine } from '../services/storageService';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMedicineUpdated: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onMedicineUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'demo'>('camera');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);
  
  // Decoded Result
  const [scannedData, setScannedData] = useState<MediQRPayload | null>(null);
  const [matchedCabinetItem, setMatchedCabinetItem] = useState<MedicineItem | null>(null);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const readerId = 'mediqr-html5-camera-view';

  // Available medicines for instant demo simulation
  const cabinetMedicines = getMedicines();

  // Reset states on open/close
  useEffect(() => {
    if (isOpen) {
      setScannedData(null);
      setMatchedCabinetItem(null);
      setScanError(null);
      if (activeTab === 'camera') {
        startCameraScanner();
      }
    } else {
      stopCameraScanner();
    }

    return () => {
      stopCameraScanner();
    };
  }, [isOpen, activeTab]);

  const startCameraScanner = async () => {
    try {
      setScanError(null);
      setIsScanning(true);

      // Clean up previous instance
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch {
          // ignore
        }
      }

      const qrScanner = new Html5Qrcode(readerId);
      html5QrCodeRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleSuccessfulScan(decodedText);
        },
        () => {
          // Scanning frame callback, ignore frame misses
        }
      );
    } catch (err: unknown) {
      console.warn('Camera scanner initialization error', err);
      setIsScanning(false);
      setScanError('Camera access unavailable or busy. You can upload a QR image or click a quick demo QR below.');
    }
  };

  const stopCameraScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch {
        // ignore
      }
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  const handleSuccessfulScan = async (decodedText: string) => {
    stopCameraScanner();
    
    const parsed = parseScannedQr(decodedText);
    if (!parsed) {
      setScanError('Scanned QR code did not match a valid MediQR payload.');
      return;
    }

    setScannedData(parsed);

    // Look for a match in local cabinet
    const existing = cabinetMedicines.find(
      (m) => m.id === parsed.id || (m.name.toLowerCase() === parsed.name.toLowerCase() && m.batchNumber === parsed.batch)
    );

    if (existing) {
      setMatchedCabinetItem(existing);
    }

    // Play safety chime
    const status = getExpiryStatus(parsed.exp);
    playSafetyChime(status);
  };

  // Upload QR image file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setScanError(null);
      const qrScanner = new Html5Qrcode('mediqr-temp-file-reader');
      const decodedText = await qrScanner.scanFile(file, true);
      handleSuccessfulScan(decodedText);
      await qrScanner.clear();
    } catch (err) {
      console.error('File QR scan error', err);
      setScanError('Could not decode a QR code from this image. Please ensure the code is clear and well lit.');
    }
  };

  // Quick Demo Simulator Scan
  const handleQuickDemoScan = (med: MedicineItem) => {
    const payloadText = buildQrPayload(med);
    handleSuccessfulScan(payloadText);
  };

  // Dose Taken: Decrement quantity
  const handleTakeDose = () => {
    if (matchedCabinetItem) {
      const nextQty = Math.max(0, matchedCabinetItem.quantity - 1);
      updateMedicine(matchedCabinetItem.id, { quantity: nextQty });
      setMatchedCabinetItem({ ...matchedCabinetItem, quantity: nextQty });
      onMedicineUpdated();
    }
  };

  if (!isOpen) return null;

  const currentStatus = scannedData ? getExpiryStatus(scannedData.exp) : null;
  const countdown = scannedData ? formatCountdown(scannedData.exp) : null;
  const daysLeft = scannedData ? getDaysRemaining(scannedData.exp) : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-fadeIn">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-extrabold">MediQR Tablet Scanner</h3>
              <p className="text-[11px] text-slate-300">Scan any blister-cell code to verify safety</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Mode Tabs (Camera, Upload, Demo) */}
        {!scannedData && (
          <div className="bg-slate-100 p-1 grid grid-cols-3 gap-1 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('camera')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'camera'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Camera
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload QR
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'demo'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quick Demo
            </button>
          </div>
        )}

        <div className="p-6">
          
          {/* DECODED SCAN RESULT SCREEN (Matching Slide 3, 4, 7) */}
          {scannedData ? (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Giant Safety Status Banner */}
              <div className={`p-4 sm:p-5 rounded-2xl border-2 shadow-sm ${
                currentStatus === 'safe'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : currentStatus === 'expiring_soon'
                  ? 'bg-amber-50 border-amber-400 text-amber-950'
                  : 'bg-rose-50 border-rose-400 text-rose-950'
              }`}>
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-md ${
                    currentStatus === 'safe'
                      ? 'bg-emerald-600 shadow-emerald-600/30'
                      : currentStatus === 'expiring_soon'
                      ? 'bg-amber-500 shadow-amber-500/30'
                      : 'bg-rose-600 shadow-rose-600/30'
                  }`}>
                    {currentStatus === 'safe' ? (
                      <CheckCircle2 className="w-7 h-7 stroke-[2.3]" />
                    ) : (
                      <AlertTriangle className="w-7 h-7 stroke-[2.3]" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black tracking-tight">
                        {currentStatus === 'safe' && 'STATUS: SAFE TO USE'}
                        {currentStatus === 'expiring_soon' && 'STATUS: EXPIRING SOON'}
                        {currentStatus === 'expired' && 'STATUS: EXPIRED'}
                      </span>
                    </div>

                    <div className="text-sm font-extrabold">
                      {countdown?.text}
                    </div>

                    <div className="text-xs opacity-90">
                      {currentStatus === 'safe' && 'This tablet is within its safe consumption window.'}
                      {currentStatus === 'expiring_soon' && 'Use this medication soon. Check with a healthcare provider if needed.'}
                      {currentStatus === 'expired' && '🚨 DO NOT CONSUME. Safely discard this medication.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medicine Breakdown Details */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Drug Identification
                    </span>
                    <span className="text-base font-black text-slate-900 block">
                      {scannedData.name}
                    </span>
                  </div>
                  {scannedData.dosage && (
                    <span className="text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                      {scannedData.dosage}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Batch / Lot:</span>
                    <span className="font-mono font-bold text-slate-800">{scannedData.batch}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Expiry Date:</span>
                    <span className="font-bold text-slate-900">{formatDate(scannedData.exp)}</span>
                  </div>
                </div>

                {scannedData.notes && (
                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-600 block text-[10px] uppercase">Instructions:</span>
                    {scannedData.notes}
                  </div>
                )}
              </div>

              {/* Cabinet match & Action buttons */}
              {matchedCabinetItem && (
                <div className="bg-teal-50 rounded-xl p-3 border border-teal-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-teal-900 block">Tracked in your Home Cabinet</span>
                    <span className="text-teal-700 text-[11px]">{matchedCabinetItem.quantity} tablets remaining</span>
                  </div>

                  <button
                    onClick={handleTakeDose}
                    disabled={matchedCabinetItem.quantity <= 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Take 1 Dose</span>
                  </button>
                </div>
              )}

              {/* Scan Another Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setScannedData(null);
                    setMatchedCabinetItem(null);
                    if (activeTab === 'camera') startCameraScanner();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Scan Another Tablet</span>
                </button>
              </div>

            </div>
          ) : (
            /* SCANNER MODES */
            <div className="space-y-4">
              
              {/* Tab 1: Live Camera View */}
              {activeTab === 'camera' && (
                <div className="space-y-3">
                  <div className="relative aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-black border-2 border-slate-800 flex items-center justify-center">
                    <div id={readerId} className="w-full h-full"></div>
                  </div>
                  <p className="text-center text-xs text-slate-500">
                    Point your camera at a MediQR tablet code. Data decodes instantly offline.
                  </p>
                </div>
              )}

              {/* Tab 2: Upload QR Image */}
              {activeTab === 'upload' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Upload QR Image</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                      Select a saved photo or screenshot containing a MediQR code
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div id="mediqr-temp-file-reader" className="hidden"></div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/20"
                  >
                    Select QR Image File
                  </button>
                </div>
              )}

              {/* Tab 3: Quick Demo Simulation */}
              {activeTab === 'demo' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 mb-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Quick Hackathon Simulator (1-Click Test)</span>
                  </div>

                  <div className="space-y-2">
                    {cabinetMedicines.slice(0, 4).map((med) => {
                      const s = getExpiryStatus(med.expiryDate);
                      return (
                        <button
                          key={med.id}
                          onClick={() => handleQuickDemoScan(med)}
                          className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-extrabold text-slate-900">
                              {med.name} ({med.dosage})
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Batch: {med.batchNumber} • Exp: {formatDate(med.expiryDate)}
                            </div>
                          </div>

                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            s === 'safe'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : s === 'expiring_soon'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}>
                            {s === 'safe' && 'Safe'}
                            {s === 'expiring_soon' && 'Expiring Soon'}
                            {s === 'expired' && 'Expired'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {scanError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>{scanError}</p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
