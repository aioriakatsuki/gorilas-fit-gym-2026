import React, { useState, useEffect } from 'react';
import { Actividad, Promo, TipoAlumno } from '../types';
import { X, UserPlus, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { getTodayStr, addDays } from '../utils/date';

interface Props {
  actividades: Actividad[];
  promos: Promo[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    nombre: string;
    clase: string;
    monto: number;
    montoReal: number;
    whats: string;
    fecha: string;
    ingreso: string;
    tipoAlumno: TipoAlumno;
    promoAplicada: string | null;
    cobroInicial: number;
    conceptoInicial: string;
    detallesInicial?: string;
  }) => void;
}

export const NuevoAlumnoModal: React.FC<Props> = ({
  actividades,
  promos,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState('');
  const [whats, setWhats] = useState('');
  const [tipoAlumno, setTipoAlumno] = useState<TipoAlumno>('nuevo');
  const [clase, setClase] = useState(actividades[0]?.nombre || 'TAEKWONDO');
  const [selectedPromoId, setSelectedPromoId] = useState<string>('');
  const [cobrarInscripcion, setCobrarInscripcion] = useState(true);
  const [costoInscripcion, setCostoInscripcion] = useState(400);
  const [costoReinscripcion, setCostoReinscripcion] = useState(400);
  const [montoMensual, setMontoMensual] = useState(400);
  const [fechaVence, setFechaVence] = useState(addDays(getTodayStr(), 30));

  // Sync default monthly amount when activity changes
  useEffect(() => {
    const act = actividades.find((a) => a.nombre === clase);
    if (act) {
      setMontoMensual(act.monto);
    }
  }, [clase, actividades]);

  // Filter promos available for this activity
  const availablePromos = promos.filter(
    (p) => p.actividad === clase || p.actividad === 'TODAS' || (tipoAlumno === 'reingreso' && p.tipo === 'reinscripcion')
  );

  // Calculate pricing breakdown
  const currentPromo = promos.find((p) => p.id.toString() === selectedPromoId);
  const actObj = actividades.find((a) => a.nombre === clase) || { monto: 400 };

  let totalCobroInicial = 0;
  let concepto = 'Inscripción y Mensualidad';
  let detalles = '';
  let montoRegularMensual = actObj.monto;

  if (currentPromo) {
    if (currentPromo.tipo === 'reinscripcion') {
      totalCobroInicial = currentPromo.precio + actObj.monto;
      concepto = `Reinscripción especial + Mensualidad (${currentPromo.nombre})`;
      montoRegularMensual = actObj.monto;
    } else if (currentPromo.tipo === 'paquete') {
      totalCobroInicial = currentPromo.precio;
      concepto = `${currentPromo.nombre} (Paquete completo)`;
      detalles = `Insc $${currentPromo.insc || 0} + Mens $${currentPromo.mens || 0} + Unif $${currentPromo.uniforme || 0} = Promo $${currentPromo.precio}`;
      montoRegularMensual = currentPromo.mens || actObj.monto;
    } else {
      totalCobroInicial = currentPromo.precio;
      concepto = `${currentPromo.nombre}`;
      montoRegularMensual = currentPromo.precio;
    }
  } else {
    // Normal registration without promo
    if (tipoAlumno === 'nuevo') {
      const insc = cobrarInscripcion ? costoInscripcion : 0;
      totalCobroInicial = montoMensual + insc;
      concepto = cobrarInscripcion
        ? `Inscripción ($${insc}) + Primera Mensualidad ($${montoMensual})`
        : `Primera Mensualidad ($${montoMensual})`;
      montoRegularMensual = montoMensual;
    } else if (tipoAlumno === 'reingreso') {
      totalCobroInicial = montoMensual + costoReinscripcion;
      concepto = `Reinscripción ($${costoReinscripcion}) + Mensualidad ($${montoMensual})`;
      montoRegularMensual = montoMensual;
    } else {
      // antiguo
      totalCobroInicial = montoMensual;
      concepto = `Mensualidad ($${montoMensual})`;
      montoRegularMensual = montoMensual;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    onSubmit({
      nombre: nombre.trim(),
      clase,
      monto: actObj.monto,
      montoReal: montoRegularMensual,
      whats: whats.trim(),
      fecha: fechaVence,
      ingreso: getTodayStr(),
      tipoAlumno,
      promoAplicada: currentPromo ? currentPromo.nombre : tipoAlumno === 'reingreso' ? `Reingreso ($${costoReinscripcion})` : null,
      cobroInicial: totalCobroInicial,
      conceptoInicial: concepto,
      detallesInicial: detalles,
    });

    // Reset fields
    setNombre('');
    setWhats('');
    setSelectedPromoId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161b] border border-yellow-400/30 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white">NUEVO ALUMNO</h2>
              <p className="text-xs text-gray-400">Registrar ingreso o reingreso al gimnasio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Maximo Galindo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* WhatsApp & Tipo Alumno */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                placeholder="Ej: 5512345678"
                value={whats}
                onChange={(e) => setWhats(e.target.value)}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Tipo de Alumno
              </label>
              <select
                value={tipoAlumno}
                onChange={(e) => {
                  setTipoAlumno(e.target.value as TipoAlumno);
                  setSelectedPromoId('');
                }}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="nuevo">Nuevo Ingreso</option>
                <option value="reingreso">Reingreso (Regresó)</option>
                <option value="antiguo">Alumno Antiguo</option>
              </select>
            </div>
          </div>

          {/* Actividad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Disciplina / Actividad
              </label>
              <select
                value={clase}
                onChange={(e) => {
                  setClase(e.target.value);
                  setSelectedPromoId('');
                }}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 font-semibold"
              >
                {actividades.map((act) => (
                  <option key={act.nombre} value={act.nombre}>
                    {act.nombre} (${act.monto}/mes)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Fecha 1er Vencimiento
              </label>
              <input
                type="date"
                required
                value={fechaVence}
                onChange={(e) => setFechaVence(e.target.value)}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Promoción aplicada */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Promoción Especial (Opcional)
              </label>
              {selectedPromoId && (
                <button
                  type="button"
                  onClick={() => setSelectedPromoId('')}
                  className="text-[10px] text-gray-400 hover:text-white underline"
                >
                  Quitar promo
                </button>
              )}
            </div>
            <select
              value={selectedPromoId}
              onChange={(e) => setSelectedPromoId(e.target.value)}
              className="w-full bg-[#1c1f26] border border-yellow-400/40 rounded-xl px-3.5 py-2.5 text-sm text-yellow-300 focus:outline-none focus:border-yellow-400"
            >
              <option value="">Sin promo (Cobro normal)</option>
              {availablePromos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} - ${p.precio} ({p.tipo})
                </option>
              ))}
            </select>
          </div>

          {/* Conditional settings if NO promo selected */}
          {!currentPromo && tipoAlumno === 'nuevo' && (
            <div className="bg-[#1c1f26] p-3 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-white">
                  <input
                    type="checkbox"
                    checked={cobrarInscripcion}
                    onChange={(e) => setCobrarInscripcion(e.target.checked)}
                    className="w-4 h-4 rounded text-yellow-400 accent-yellow-400"
                  />
                  <span>Cobrar inscripción de nuevo ingreso</span>
                </label>
                {cobrarInscripcion && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={costoInscripcion}
                      onChange={(e) => setCostoInscripcion(Number(e.target.value))}
                      className="w-16 bg-[#14161b] border border-white/10 rounded px-2 py-0.5 text-right font-bold text-yellow-400"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {!currentPromo && tipoAlumno === 'reingreso' && (
            <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-400" />
                <span className="text-orange-200">Cobro por Reinscripción:</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-400">$</span>
                <input
                  type="number"
                  value={costoReinscripcion}
                  onChange={(e) => setCostoReinscripcion(Number(e.target.value))}
                  className="w-16 bg-[#14161b] border border-orange-400/40 rounded px-2 py-0.5 text-right font-bold text-orange-400"
                />
              </div>
            </div>
          )}

          {/* Summary Box */}
          <div className="bg-[#0e1014] p-3.5 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Concepto a cobrar:</span>
              <span className="font-semibold text-white truncate max-w-[200px]">{concepto}</span>
            </div>
            {detalles && <p className="text-[11px] text-gray-400 mt-1">{detalles}</p>}
            <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold text-yellow-400">Cobro Inicial a Recibir Hoy</span>
                <p className="text-[11px] text-gray-400">Mensualidad recurrente: ${montoRegularMensual}/mes</p>
              </div>
              <p className="text-2xl font-black text-yellow-400">${totalCobroInicial}</p>
            </div>
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
              className="flex-[2] bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-yellow-400/20 active:scale-[0.98]"
            >
              Registrar y Cobrar ${totalCobroInicial}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
