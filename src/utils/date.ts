export function getTodayStr(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function diasRestantes(f?: string | null): number {
  if (!f) return 999;
  const h = new Date();
  h.setHours(0, 0, 0, 0);
  const v = new Date(f + 'T00:00:00');
  v.setHours(0, 0, 0, 0);
  const diffTime = v.getTime() - h.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function addDays(baseDate: string | Date, days: number): string {
  const d = typeof baseDate === 'string' ? new Date(baseDate + 'T00:00:00') : new Date(baseDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function addOneMonth(baseDate?: string): string {
  const d = baseDate ? new Date(baseDate + 'T00:00:00') : new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
}

export function formatFriendlyDate(dateStr?: string): string {
  if (!dateStr) return 'Sin fecha';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthName = months[parseInt(month, 10) - 1] || month;
    return `${parseInt(day, 10)} ${monthName} ${year}`;
  } catch {
    return dateStr;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount);
}
export function calcularDiasAtraso(fechaVenc: string | null): number {
  if (!fechaVenc) return 0;
  const h = new Date(); 
  h.setHours(0, 0, 0, 0);
  const v = new Date(fechaVenc + 'T00:00:00'); 
  v.setHours(0, 0, 0, 0);
  const diff = Math.floor((h.getTime() - v.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function calcularMora(fechaVenc: string | null, moraPorDia = 20): number {
  return calcularDiasAtraso(fechaVenc) * moraPorDia;
}
