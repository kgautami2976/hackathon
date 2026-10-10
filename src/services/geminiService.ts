import { ScanResult } from '../types/medicine';

const GEMINI_API_KEY_STORAGE = 'mediqr_gemini_api_key';

export function getStoredApiKey(): string {
  return localStorage.getItem(GEMINI_API_KEY_STORAGE) || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function setStoredApiKey(key: string): void {
  if (!key.trim()) {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE);
  } else {
    localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
  }
}

/**
 * Perform OCR & analysis using Google Gemini API (Free Tier: gemini-1.5-flash)
 */
export async function analyzeMedicineImage(
  base64Image: string,
  mimeType: string = 'image/jpeg',
  apiKeyOverride?: string
): Promise<ScanResult> {
  const apiKey = apiKeyOverride || getStoredApiKey();

  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  // Strip prefix if present (e.g. data:image/png;base64,...)
  const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

  const prompt = `
You are a pharmaceutical OCR and tablet packaging verification specialist for MediQR.
Examine this medicine packaging / strip / cut blister image carefully.

Extract and analyze:
1. medicineName: Brand or Generic name (e.g., "Paracetamol", "Augmentin 625 Duo", "Cetirizine").
2. dosage: Strength (e.g. "500 mg", "650 mg", "10 mg").
3. batchNumber: Batch or Lot number if visible (e.g. "B23491"). If not visible, return "Unknown".
4. expiryDate: The expiry date converted to ISO format "YYYY-MM-DD" or "YYYY-MM" if visible.
   IMPORTANT: If the expiry date is CUT OFF, torn, blurred, or missing from this blister cell/strip, set expiryDate to null.
5. expiryFound: true ONLY if the expiration date is clearly visible on this blister/strip. Set false if it is cut off, torn away, or absent.
6. mfgDate: Manufacturing date if visible, otherwise null.
7. category: One of ['Pain Relief / Fever', 'Antibiotics', 'Antihistamines / Allergy', 'Digestive / Antacid', 'Cardiovascular / BP', 'Diabetes', 'Vitamins & Supplements', 'Other'].
8. confidence: "high", "medium", or "low".
9. notes: A concise explanation (1-2 sentences). If expiry is missing, explicitly explain that this is a cut strip and lacks expiry info.

Return ONLY a valid JSON object with these keys. No markdown code blocks, no other text:
{
  "medicineName": string,
  "dosage": string,
  "batchNumber": string,
  "expiryDate": string | null,
  "mfgDate": string | null,
  "expiryFound": boolean,
  "category": string,
  "confidence": "high" | "medium" | "low",
  "notes": string
}
`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: cleanBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      response_mime_type: 'application/json',
    },
  };

  // Use gemini-1.5-flash (fast, highly capable vision OCR, free tier eligible)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorDetail = `Gemini API returned status ${response.status}`;
    try {
      const errObj = JSON.parse(errorText);
      if (errObj.error?.message) {
        errorDetail = errObj.error.message;
      }
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  const data = await response.json();
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error('No content returned from Gemini model');
  }

  // Parse JSON response
  try {
    const parsed = JSON.parse(textOutput);
    return {
      medicineName: parsed.medicineName || 'Unknown Medicine',
      dosage: parsed.dosage || '',
      batchNumber: parsed.batchNumber || 'N/A',
      expiryDate: parsed.expiryFound && parsed.expiryDate ? parsed.expiryDate : null,
      mfgDate: parsed.mfgDate || null,
      expiryFound: Boolean(parsed.expiryFound && parsed.expiryDate),
      confidence: parsed.confidence || 'medium',
      category: parsed.category || 'Other',
      notes: parsed.notes || '',
      rawText: textOutput,
    };
  } catch (parseError) {
    console.error('Failed to parse Gemini JSON output', textOutput, parseError);
    // fallback extraction regex
    return fallbackExtractText(textOutput);
  }
}

function fallbackExtractText(raw: string): ScanResult {
  return {
    medicineName: 'Detected Medicine',
    dosage: 'Standard',
    batchNumber: 'N/A',
    expiryDate: null,
    mfgDate: null,
    expiryFound: false,
    confidence: 'low',
    notes: 'Parsed from freeform OCR output.',
    rawText: raw,
  };
}
