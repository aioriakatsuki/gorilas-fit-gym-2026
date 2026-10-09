import React from 'react';
import { Promo } from '../types';
import { Sparkles, Plus, Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { formatFriendlyDate } from '../utils/date';

interface Props {
  promos: Promo[];
  onNuevaPromo: () => void;
  onEditarPromo: (promo: Promo) => void;
  onBorrarPromo: (id: number) => void;
}

export const PromosTab: React.FC<Props> = ({
  promos,
  onNuevaPromo,
  onEditarPromo,
  onBorrarPromo,
}) => {
  return (
    <div className="space-y-3 pb-24">
      {/* Banner matching user note */}
      <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-3.5 text-xs text-yellow-200 leading-relaxed shadow-sm">
        <div className="flex items-center gap-1.5 font-bold text-yellow-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Gestión de Promociones & Paquetes</span>
        </div>
        Aquí creas, editas y borras todas tus promociones. La de $780 ya la puedes modificar con un toque si te suben el uniforme o material. También las de reingreso y 2x1.
      </div>

      {/* Primary create button */}
      <button
        onClick={onNuevaPromo}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-lg shadow-yellow-400/20 active:scale-[0.99]"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        + CREAR PROMO NUEVA
      </button>

      {/* Promos Cards Grid */}
      <div className="space-y-2.5">
        {promos.length === 0 ? (
          <div className="bg-[#14161b] rounded-2xl p-8 text-center border border-white/5">
            <p className="text-gray-400 text-sm font-semibold">No hay promociones activas</p>
            <p className="text-gray-500 text-xs mt-1">Crea una promo para atraer nuevos alumnos</p>
          </div>
        ) : (
          promos.map((p) => {
            return (
              <div
                key={p.id}
                className="bg-[#161920] border border-white/10 rounded-2xl p-3.5 transition hover:border-yellow-400/40 shadow-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <b className="text-sm font-black text-white">{p.nombre}</b>
                    <p className="text-xs text-gray-300 mt-0.5">{p.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-bold bg-white/10 text-gray-300 px-2 py-0.5 rounded-full uppercase">
                      {p.tipoCobro} · {p.tipo}
                    </span>
                    <span className="text-[9px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-md">
                      {p.actividad}
                    </span>
                  </div>
                </div>

                {/* Pricing summary */}
                <div className="mt-2.5 bg-[#101217] p-2.5 rounded-xl border border-white/5 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Precio de la promo:</span>
                    <span className="text-base font-black text-yellow-400 font-mono">${p.precio} MXN</span>
                  </div>

                  {p.tipo === 'paquete' && (p.insc !== undefined || p.mens !== undefined || p.uniforme !== undefined) && (
                    <div className="text-[11px] text-gray-400 pt-1 border-t border-white/5 flex flex-wrap gap-x-3 gap-y-1">
                      <span>Inscripción: <b className="text-white">${p.insc || 0}</b></span>
                      <span>Mensualidad: <b className="text-white">${p.mens || 0}</b></span>
                      <span className="text-amber-300">Uniforme/Mat: <b>${p.uniforme || 0}</b></span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-[10px] text-gray-500 pt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>Vigente hasta: {formatFriendlyDate(p.hasta)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-2 border-t border-white/5">
                  <button
                    onClick={() => onEditarPromo(p)}
                    className="flex-1 bg-white hover:bg-gray-100 text-black py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    EDITAR PRECIO / DESGLOSE
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar la promoción "${p.nombre}"?`)) {
                        onBorrarPromo(p.id);
                      }
                    }}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    title="Borrar promoción"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    BORRAR
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
