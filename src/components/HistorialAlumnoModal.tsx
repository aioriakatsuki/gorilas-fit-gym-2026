import React from 'react';
import { Alumno, MovimientoIngreso } from '../types';
import { X, User, MessageCircle, Calendar, DollarSign, Award, Clock } from 'lucide-react';
import { formatFriendlyDate, diasRestantes } from '../utils/date';

interface Props {
  alumno: Alumno | null;
  ingresos: MovimientoIngreso[];
  isOpen: boolean;
  onClose: () => void;
  onCobrar: (alumno: Alumno) => void;
}

export const HistorialAlumnoModal: React.FC<Props> = ({
  alumno,
  ingresos,
  isOpen,
  onClose,
  onCobrar,
}) => {
  if (!isOpen || !alumno) return null;

  const dias = diasRestantes(alumno.fecha);
  const studentIngresos = ingresos.filter((i) => i.alumno.toLowerCase() === alumno.nombre.toLowerCase());

  const handleSendWhatsAppReminder = () => {
    let cleanPhone = alumno.whats.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '52' + cleanPhone;

    let mensaje = '';
    if (dias < 0) {
      mensaje = `¡Hola ${alumno.nombre}! 🦍 Te saludamos de Gorilas Fit para recordarte cordialmente que tu mensualidad de ${alumno.clase} venció el ${alumno.fecha} (hace ${Math.abs(dias)} días). Cuota: $${alumno.montoReal} MXN. ¡Te esperamos hoy en tu entrenamiento! 💪`;
    } else if (dias <= 3) {
      mensaje = `¡Hola ${alumno.nombre}! 🦍 Te saludamos de Gorilas Fit para recordarte que tu mensualidad de ${alumno.clase} vence pronto (${alumno.fecha}). Cuota: $${alumno.montoReal} MXN. ¡A seguir con todo en el entrenamiento! 🔥`;
    } else {
      mensaje = `¡Hola ${alumno.nombre}! 🦍 Te saludamos de Gorilas Fit. Tu mensualidad de ${alumno.clase} está activa y al día hasta el ${alumno.fecha}. ¡Nos vemos en el tatami! 🥋`;
    }

    const encoded = encodeURIComponent(mensaje);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161b] border border-yellow-400/30 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white">{alumno.nombre}</h2>
              <p className="text-xs text-gray-400">
                {alumno.clase} · Ingreso: {formatFriendlyDate(alumno.ingreso)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status card */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#1c1f26] p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Vencimiento</span>
            <span className="text-base font-black text-white">{formatFriendlyDate(alumno.fecha)}</span>
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                dias < 0 ? 'bg-red-500/20 text-red-400' : dias <= 3 ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {dias < 0 ? `Vencido (${Math.abs(dias)}d)` : `Vence en ${dias} días`}
            </span>
          </div>

          <div className="bg-[#1c1f26] p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Mensualidad Pactada</span>
            <span className="text-base font-black text-yellow-400">${alumno.montoReal} MXN</span>
            <span className="text-[10px] text-gray-400 block mt-1">
              {alumno.promoAplicada ? `Promo: ${alumno.promoAplicada}` : 'Tarifa estándar'}
            </span>
          </div>
        </div>

        {/* Extras section */}
        {alumno.extras && alumno.extras.length > 0 && (
          <div className="mt-4 bg-[#1c1f26] p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold uppercase mb-2">
              <Award className="w-4 h-4" /> Extras Registrados
            </div>
            <div className="space-y-2">
              {alumno.extras.map((ex, idx) => (
                <div key={idx} className="bg-[#14161b] p-2.5 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">{ex.concepto}</span>
                    <span className="block text-[10px] text-gray-400">Total: ${ex.total}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400">${ex.abonado} abonado</span>
                    <span className="block text-[10px] text-amber-300">
                      {ex.abonado >= ex.total ? 'Liquidado' : `Resta $${ex.total - ex.abonado}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment history */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-gray-300 text-xs font-bold uppercase mb-2">
            <Clock className="w-4 h-4 text-gray-400" /> Historial de Cobros ({studentIngresos.length})
          </div>
          <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
            {studentIngresos.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No hay pagos registrados aún</p>
            ) : (
              studentIngresos.map((ing, idx) => (
                <div key={idx} className="bg-[#1c1f26] px-3 py-2 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="text-white font-medium">{ing.concepto || ing.clase}</span>
                    <span className="block text-[10px] text-gray-400">{formatFriendlyDate(ing.fecha)}</span>
                  </div>
                  <span className="font-mono font-black text-emerald-400">+${ing.monto}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="mt-5 space-y-2">
          <div className="flex gap-2">
            {alumno.whats && (
              <button
                onClick={handleSendWhatsAppReminder}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp {dias < 0 ? 'Recordar Pago' : 'Contactar'}
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onCobrar(alumno);
              }}
              className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition"
            >
              <DollarSign className="w-4 h-4 stroke-[3]" />
              Cobrar Mensualidad
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-white/5 hover:bg-white/10 text-gray-300 py-2 rounded-xl text-xs font-semibold"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};
