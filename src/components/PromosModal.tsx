import React, { useState, useEffect } from 'react';
import { Promo, Actividad, TipoCobro, TipoPromo } from '../types';
import { X, Sparkles, Check } from 'lucide-react';
import { addDays, getTodayStr } from '../utils/date';

interface Props {
  promo: Promo | null;
  actividades: Actividad[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: Promo) => void;
}

export const PromosModal: React.FC<Props> = ({
  promo,
  actividades,
  isOpen,
  onClose,
  onSave,
}) => {
  const [nombre, setNombre] = useState('');
  const [tipoCobro, setTipoCobro] = useState<TipoCobro>('mensual');
  const [tipo, setTipo] = useState<TipoPromo>('paquete');
  const [actividad, setActividad] = useState('TAEKWONDO');
  const [precio, setPrecio] = useState<number>(780);
  const [insc, setInsc] = useState<number>(400);
  const [mens, setMens] = useState<number>(400);
  const [uniforme, setUniforme] = useState<number>(450);
  const [desc, setDesc] = useState('');
  const [hasta, setHasta] = useState(addDays(getTodayStr(), 90));

  useEffect(() => {
    if (promo) {
      setNombre(promo.nombre);
      setTipoCobro(promo.tipoCobro);
      setTipo(promo.tipo);
      setActividad(promo.actividad);
      setPrecio(promo.precio);
      setInsc(promo.insc || 0);
      setMens(promo.mens || 0);
      setUniforme(promo.uniforme || 0);
      setDesc(promo.desc || '');
      setHasta(promo.hasta);
    } else {
      setNombre('');
      setTipoCobro('mensual');
      setTipo('paquete');
      setActividad(actividades[0]?.nombre || 'TAEKWONDO');
      setPrecio(780);
      setInsc(400);
      setMens(400);
      setUniforme(450);
      setDesc('Inscripción $400 + Mens $400 + Uniforme $450 = $1250 pero promo $780');
      setHasta(addDays(getTodayStr(), 90));
    }
  }, [promo, actividades, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const nuevaPromo: Promo = {
      id: promo ? promo.id : Date.now(),
      nombre: nombre.trim(),
      tipoCobro,
      tipo,
      actividad,
      precio: Number(precio),
      insc: tipo === 'paquete' ? Number(insc) : undefined,
      mens: tipo === 'paquete' ? Number(mens) : undefined,
      uniforme: tipo === 'paquete' ? Number(uniforme) : undefined,
      desc: desc.trim(),
      hasta,
      editable: true,
    };

    onSave(nuevaPromo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161b] border border-yellow-400/30 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white">
                {promo ? 'EDITAR PROMOCIÓN' : 'CREAR PROMOCIÓN'}
              </h2>
              <p className="text-xs text-gray-400">Configura paquetes, descuentos o reingresos</p>
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
              Nombre de la Promoción *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Promo Nuevo Ingreso TKD, 2x1 Zumba..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Tipo de Promoción
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoPromo)}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="paquete">Paquete (Insc + Mens + Equipo)</option>
                <option value="2x1">2x1 Promoción</option>
                <option value="reinscripcion">Reingreso / Reinscripción</option>
                <option value="descuento">Descuento Directo</option>
                <option value="clases">Pase por Clases</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Tipo de Cobro
              </label>
              <select
                value={tipoCobro}
                onChange={(e) => setTipoCobro(e.target.value as TipoCobro)}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="mensual">Mensual</option>
                <option value="porClase">Por Clase</option>
                <option value="unico">Pago Único</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Aplica a la Actividad
              </label>
              <select
                value={actividad}
                onChange={(e) => setActividad(e.target.value)}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 font-semibold"
              >
                <option value="TODAS">TODAS LAS DISCIPLINAS</option>
                {actividades.map((a) => (
                  <option key={a.nombre} value={a.nombre}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Precio Promo Final ($)
              </label>
              <input
                type="number"
                min="0"
                required
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                className="w-full bg-[#1c1f26] border border-yellow-400/50 rounded-xl px-3.5 py-2.5 text-sm font-black text-yellow-400 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Detailed breakdown for paquete */}
          {tipo === 'paquete' && (
            <div className="bg-[#1c1f26] p-3.5 rounded-2xl border border-white/10 space-y-2.5">
              <p className="text-[11px] font-bold text-yellow-400 uppercase tracking-wide">
                Desglose del Paquete (Ajustable por si sube material):
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase">Inscripción</label>
                  <input
                    type="number"
                    value={insc}
                    onChange={(e) => setInsc(Number(e.target.value))}
                    className="w-full bg-[#14161b] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase">Mensualidad</label>
                  <input
                    type="number"
                    value={mens}
                    onChange={(e) => setMens(Number(e.target.value))}
                    className="w-full bg-[#14161b] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase">Uniforme/Material</label>
                  <input
                    type="number"
                    value={uniforme}
                    onChange={(e) => setUniforme(Number(e.target.value))}
                    className="w-full bg-[#14161b] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-bold text-amber-300"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-400">
                Valor real sin promo: <span className="text-gray-300 font-mono font-bold">${insc + mens + uniforme}</span> →
                Ahorro del alumno: <span className="text-emerald-400 font-bold">${Math.max(0, insc + mens + uniforme - precio)}</span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Descripción Corta
            </label>
            <input
              type="text"
              placeholder="Ej: Inscripción $400 + Mens $400 + Uniforme $450 = Promo $780"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Vigencia Hasta
            </label>
            <input
              type="date"
              required
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
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
              Guardar Promoción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
