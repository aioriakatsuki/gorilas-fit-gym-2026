import React, { useState } from 'react';
import { Alumno } from '../types';
import { X, Award, PlusCircle, Check } from 'lucide-react';

interface Props {
  alumno: Alumno | null;
  isOpen: boolean;
  onClose: () => void;
  onCobrarExtra: (data: {
    alumnoId: number;
    concepto: string;
    total: number;
    abonado: number;
  }) => void;
}

export const CobrarExtraModal: React.FC<Props> = ({ alumno, isOpen, onClose, onCobrarExtra }) => {
  const [concepto, setConcepto] = useState('Examen de Cinta');
  const [conceptoCustom, setConceptoCustom] = useState('');
  const [total, setTotal] = useState<number>(600);
  const [abonado, setAbonado] = useState<number>(600);

  if (!isOpen || !alumno) return null;

  const conceptosPredefinidos = [
    'Examen de Cinta TKD',
    'Torneo / Competencia',
    'Uniforme Oficial',
    'Equipo de Protección / Peto',
    'Seminario Especial',
    'Otro concepto',
  ];

  const conceptoFinal = concepto === 'Otro concepto' ? conceptoCustom : concepto;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptoFinal.trim() || total <= 0 || abonado <= 0) return;

    onCobrarExtra({
      alumnoId: alumno.id,
      concepto: conceptoFinal.trim(),
      total,
      abonado,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161b] border border-yellow-400/30 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white">COBRO EXTRA / EVENTO</h2>
              <p className="text-xs text-gray-400">{alumno.nombre}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {alumno.extras && alumno.extras.length > 0 && (
          <div className="my-3 p-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
            <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wide mb-1">
              Extras anteriores registrados:
            </p>
            <div className="space-y-1 text-xs text-gray-300">
              {alumno.extras.map((ex, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{ex.concepto}:</span>
                  <span className="font-mono font-bold text-white">
                    ${ex.abonado} / ${ex.total} {ex.abonado >= ex.total ? '✓ Liquidado' : `(Resta $${ex.total - ex.abonado})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Concepto del Cobro
            </label>
            <select
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
            >
              {conceptosPredefinidos.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {concepto === 'Otro concepto' && (
            <div>
              <input
                type="text"
                placeholder="Escribe el concepto específico"
                required
                value={conceptoCustom}
                onChange={(e) => setConceptoCustom(e.target.value)}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Costo Total ($)
              </label>
              <input
                type="number"
                min="1"
                required
                value={total}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTotal(val);
                  if (abonado > val) setAbonado(val);
                }}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Abona Hoy ($)
              </label>
              <input
                type="number"
                min="1"
                max={total}
                required
                value={abonado}
                onChange={(e) => setAbonado(Number(e.target.value))}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-black text-yellow-400 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="bg-[#181b22] p-3 rounded-xl border border-white/5 text-xs text-gray-300 flex justify-between items-center">
            <span>Resta por pagar:</span>
            <span className={`font-bold font-mono ${total - abonado > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              ${Math.max(0, total - abonado)} MXN {total - abonado === 0 && '(Liquidado completo)'}
            </span>
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
              Cobrar Abono ${abonado}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
