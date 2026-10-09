import React, { useState, useEffect } from 'react';
import { Alumno } from '../types';
import { X, CreditCard, Calendar, Check } from 'lucide-react';
import { addDays, getTodayStr, formatFriendlyDate, diasRestantes } from '../utils/date';

interface Props {
  alumno: Alumno | null;
  isOpen: boolean;
  onClose: () => void;
  onCobrar: (data: {
    alumnoId: number;
    monto: number;
    nuevoVencimiento: string;
    concepto: string;
  }) => void;
}

export const CobrarModal: React.FC<Props> = ({ alumno, isOpen, onClose, onCobrar }) => {
  const [monto, setMonto] = useState<number>(0);
  const [nuevoVencimiento, setNuevoVencimiento] = useState<string>('');
  const [concepto, setConcepto] = useState<string>('Mensualidad');

  useEffect(() => {
    if (alumno) {
      setMonto(alumno.montoReal || alumno.monto || 400);
      // If student is severely expired, renew from today + 30 days; otherwise extend from their current expiry
      const dias = diasRestantes(alumno.fecha);
      if (dias < 0) {
        setNuevoVencimiento(addDays(getTodayStr(), 30));
      } else {
        setNuevoVencimiento(addDays(alumno.fecha || getTodayStr(), 30));
      }
      setConcepto(`Mensualidad ${alumno.clase}`);
    }
  }, [alumno]);

  if (!isOpen || !alumno) return null;

  const dias = diasRestantes(alumno.fecha);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monto <= 0) return;
    onCobrar({
      alumnoId: alumno.id,
      monto,
      nuevoVencimiento,
      concepto,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161b] border border-yellow-400/30 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white">COBRAR MENSUALIDAD</h2>
              <p className="text-xs text-gray-400">{alumno.clase}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student card info */}
        <div className="bg-[#1b1e25] rounded-2xl p-3.5 my-4 border border-white/5 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-sm font-black text-white">{alumno.nombre}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                dias < 0
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {dias < 0 ? `Vencido hace ${Math.abs(dias)} días` : `Vence en ${dias} días`}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Vencimiento actual: <span className="text-gray-300 font-medium">{formatFriendlyDate(alumno.fecha)}</span>
          </p>
          {alumno.promoAplicada && (
            <p className="text-[11px] text-yellow-400 font-medium">Promo: {alumno.promoAplicada}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Monto a Cobrar ($ MXN)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input
                type="number"
                min="1"
                required
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl pl-8 pr-3.5 py-3 text-lg font-black text-yellow-400 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Nuevo Vencimiento
              </label>
              <div className="flex gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setNuevoVencimiento(addDays(getTodayStr(), 30))}
                  className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-gray-300"
                >
                  +30d desde hoy
                </button>
                <button
                  type="button"
                  onClick={() => setNuevoVencimiento(addDays(alumno.fecha || getTodayStr(), 30))}
                  className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-gray-300"
                >
                  +30d consecutivo
                </button>
              </div>
            </div>
            <input
              type="date"
              required
              value={nuevoVencimiento}
              onChange={(e) => setNuevoVencimiento(e.target.value)}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Concepto / Detalle
            </label>
            <input
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej: Mensualidad Taekwondo Noviembre"
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-3 rounded-xl text-xs transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-yellow-400/20 active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Confirmar Pago ${monto}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
