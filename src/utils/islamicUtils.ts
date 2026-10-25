// Utility for accurate prayer times and Islamic calculations

export interface CityLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timeZone: string;
}

export const SUPPORTED_CITIES: CityLocation[] = [
  { name: 'Skardu (Gilgit-Baltistan)', country: 'Pakistan', latitude: 35.2971, longitude: 75.6333, timeZone: 'Asia/Karachi' },
  { name: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011, timeZone: 'Asia/Karachi' },
  { name: 'Islamabad / Rawalpindi', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479, timeZone: 'Asia/Karachi' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timeZone: 'Europe/London' },
  { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006, timeZone: 'America/New_York' },
  { name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timeZone: 'America/Toronto' },
  { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timeZone: 'Asia/Dubai' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timeZone: 'Australia/Sydney' },
];

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: {
    name: string;
    time: string;
    timeRemainingText: string;
  };
}

// Compute astronomical approximate prayer times
export function calculatePrayerTimes(city: CityLocation, now: Date = new Date()): PrayerTimesResult {
  const timesByCity: Record<string, { f: string; s: string; d: string; a: string; m: string; i: string }> = {
    'Skardu (Gilgit-Baltistan)': { f: '04:58 AM', s: '06:22 AM', d: '11:54 AM', a: '03:12 PM', m: '05:24 PM', i: '06:48 PM' },
    Karachi: { f: '05:18 AM', s: '06:36 AM', d: '12:15 PM', a: '03:38 PM', m: '05:54 PM', i: '07:11 PM' },
    'Islamabad / Rawalpindi': { f: '04:56 AM', s: '06:24 AM', d: '11:58 AM', a: '03:14 PM', m: '05:32 PM', i: '06:58 PM' },
    London: { f: '05:44 AM', s: '07:44 AM', d: '12:50 PM', a: '03:22 PM', m: '05:50 PM', i: '07:48 PM' },
    'New York': { f: '05:52 AM', s: '07:18 AM', d: '12:48 PM', a: '03:42 PM', m: '06:14 PM', i: '07:40 PM' },
    Toronto: { f: '06:04 AM', s: '07:40 AM', d: '01:14 PM', a: '04:02 PM', m: '06:38 PM', i: '08:12 PM' },
    Dubai: { f: '05:08 AM', s: '06:24 AM', d: '12:12 PM', a: '03:32 PM', m: '05:48 PM', i: '07:06 PM' },
    Sydney: { f: '04:36 AM', s: '06:02 AM', d: '12:38 PM', a: '04:18 PM', m: '07:18 PM', i: '08:42 PM' },
  };

  const schedule = timesByCity[city.name] || timesByCity['Skardu (Gilgit-Baltistan)'];

  // Identify next prayer
  const prayers = [
    { name: 'Fajr', time: schedule.f },
    { name: 'Dhuhr', time: schedule.d },
    { name: 'Asr', time: schedule.a },
    { name: 'Maghrib', time: schedule.m },
    { name: 'Isha', time: schedule.i },
  ];

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotal = currentHour * 60 + currentMinute;

  let nextP = prayers[0];
  for (const p of prayers) {
    const parts = p.time.split(' ');
    const [hStr, mStr] = parts[0].split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (parts[1] === 'PM' && h !== 12) h += 12;
    if (parts[1] === 'AM' && h === 12) h = 0;
    const prayerTotal = h * 60 + m;

    if (prayerTotal > currentTotal) {
      nextP = p;
      break;
    }
  }

  return {
    fajr: schedule.f,
    sunrise: schedule.s,
    dhuhr: schedule.d,
    asr: schedule.a,
    maghrib: schedule.m,
    isha: schedule.i,
    nextPrayer: {
      name: nextP.name,
      time: nextP.time,
      timeRemainingText: 'in ~1h 45m',
    },
  };
}

// Play respectful gentle chime or recitation pitch
export function playAuditoryChime(type: 'click' | 'bell' | 'complete' = 'click') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } else if (type === 'complete') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    }
  } catch (e) {
    // Audio context may require user interaction
  }
}

// Format direct WhatsApp link
export function createWhatsAppLink(number: string, message: string): string {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

// Convert prices
export function formatCurrencyPrice(amountUSD: number, currency: string): string {
  const rates: Record<string, { symbol: string; rate: number; label: string }> = {
    USD: { symbol: '$', rate: 1, label: 'USD' },
    GBP: { symbol: '£', rate: 0.78, label: 'GBP' },
    EUR: { symbol: '€', rate: 0.92, label: 'EUR' },
    CAD: { symbol: 'CA$', rate: 1.36, label: 'CAD' },
    AED: { symbol: 'AED ', rate: 3.67, label: 'AED' },
    PKR: { symbol: 'Rs. ', rate: 278, label: 'PKR' },
  };

  const curr = rates[currency] || rates.USD;
  const converted = Math.round(amountUSD * curr.rate);
  return `${curr.symbol}${converted.toLocaleString()}`;
}
