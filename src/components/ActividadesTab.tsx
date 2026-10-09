import React, { useState } from 'react';
import { Actividad } from '../types';
import { Dumbbell, Plus, Edit2, Trash2, Check, User } from 'lucide-react';

interface Props {
  actividades: Actividad[];
  onSaveActividades: (actividades: Actividad[]) => void;
}

export const ActividadesTab: React.FC<Props> = ({ actividades, onSaveActividades }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);

  // New form fields
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'mensual' | 'porClase'>('mensual');
  const [monto, setMonto] = useState<number>(400);
  const [profe, setProfe] = useState('');
  const [porcentaje, setPorcentaje] = useState<number>(60);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const nueva: Actividad = {
      nombre: nombre.trim().toUpperCase(),
      tipo,
      monto: Number(monto),
      profe: profe.trim() ? profe.trim() : undefined,
      porcentaje: tipo === 'porClase' ? Number(porcentaje) : undefined,
    };

    onSaveActividades([...actividades, nueva]);
    setShowNew(false);
    setNombre('');
    setProfe('');
    setMonto(400);
  };

  const handleUpdate = (idx: number, act: Actividad) => {
    const copy = [...actividades];
    copy[idx] = act;
    onSaveActividades(copy);
    setEditingIndex(null);
  };

  const handleDelete = (idx: number) => {
    if (confirm(`¿Eliminar la disciplina "${actividades[idx].nombre}"?`)) {
      const copy = actividades.filter((_, i) => i !== idx);
      onSaveActividades(copy);
    }
  };

  return (
    <div className="space-y-3 pb-24">
      <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-3.5 text-xs text-yellow-200">
        <div className="flex items-center gap-1.5 font-bold text-yellow-400 mb-1">
          <Dumbbell className="w-4 h-4" />
          <span>Disciplinas & Profesores</span>
        </div>
        Configura las artes marciales y clases impartidas en Gorilas Fit. Puedes definir cobro mensual o por clase con comisión para el instructor (ej. Zumba con Profe Luna al 60%).
      </div>

      <button
        onClick={() => setShowNew(true)}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-lg shadow-yellow-400/20 active:scale-[0.99]"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        + AGREGAR NUEVA DISCIPLINA
      </button>

      {/* New Activity modal/form inline */}
      {showNew && (
        <form
          onSubmit={handleAddNew}
          className="bg-[#181b22] border border-yellow-400/40 rounded-2xl p-4 space-y-3 animate-in fade-in"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-yellow-400">NUEVA ACTIVIDAD</h3>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="text-gray-400 hover:text-white text-xs"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Nombre</label>
              <input
                type="text"
                required
                placeholder="Ej: KICKBOXING"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-[#121418] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Modalidad</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as 'mensual' | 'porClase')}
                className="w-full bg-[#121418] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-yellow-400 focus:outline-none"
              >
                <option value="mensual">Mensualidad</option>
                <option value="porClase">Por Clase</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">
                {tipo === 'mensual' ? 'Precio Mensual' : 'Precio Clase'}
              </label>
              <input
                type="number"
                required
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
                className="w-full bg-[#121418] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-black text-yellow-400 focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Instructor</label>
              <input
                type="text"
                placeholder="Ej: Profe Luna"
                value={profe}
                onChange={(e) => setProfe(e.target.value)}
                className="w-full bg-[#121418] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">% Profe</label>
              <input
                type="number"
                placeholder="60%"
                value={porcentaje}
                onChange={(e) => setPorcentaje(Number(e.target.value))}
                className="w-full bg-[#121418] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 rounded-xl text-xs font-black uppercase tracking-wider"
          >
            Guardar Disciplina
          </button>
        </form>
      )}

      {/* Activities list */}
      <div className="space-y-2">
        {actividades.map((act, idx) => {
          const isEditing = editingIndex === idx;

          return (
            <div
              key={act.nombre + idx}
              className="bg-[#161920] border border-white/10 rounded-2xl p-3.5 flex justify-between items-center transition hover:border-yellow-400/40"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-white">{act.nombre}</span>
                  <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full uppercase">
                    {act.tipo === 'porClase' ? 'Por Clase' : 'Mensual'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <span className="text-yellow-400 font-black font-mono">${act.monto} MXN</span>
                  {act.profe && (
                    <span>
                      · Profe: <b className="text-gray-200">{act.profe}</b>
                      {act.porcentaje ? ` (${act.porcentaje}% comisión)` : ''}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const nuevoMonto = prompt(`Nuevo precio para ${act.nombre}:`, act.monto.toString());
                    if (nuevoMonto) {
                      handleUpdate(idx, { ...act, monto: Number(nuevoMonto) });
                    }
                  }}
                  className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs transition"
                  title="Cambiar precio"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {actividades.length > 1 && (
                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs transition"
                    title="Eliminar disciplina"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
