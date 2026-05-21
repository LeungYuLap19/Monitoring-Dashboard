export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  return /^[0-9+()-\s]{6,15}$/.test(phone.trim());
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getFromLocalStorage<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key);
  if (saved) {
    try { return JSON.parse(saved); } catch { return fallback; }
  }
  return fallback;
}

export function setToLocalStorage(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}
