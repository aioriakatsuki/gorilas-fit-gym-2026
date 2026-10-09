import React, { useRef } from 'react';
import { ReciboData } from '../types';
import { Download, MessageCircle, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface Props {
  recibo: ReciboData | null;
  onClose: () => void;
}

export const TicketModal: React.FC<Props> = ({ recibo, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!recibo) return null;

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // High resolution canvas for sharp mobile/WhatsApp viewing
    const width = 760;
    const height = 980;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0f1013';
    ctx.fillRect(0, 0, width, height);

    // Inner card background
    ctx.fillStyle = '#17191e';
    ctx.roundRect ? ctx.roundRect(30, 30, width - 60, height - 60, 24) : ctx.fillRect(30, 30, width - 60, height - 60);
    ctx.fill();

    // Border glow / accent
    ctx.strokeStyle = '#2d3340';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Top gold accent bar
    ctx.fillStyle = '#FACC15';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(30, 30, width - 60, 10, [24, 24, 0, 0]);
      ctx.fill();
    } else {
      ctx.fillRect(30, 30, width - 60, 10);
    }

    // Logo & Header
    ctx.font = '54px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🦍', width / 2, 115);

    ctx.font = '900 36px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('GORILAS FIT', width / 2, 170);

    ctx.font = '700 13px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillStyle = '#FACC15';
    ctx.fillText('CENTRO DE ENTRENAMIENTO & ARTES MARCIALES', width / 2, 195);

    ctx.font = '600 12px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('COMPROBANTE DIGITAL OFICIAL DE PAGO', width / 2, 215);

    // Decorative dotted line
    ctx.strokeStyle = '#334155';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(60, 240);
    ctx.lineTo(width - 60, 240);
    ctx.stroke();
    ctx.setLineDash([]);

    // Info grid
    ctx.textAlign = 'left';
    ctx.font = '600 13px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('FOLIO:', 70, 280);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 16px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(`#GF-${recibo.folio}`, 70, 305);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 13px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('FECHA DE EMISIÓN:', width - 70, 280);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 15px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(`${recibo.fecha}`, width - 70, 305);

    // Student section
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 12px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('ALUMNO / CLIENTE', 70, 355);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '900 22px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(recibo.alumno.toUpperCase(), 70, 385);

    if (recibo.telefono) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 13px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillText(`WhatsApp: ${recibo.telefono}`, 70, 410);
    }

    // Concept box
    ctx.fillStyle = '#20242c';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(70, 435, width - 140, 105, 14);
      ctx.fill();
    } else {
      ctx.fillRect(70, 435, width - 140, 105);
    }

    ctx.fillStyle = '#FACC15';
    ctx.font = '800 14px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('DISCIPLINA / CONCEPTO:', 90, 468);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 17px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(`${recibo.clase} - ${recibo.concepto || 'Mensualidad regular'}`, 90, 500);

    if (recibo.detalles) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 12px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillText(recibo.detalles.substring(0, 75), 90, 523);
    }

    // Next Expiration block
    ctx.fillStyle = '#1c2d20';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(70, 560, width - 140, 75, 14);
      ctx.fill();
    } else {
      ctx.fillRect(70, 560, width - 140, 75);
    }

    ctx.fillStyle = '#4ade80';
    ctx.font = '700 12px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PRÓXIMO VENCIMIENTO DE MENSUALIDAD', width / 2, 590);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 22px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(recibo.proxVence || 'No aplica / Pago único', width / 2, 620);

    // Total section
    ctx.fillStyle = '#FACC15';
    ctx.font = '800 13px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('TOTAL PAGADO', width / 2, 680);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(`$${recibo.monto} MXN`, width / 2, 735);

    ctx.fillStyle = '#22c55e';
    ctx.font = '700 14px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('✓ PAGO CONFIRMADO Y REGISTRADO', width / 2, 770);

    // Footer note
    ctx.fillStyle = '#64748B';
    ctx.font = '500 12px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('¡Gracias por tu disciplina y formar parte de la manada Gorilas Fit!', width / 2, 850);
    ctx.fillText('Conserva este comprobante para cualquier aclaración.', width / 2, 875);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Recibo-GF-${recibo.folio}-${recibo.alumno.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShareWhatsApp = () => {
    let cleanPhone = (recibo.telefono || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '52' + cleanPhone; // Mexico country code default
    }

    const message = `🦍 *COMPROBANTE DIGITAL GORILAS FIT* 🦍\n\n` +
      `¡Hola ${recibo.alumno}! Se ha registrado exitosamente tu pago:\n\n` +
      `📄 *Folio:* #GF-${recibo.folio}\n` +
      `📅 *Fecha:* ${recibo.fecha}\n` +
      `🥊 *Concepto:* ${recibo.clase} - ${recibo.concepto || 'Mensualidad'}\n` +
      `💰 *Monto Pagado:* $${recibo.monto} MXN\n` +
      (recibo.proxVence ? `🗓️ *Próximo Vencimiento:* ${recibo.proxVence}\n\n` : '\n') +
      `¡Gracias por tu compromiso y esfuerzo diario en Gorilas Fit! 💪🔥`;

    const encoded = encodeURIComponent(message);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#121418] border border-yellow-400/30 text-white rounded-3xl p-5 sm:p-7 w-full max-w-[380px] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          title="Cerrar recibo"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400/10 border-2 border-yellow-400/30 rounded-2xl flex items-center justify-center mx-auto mb-2 text-3xl shadow-inner">
            🦍
          </div>
          <h2 className="text-xl font-black tracking-wider text-white">GORILAS FIT</h2>
          <p className="text-[10px] tracking-widest uppercase font-bold text-yellow-400">Comprobante Digital Oficial</p>
        </div>

        {/* Receipt Content */}
        <div className="mt-4 pt-3 border-t border-dashed border-white/15 space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-gray-400">
            <span>Folio:</span>
            <span className="font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded">#GF-{recibo.folio}</span>
          </div>

          <div className="flex justify-between items-center text-gray-400">
            <span>Fecha:</span>
            <span className="font-medium text-white">{recibo.fecha}</span>
          </div>

          <div className="bg-[#181b22] p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400">Alumno</span>
            <p className="text-sm font-extrabold text-white leading-tight">{recibo.alumno}</p>
            {recibo.telefono && (
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <span>WhatsApp:</span> <span className="font-mono text-gray-300">{recibo.telefono}</span>
              </p>
            )}
          </div>

          <div className="bg-[#181b22] p-3 rounded-xl border border-white/5 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-yellow-400">Concepto / Clase</span>
              <span className="text-[11px] font-bold text-white">{recibo.clase}</span>
            </div>
            <p className="text-xs text-gray-200">{recibo.concepto || 'Mensualidad'}</p>
            {recibo.detalles && <p className="text-[10px] text-gray-400 italic">{recibo.detalles}</p>}
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 text-center">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Próximo Vencimiento</p>
            <p className="text-sm font-black text-white mt-0.5">{recibo.proxVence || 'No aplica'}</p>
          </div>

          <div className="border-t border-dashed border-white/15 pt-3 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Total Pagado</p>
            <p className="text-3xl font-black text-yellow-400 tracking-tight">${recibo.monto} <span className="text-xs text-gray-400 font-semibold">MXN</span></p>
            <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-1">
              <CheckCircle className="w-3.5 h-3.5" /> Pago Recibido
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleDownloadImage}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition shadow-lg shadow-yellow-400/20 active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Descargar Imagen PNG (para WhatsApp)
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            Enviar Mensaje por WhatsApp
          </button>

          <button
            onClick={onClose}
            className="w-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white py-2 rounded-xl text-xs transition font-semibold"
          >
            Listo / Cerrar Recibo
          </button>
        </div>

        {/* Hidden Canvas for generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
