import React, { useState } from 'react';
import { MovimientoIngreso, MovimientoGasto } from '../types';
import { TrendingUp, TrendingDown, Plus, Download, Trash2, Calendar, FileSpreadsheet } from 'lucide-react';
import { formatFriendlyDate, getTodayStr } from '../utils/date';

interface Props {
  ingresos: MovimientoIngreso[];
  gastos: MovimientoGasto[];
  onAddGasto: () => void;
  onDeleteIngreso: (index: number) => void;
  onDeleteGasto: (index: number) => void;
}

export const CajaTab: React.FC<Props> = ({
  ingresos,
  gastos,
  onAddGasto,
  onDeleteIngreso,
  onDeleteGasto,
}) => {
  const [filtroTiempo, setFiltroTiempo] = useState<'todo' | 'hoy' | 'mes'>('todo');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'ingresos' | 'gastos'>('todos');

  const todayStr = getTodayStr();
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  // Combine and sort movements
  interface UnifiedMovement {
    id: string;
    type: 'ingreso' | 'gasto';
    fecha: string;
    titulo: string;
    subtitulo?: string;
    monto: number;
    originalIndex: number;
  }

  const listIngresos: UnifiedMovement[] = ingresos.map((i, idx) => ({
    id: i.id || `ing-${idx}`,
    type: 'ingreso',
    fecha: i.fecha,
    titulo: `${i.alumno} - ${i.concepto || i.clase}`,
    subtitulo: i.folio ? `Folio #GF-${i.folio}` : i.clase,
    monto: i.monto,
    originalIndex: idx,
  }));

  const listGastos: UnifiedMovement[] = gastos.map((g, idx) => ({
    id: g.id || `gas-${idx}`,
    type: 'gasto',
    fecha: g.fecha,
    titulo: g.concepto,
    subtitulo: g.categoria ? `Categoría: ${g.categoria}` : 'Egreso operativo',
    monto: g.monto,
    originalIndex: idx,
  }));

  let combined = [...listIngresos, ...listGastos].sort((a, b) => {
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  // Apply filters
  if (filtroTiempo === 'hoy') {
    combined = combined.filter((m) => m.fecha === todayStr);
  } else if (filtroTiempo === 'mes') {
    combined = combined.filter((m) => m.fecha.startsWith(currentMonthStr));
  }

  if (filtroTipo === 'ingresos') {
    combined = combined.filter((m) => m.type === 'ingreso');
  } else if (filtroTipo === 'gastos') {
    combined = combined.filter((m) => m.type === 'gasto');
  }

  const subTotalIngresos = combined
    .filter((m) => m.type === 'ingreso')
    .reduce((acc, m) => acc + m.monto, 0);
  const subTotalGastos = combined
    .filter((m) => m.type === 'gasto')
    .reduce((acc, m) => acc + m.monto, 0);

  const exportCSV = () => {
    let csv = 'Tipo,Fecha,Concepto / Alumno,Detalle,Monto\n';
    combined.forEach((m) => {
      csv += `"${m.type.toUpperCase()}","${m.fecha}","${m.titulo.replace(/"/g, '""')}","${(m.subtitulo || '').replace(/"/g, '""')}",${m.monto}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caja_gorilas_fit_${filtroTiempo}_${todayStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3 pb-24">
      {/* Time & Type Controls */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-1 bg-[#161920] p-1 rounded-xl border border-white/5 text-xs">
          <button
            onClick={() => setFiltroTiempo('todo')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              filtroTiempo === 'todo' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Todo
          </button>
          <button
            onClick={() => setFiltroTiempo('mes')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              filtroTiempo === 'mes' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Este Mes
          </button>
          <button
            onClick={() => setFiltroTiempo('hoy')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              filtroTiempo === 'hoy' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Hoy
          </button>
        </div>

        <button
          onClick={exportCSV}
          title="Descargar reporte en Excel (CSV)"
          className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Exportar CSV</span>
        </button>
      </div>

      {/* Primary actions */}
      <div className="flex gap-2">
        <button
          onClick={onAddGasto}
          className="flex-1 bg-red-600/90 hover:bg-red-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Registrar Gasto (Salida)
        </button>
      </div>

      {/* Filter by Type */}
      <div className="flex gap-1.5 text-xs">
        <button
          onClick={() => setFiltroTipo('todos')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition ${
            filtroTipo === 'todos' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          Todos ({combined.length})
        </button>
        <button
          onClick={() => setFiltroTipo('ingresos')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition ${
            filtroTipo === 'ingresos' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400 hover:text-emerald-400'
          }`}
        >
          +${subTotalIngresos} Ingresos
        </button>
        <button
          onClick={() => setFiltroTipo('gastos')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition ${
            filtroTipo === 'gastos' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 hover:text-red-400'
          }`}
        >
          -${subTotalGastos} Gastos
        </button>
      </div>

      {/* Movements ledger */}
      <div className="space-y-2 mt-2">
        {combined.length === 0 ? (
          <div className="bg-[#14161b] rounded-2xl p-8 text-center border border-white/5">
            <p className="text-gray-400 text-xs">Sin movimientos en este periodo</p>
          </div>
        ) : (
          combined.map((m) => {
            const isIngreso = m.type === 'ingreso';

            return (
              <div
                key={m.id}
                className="bg-[#161920] border border-white/5 rounded-2xl p-3 flex justify-between items-center gap-3 transition hover:border-white/10"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isIngreso ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {isIngreso ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>

                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">{m.titulo}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                      <span>{formatFriendlyDate(m.fecha)}</span>
                      {m.subtitulo && (
                        <>
                          <span>•</span>
                          <span className="truncate">{m.subtitulo}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`font-mono font-black text-sm ${
                      isIngreso ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {isIngreso ? `+$${m.monto}` : `-$${m.monto}`}
                  </span>

                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar este movimiento de $${m.monto}?`)) {
                        if (isIngreso) {
                          onDeleteIngreso(m.originalIndex);
                        } else {
                          onDeleteGasto(m.originalIndex);
                        }
                      }
                    }}
                    className="text-gray-500 hover:text-red-400 p-1 rounded-lg hover:bg-white/5 transition"
                    title="Eliminar registro"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
