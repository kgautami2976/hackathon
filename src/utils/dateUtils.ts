import { ExpiryStatus } from '../types/medicine';

/**
 * Calculates remaining days from today until target expiry date.
 * Assumes expiry is at end of that date.
 */
export function getDaysRemaining(expiryDateStr: string): number {
  if (!expiryDateStr) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse YYYY-MM-DD or YYYY-MM
  const parts = expiryDateStr.split('-');
  let targetYear = parseInt(parts[0], 10);
  let targetMonth = parseInt(parts[1], 10) - 1; // 0-indexed
  let targetDay = parts[2] ? parseInt(parts[2], 10) : 28; // default to late in month if only YYYY-MM

  const targetDate = new Date(targetYear, targetMonth, targetDay);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Categorize into SAFE, EXPIRING_SOON, or EXPIRED.
 * Threshold: <= 0 is EXPIRED, <= 30 is EXPIRING_SOON, > 30 is SAFE.
 */
export function getExpiryStatus(expiryDateStr: string): ExpiryStatus {
  const days = getDaysRemaining(expiryDateStr);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring_soon';
  return 'safe';
}

/**
 * Format human-readable countdown string.
 * e.g., "Expires in 24 days", "Expires in ~8 months", "Expired 12 days ago"
 */
export function formatCountdown(expiryDateStr: string): { text: string; subtext?: string; isUrgent: boolean } {
  const days = getDaysRemaining(expiryDateStr);
  
  if (days < 0) {
    const absDays = Math.abs(days);
    return {
      text: absDays === 1 ? 'Expired yesterday' : `Expired ${absDays} days ago`,
      subtext: 'DO NOT CONSUME',
      isUrgent: true,
    };
  }

  if (days === 0) {
    return {
      text: 'Expires TODAY',
      subtext: 'Immediate attention required',
      isUrgent: true,
    };
  }

  if (days === 1) {
    return {
      text: 'Expires tomorrow',
      subtext: 'Only 1 day left',
      isUrgent: true,
    };
  }

  if (days <= 30) {
    return {
      text: `Expires in ${days} days`,
      subtext: 'Expiring soon',
      isUrgent: true,
    };
  }

  const months = Math.floor(days / 30);
  return {
    text: `Expires in ${days} days`,
    subtext: `~${months} month${months > 1 ? 's' : ''} safe window`,
    isUrgent: false,
  };
}

/**
 * Format standard date to readable string (e.g. "24 May 2026")
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parts[2] ? parseInt(parts[2], 10) : 1;
    const d = new Date(year, month, day);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: parts[2] ? 'numeric' : undefined,
    });
  } catch {
    return dateStr;
  }
}

/**
 * Synthesizes Web Audio feedback beeps for scanner & status check
 */
export function playSafetyChime(status: ExpiryStatus) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (status === 'safe') {
      // Pleasant rising major chord
      const osc1 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.18); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc1.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);
    } else if (status === 'expiring_soon') {
      // Double warning chirp
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.setValueAtTime(587.33, ctx.currentTime + 0.12); // D5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      // Urgent lower buzz for expired
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    }
  } catch {
    // Graceful fallback if audio is not permitted
  }
}
