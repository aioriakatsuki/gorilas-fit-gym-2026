import React, { useState } from 'react';
import { Alumno, Actividad } from '../types';
import { diasRestantes, formatFriendlyDate } from '../utils/date';
import {
  UserPlus,
  Search,
  MessageCircle,
  Edit2,
  DollarSign,
  PlusCircle,
  History,
  AlertTriangle,
  UserX,
  UserCheck,
} from 'lucide-react';

interface Props {
  alumnos: Alumno[];
  bajas: Alumno[];
  actividades: Actividad[];
  onNuevoAlumno: () => void;
  onCobrar: (alumno: Alumno) => void;
  onCobrarExtra: (alumno: Alumno) => void;
  onEditar: (alumno: Alumno) => void;
  onVerHistorial: (alumno: Alumno) => void;
  onReactivarBaja: (alumno: Alumno) => void;
}

export const AlumnosTab: React.FC<Props> = ({
  alumnos,
  bajas,
  actividades,
  onNuevoAlumno,
  onCobrar,
  onCobrarExtra,
  onEditar,
  onVerHistorial,
  onReactivarBaja,
}) => {
  const [filtro, setFiltro] = useState<'todos' | 'aldia' | 'porvencer' | 'vencidos' | 'bajas'>('todos');
  const [filtroClase, setFiltroClase] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState<string>('');

  // Calculate counts for badges
  const vencidosCount = alumnos.filter((a) => diasRestantes(a.fecha) < 0).length;
  const porVencerCount = alumnos.filter((a) => {
    const d = diasRestantes(a.fecha);
    return d >= 0 && d <= 3;
  }).length;
  const alDiaCount = alumnos.filter((a) => diasRestantes(a.fecha) > 3).length;

  // Filter list
  const getListaFiltrada = () => {
    let list = filtro === 'bajas' ? bajas : alumnos;

    if (filtro === 'vencidos') {
      list = list.filter((a) => diasRestantes(a.fecha) < 0);
    } else if (filtro === 'porvencer') {
      list = list.filter((a) => {
        const d = diasRestantes(a.fecha);
        return d >= 0 && d <= 3;
      });
    } else if (filtro === 'aldia') {
      list = list.filter((a) => diasRestantes(a.fecha) > 3);
    }

    if (filtroClase !== 'todas') {
      list = list.filter((a) => a.clase === filtroClase);
    }

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      list = list.filter(
        (a) => a.nombre.toLowerCase().includes(q) || (a.whats && a.whats.includes(q))
      );
    }

    return list;
  };

  const listaFiltrada = getListaFiltrada();

  const handleOpenWhatsApp = (alumno: Alumno) => {
    let clean = alumno.whats.replace(/\D/g, '');
    if (clean.length === 10) clean = '52' + clean;
    const d = diasRestantes(alumno.fecha);

    let msg = '';
    if (d < 0) {
      msg = `¡Hola ${alumno.nombre}! 🦍 Te recordamos de Gorilas Fit que tu mensualidad de ${alumno.clase} venció el ${alumno.fecha} ($${alumno.montoReal} MXN). ¡Te esperamos para entrenar! 💪`;
    } else {
      msg = `¡Hola ${alumno.nombre}! 🦍 Saludos de tu gimnasio Gorilas Fit. ¿Cómo va tu entrenamiento en ${alumno.clase}? ¡Nos vemos en clase! 🔥`;
    }
    const url = clean ? `https://wa.me/${clean}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-3 pb-24">
      {/* Search and class select */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#161920] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={filtroClase}
          onChange={(e) => setFiltroClase(e.target.value)}
          className="bg-[#161920] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
        >
          <option value="todas">Todas las Clases</option>
          {actividades.map((act) => (
            <option key={act.nombre} value={act.nombre}>
              {act.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        <button
          onClick={() => setFiltro('todos')}
          className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
            filtro === 'todos' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          Todos ({alumnos.length})
        </button>

        <button
          onClick={() => setFiltro('aldia')}
          className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
            filtro === 'aldia'
              ? 'bg-emerald-500 text-black'
              : 'bg-white/5 text-gray-400 hover:text-emerald-400 border border-white/5'
          }`}
        >
          Al Día ({alDiaCount})
        </button>

        <button
          onClick={() => setFiltro('porvencer')}
          className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
            filtro === 'porvencer'
              ? 'bg-orange-500 text-white'
              : 'bg-white/5 text-gray-400 hover:text-orange-400 border border-white/5'
          }`}
        >
          Por Vencer ({porVencerCount})
        </button>

        <button
          onClick={() => setFiltro('vencidos')}
          className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
            filtro === 'vencidos'
              ? 'bg-red-500 text-white'
              : 'bg-white/5 text-gray-400 hover:text-red-400 border border-white/5'
          }`}
        >
          Vencidos ({vencidosCount})
        </button>

        <button
          onClick={() => setFiltro('bajas')}
          className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
            filtro === 'bajas'
              ? 'bg-white/30 text-white'
              : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          Bajas ({bajas.length})
        </button>
      </div>

      {/* Big Action: + NUEVO ALUMNO */}
      <button
        onClick={onNuevoAlumno}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-lg shadow-yellow-400/20 active:scale-[0.99]"
      >
        <UserPlus className="w-4 h-4 stroke-[3]" />
        + NUEVO ALUMNO
      </button>

      {/* Student List */}
      <div className="space-y-2.5 mt-2">
        {listaFiltrada.length === 0 ? (
          <div className="bg-[#14161b] rounded-2xl p-8 text-center border border-white/5">
            <p className="text-gray-400 text-sm font-semibold">No se encontraron alumnos</p>
            <p className="text-gray-500 text-xs mt-1">
              {busqueda ? 'Intenta otra búsqueda' : 'Haz clic en + NUEVO ALUMNO para comenzar'}
            </p>
          </div>
        ) : (
          listaFiltrada.map((a) => {
            const d = diasRestantes(a.fecha);
            const isBaja = a.status === 'baja' || filtro === 'bajas';

            // Status color matching user's spec:
            // d < 0 ? red : d <= 3 ? orange : green
            const badgeColor = isBaja
              ? 'bg-gray-600/30 text-gray-400 border-gray-600/40'
              : d < 0
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : d <= 3
              ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

            const badgeText = isBaja
              ? 'BAJA'
              : d < 0
              ? `Vencido (${Math.abs(d)}d)`
              : d === 0
              ? 'Vence HOY'
              : `Vence en ${d}d`;

            const tipoBadge =
              a.tipoAlumno === 'nuevo'
                ? 'NUEVO'
                : a.tipoAlumno === 'reingreso'
                ? 'REINGRESO'
                : 'ANTIGUO';

            return (
              <div
                key={a.id}
                className="bg-[#161920] border border-white/10 rounded-2xl p-3.5 transition hover:border-yellow-400/40 shadow-sm"
              >
                {/* Header info */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <b className="text-sm font-black text-white">{a.nombre}</b>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                        {tipoBadge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 flex-wrap">
                      <span className="font-bold text-white font-mono">${a.montoReal}</span>
                      <span>·</span>
                      <span>{a.fecha ? `Vence ${formatFriendlyDate(a.fecha)}` : 'Sin fecha'}</span>
                    </div>
                  </div>

                  {/* Discipline & Status Badges */}
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {badgeText}
                    </span>
                    <span className="text-[9px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-md">
                      {a.clase}
                    </span>
                  </div>
                </div>

                {/* Promo Applied notice */}
                {a.promoAplicada && (
                  <div className="mt-1.5 text-[10px] text-yellow-300 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-2 py-1">
                    ⭐ Promo: {a.promoAplicada}
                  </div>
                )}

                {/* Extras list if any */}
                {a.extras && a.extras.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2 mt-2 text-[10px] space-y-1">
                    {a.extras.map((e, idx) => (
                      <div key={idx} className="flex justify-between items-center text-yellow-200">
                        <span>• {e.concepto}:</span>
                        <span className="font-mono font-bold">
                          ${e.abonado} / ${e.total}{' '}
                          {e.abonado >= e.total ? '(Listo)' : `(Debe $${e.total - e.abonado})`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons Toolbar */}
                <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-white/5">
                  {!isBaja ? (
                    <>
                      <button
                        onClick={() => onCobrar(a)}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shadow active:scale-[0.98] flex items-center justify-center gap-1"
                      >
                        <DollarSign className="w-3.5 h-3.5 stroke-[3]" />
                        COBRAR
                      </button>

                      <button
                        onClick={() => onCobrarExtra(a)}
                        className="bg-white/10 hover:bg-white/15 text-white px-3 py-2 rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                        title="Cobrar extra (examen, torneo, uniforme)"
                      >
                        <PlusCircle className="w-3 h-3 text-yellow-400" />
                        EXTRA
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onReactivarBaja(a)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      Reactivar Alumno
                    </button>
                  )}

                  <button
                    onClick={() => onEditar(a)}
                    className="bg-white/10 hover:bg-white/15 text-white px-2.5 py-2 rounded-xl text-[11px] transition"
                    title="Editar alumno o cuota"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-300" />
                  </button>

                  <button
                    onClick={() => onVerHistorial(a)}
                    className="bg-white/10 hover:bg-white/15 text-white px-2.5 py-2 rounded-xl text-[11px] transition"
                    title="Historial de pagos"
                  >
                    <History className="w-3.5 h-3.5 text-gray-300" />
                  </button>

                  {a.whats && (
                    <button
                      onClick={() => handleOpenWhatsApp(a)}
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-2.5 py-2 rounded-xl text-[11px] transition"
                      title="Enviar WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
