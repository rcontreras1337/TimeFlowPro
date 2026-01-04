/**
 * Validation utilities
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Chilean phone number
 * Accepts: +56912345678, 56912345678, 912345678
 */
export function isValidChileanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');

  // Full format with country code: 56912345678 (11 digits)
  if (cleaned.length === 11) {
    return cleaned.startsWith('569');
  }

  // Without country code: 912345678 (9 digits starting with 9)
  if (cleaned.length === 9) {
    return cleaned.startsWith('9');
  }

  return false;
}

/**
 * Validate RUT (Chilean ID)
 */
export function isValidRut(rut: string): boolean {
  // Remove dots and dashes
  const cleaned = rut.replace(/\./g, '').replace(/-/g, '');

  if (cleaned.length < 2) return false;

  const body = cleaned.slice(0, -1);
  const verifier = cleaned.slice(-1).toUpperCase();

  // Calculate verification digit
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i] ?? '0', 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedVerifier = 11 - (sum % 11);
  let expectedChar: string;

  if (expectedVerifier === 11) expectedChar = '0';
  else if (expectedVerifier === 10) expectedChar = 'K';
  else expectedChar = expectedVerifier.toString();

  return verifier === expectedChar;
}

/**
 * Validate time format (HH:MM)
 */
export function isValidTime(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

/**
 * Check if end time is after start time
 */
export function isEndAfterStart(startTime: string, endTime: string): boolean {
  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    return false;
  }

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startMinutes = (startHour ?? 0) * 60 + (startMin ?? 0);
  const endMinutes = (endHour ?? 0) * 60 + (endMin ?? 0);

  return endMinutes > startMinutes;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

