import React, { useState, useEffect } from 'react';
import { Alumno, Actividad } from '../types';
import { X, Edit3, Trash2, UserX, UserCheck, Check } from 'lucide-react';

interface Props {
  alumno: Alumno | null;
  actividades: Actividad[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (alumnoActualizado: Alumno) => void;
  onDelete: (id: number) => void;
  onToggleBaja: (id: number) => void;
}

export const EditarAlumnoModal: React.FC<Props> = ({
  alumno,
  actividades,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onToggleBaja,
}) => {
  const [nombre, setNombre] = useState('');
  const [whats, setWhats] = useState('');
  const [clase, setClase] = useState('');
  const [montoReal, setMontoReal] = useState<number>(400);
  const [fecha, setFecha] = useState('');
  const [promoAplicada, setPromoAplicada] = useState('');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (alumno) {
      setNombre(alumno.nombre);
      setWhats(alumno.whats || '');
      setClase(alumno.clase);
      setMontoReal(alumno.montoReal);
      setFecha(alumno.fecha || '');
      setPromoAplicada(alumno.promoAplicada || '');
      setNotas(alumno.notas || '');
    }
  }, [alumno]);

  if (!isOpen || !alumno) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    onSave({
      ...alumno,
      nombre: nombre.trim(),
      whats: whats.trim(),
      clase,
      montoReal: Number(montoReal),
      fecha,
      promoAplicada: promoAplicada.trim() ? promoAplicada.trim() : null,
      notas: notas.trim() ? notas.trim() : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161b] border border-yellow-400/30 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white">EDITAR ALUMNO</h2>
              <p className="text-xs text-gray-400">Ajustar datos o precio congelado</p>
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
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                value={whats}
                onChange={(e) => setWhats(e.target.value)}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Disciplina
              </label>
              <select
                value={clase}
                onChange={(e) => setClase(e.target.value)}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 font-semibold"
              >
                {actividades.map((a) => (
                  <option key={a.nombre} value={a.nombre}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Mensualidad ($)
              </label>
              <input
                type="number"
                min="0"
                required
                value={montoReal}
                onChange={(e) => setMontoReal(Number(e.target.value))}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-black text-yellow-400 focus:outline-none focus:border-yellow-400"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">Precio acordado</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Vence el:
              </label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Etiqueta de Promo / Nota de precio
            </label>
            <input
              type="text"
              placeholder="Ej: Precio especial $350 o Promo TKD"
              value={promoAplicada}
              onChange={(e) => setPromoAplicada(e.target.value)}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Quick status button */}
          <div className="pt-1 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onToggleBaja(alumno.id);
                onClose();
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                alumno.status === 'baja'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30'
              }`}
            >
              {alumno.status === 'baja' ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" /> Reactivar Alumno
                </>
              ) : (
                <>
                  <UserX className="w-3.5 h-3.5" /> Pasar a Bajas
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm(`¿Estás seguro de eliminar permanentemente a ${alumno.nombre}?`)) {
                  onDelete(alumno.id);
                  onClose();
                }
              }}
              className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold flex items-center gap-1 transition"
              title="Eliminar registro"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2 pt-2 border-t border-white/10">
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
