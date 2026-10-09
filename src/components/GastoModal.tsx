import React, { useState } from 'react';
import { X, TrendingDown, Check } from 'lucide-react';
import { getTodayStr } from '../utils/date';
import { MovimientoGasto } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddGasto: (gasto: MovimientoGasto) => void;
}

export const GastoModal: React.FC<Props> = ({ isOpen, onClose, onAddGasto }) => {
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState<number>(100);
  const [fecha, setFecha] = useState(getTodayStr());
  const [categoria, setCategoria] = useState<MovimientoGasto['categoria']>('servicios');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concepto.trim() || monto <= 0) return;

    onAddGasto({
      id: 'gas-' + Date.now(),
      fecha,
      concepto: concepto.trim(),
      monto: Number(monto),
      categoria,
    });
    onClose();
    setConcepto('');
    setMonto(100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161b] border border-red-500/30 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white">REGISTRAR GASTO</h2>
              <p className="text-xs text-gray-400">Salida de efectivo o egreso</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Concepto del Gasto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Renta local, Pago Profe Luna, Luz, Bolsas..."
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Monto ($ MXN) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
                className="w-full bg-[#1c1f26] border border-red-500/30 rounded-xl px-3.5 py-2.5 text-sm font-black text-red-400 focus:outline-none focus:border-red-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Fecha
              </label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as MovimientoGasto['categoria'])}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-400"
            >
              <option value="renta">Renta del Gimnasio</option>
              <option value="profesores">Pago a Profesores / Instructores</option>
              <option value="servicios">Servicios (Luz, Agua, Internet)</option>
              <option value="mercancia">Compra de Mercancía / Tienda</option>
              <option value="mantenimiento">Mantenimiento y Limpieza</option>
              <option value="otro">Otro Gasto Operativo</option>
            </select>
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
              className="flex-[2] bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/20 active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Guardar Gasto ${monto}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
