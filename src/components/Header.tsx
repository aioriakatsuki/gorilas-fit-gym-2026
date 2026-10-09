import React from 'react';
import { Download, Upload, Dumbbell, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/date';

interface Props {
  ingresosTotal: number;
  gastosTotal: number;
  currentTab: string;
  setTab: (tab: 'alumnos' | 'promos' | 'tienda' | 'caja' | 'actividades') => void;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalAlumnos: number;
  totalVencidos: number;
}

export const Header: React.FC<Props> = ({
  ingresosTotal,
  gastosTotal,
  currentTab,
  setTab,
  onExportBackup,
  onImportBackup,
  totalAlumnos,
  totalVencidos,
}) => {
  const ganancia = ingresosTotal - gastosTotal;
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <header className="sticky top-0 z-30 bg-[#0e1014]/95 backdrop-blur-md border-b border-white/10 px-3 py-3 sm:px-4 sm:py-3.5 shadow-xl">
      <div className="max-w-2xl mx-auto">
        {/* Brand & Backup toolbar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl filter drop-shadow">🦍</span>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-wider text-white flex items-center gap-1.5 leading-none">
                GORILAS FIT <span className="bg-yellow-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded-md">V5</span>
              </h1>
              <span className="text-[10px] text-gray-400 font-medium">Gestión de Gimnasio & Artes Marciales</span>
            </div>
          </div>

          {/* Backup buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={onExportBackup}
              title="Descargar copia de seguridad (JSON)"
              className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[10px] font-semibold border border-white/5 flex items-center gap-1 transition"
            >
              <Download className="w-3 h-3 text-yellow-400" />
              <span className="hidden sm:inline">Respaldar</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Restaurar copia de seguridad"
              className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[10px] font-semibold border border-white/5 flex items-center gap-1 transition"
            >
              <Upload className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onImportBackup}
              className="hidden"
            />
          </div>
        </div>

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-3 gap-2 mt-2.5">
          <div className="bg-[#161920] rounded-xl p-2 sm:p-2.5 border border-white/5">
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ingreso</p>
            <p className="text-green-400 font-black text-sm sm:text-base leading-tight mt-0.5">
              ${ingresosTotal}
            </p>
          </div>

          <div className="bg-[#161920] rounded-xl p-2 sm:p-2.5 border border-white/5">
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gasto</p>
            <p className="text-red-400 font-black text-sm sm:text-base leading-tight mt-0.5">
              ${gastosTotal}
            </p>
          </div>

          <div className="bg-yellow-400 rounded-xl p-2 sm:p-2.5 text-black shadow-lg shadow-yellow-400/10">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider opacity-80">Ganancia</p>
            <p className="text-black font-black text-sm sm:text-base leading-tight mt-0.5">
              ${ganancia}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-1.5 mt-2.5 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            onClick={() => setTab('alumnos')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition whitespace-nowrap text-center ${
              currentTab === 'alumnos'
                ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            Alumnos {totalVencidos > 0 ? `(${totalVencidos} ⚠️)` : `(${totalAlumnos})`}
          </button>

          <button
            onClick={() => setTab('promos')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition whitespace-nowrap text-center ${
              currentTab === 'promos'
                ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            Promos
          </button>

          <button
            onClick={() => setTab('tienda')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition whitespace-nowrap text-center ${
              currentTab === 'tienda'
                ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            Tienda
          </button>

          <button
            onClick={() => setTab('caja')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition whitespace-nowrap text-center ${
              currentTab === 'caja'
                ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            Caja
          </button>

          <button
            onClick={() => setTab('actividades')}
            className={`py-2 px-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition whitespace-nowrap text-center ${
              currentTab === 'actividades'
                ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/20'
                : 'bg-white/5 hover:bg-white/10 text-gray-400'
            }`}
            title="Disciplinas y profesores"
          >
            Clases
          </button>
        </nav>
      </div>
    </header>
  );
};
