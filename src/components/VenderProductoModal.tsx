import React, { useState, useEffect } from 'react';
import { Producto, Alumno } from '../types';
import { X, ShoppingBag, Check } from 'lucide-react';

interface Props {
  producto: Producto | null;
  alumnos: Alumno[];
  isOpen: boolean;
  onClose: () => void;
  onVender: (data: {
    productoIndex: number;
    cliente: string;
    telefono?: string;
    cantidad: number;
    total: number;
    ganancia: number;
  }) => void;
  productoIndex: number;
}

export const VenderProductoModal: React.FC<Props> = ({
  producto,
  alumnos,
  isOpen,
  onClose,
  onVender,
  productoIndex,
}) => {
  const [clienteTipo, setClienteTipo] = useState<'alumno' | 'mostrador'>('alumno');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<string>('');
  const [nombreMostrador, setNombreMostrador] = useState<string>('Cliente de mostrador');
  const [telefonoMostrador, setTelefonoMostrador] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);

  useEffect(() => {
    if (alumnos.length > 0 && !alumnoSeleccionado) {
      setAlumnoSeleccionado(alumnos[0].nombre);
    }
  }, [alumnos, alumnoSeleccionado]);

  if (!isOpen || !producto) return null;

  const total = producto.venta * cantidad;
  const ganancia = (producto.venta - producto.costo) * cantidad;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cantidad <= 0 || cantidad > producto.stock) return;

    let finalCliente = '';
    let finalPhone = '';

    if (clienteTipo === 'alumno') {
      finalCliente = alumnoSeleccionado || 'Alumno';
      const alObj = alumnos.find((a) => a.nombre === alumnoSeleccionado);
      if (alObj) finalPhone = alObj.whats;
    } else {
      finalCliente = nombreMostrador.trim() || 'Cliente de mostrador';
      finalPhone = telefonoMostrador.trim();
    }

    onVender({
      productoIndex,
      cliente: finalCliente,
      telefono: finalPhone,
      cantidad,
      total,
      ganancia,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161b] border border-yellow-400/30 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white">VENDER ARTÍCULO</h2>
              <p className="text-xs text-gray-400">{producto.nombre}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product specs */}
        <div className="bg-[#1b1e25] rounded-2xl p-3.5 my-3 border border-white/5 flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-white text-sm">{producto.nombre}</p>
            <p className="text-gray-400">
              Precio venta: <span className="font-bold text-yellow-400">${producto.venta}</span> · Costo: ${producto.costo}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                producto.stock <= 3 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-gray-300'
              }`}
            >
              Stock: {producto.stock} uds
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Tipo de cliente */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#1c1f26] rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setClienteTipo('alumno')}
              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                clienteTipo === 'alumno' ? 'bg-yellow-400 text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Alumno Registrado
            </button>
            <button
              type="button"
              onClick={() => setClienteTipo('mostrador')}
              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                clienteTipo === 'mostrador' ? 'bg-yellow-400 text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Cliente Mostrador
            </button>
          </div>

          {clienteTipo === 'alumno' ? (
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Seleccionar Alumno
              </label>
              <select
                value={alumnoSeleccionado}
                onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
              >
                {alumnos.map((a) => (
                  <option key={a.id} value={a.nombre}>
                    {a.nombre} ({a.clase})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Nombre Cliente
                </label>
                <input
                  type="text"
                  required
                  value={nombreMostrador}
                  onChange={(e) => setNombreMostrador(e.target.value)}
                  placeholder="Ej: Juan Perez"
                  className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  WhatsApp (Opcional)
                </label>
                <input
                  type="tel"
                  value={telefonoMostrador}
                  onChange={(e) => setTelefonoMostrador(e.target.value)}
                  placeholder="Ej: 5512345678"
                  className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Cantidad a Vender
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="w-10 h-10 bg-[#1c1f26] rounded-xl text-lg font-bold hover:bg-white/10 transition border border-white/10"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={producto.stock}
                value={cantidad}
                onChange={(e) => setCantidad(Math.min(producto.stock, Math.max(1, Number(e.target.value))))}
                className="flex-1 bg-[#1c1f26] border border-white/10 rounded-xl py-2 text-center text-lg font-black text-white focus:outline-none focus:border-yellow-400"
              />
              <button
                type="button"
                onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                className="w-10 h-10 bg-[#1c1f26] rounded-xl text-lg font-bold hover:bg-white/10 transition border border-white/10"
              >
                +
              </button>
            </div>
          </div>

          {/* Financial summary */}
          <div className="bg-[#0e1014] p-3 rounded-2xl border border-white/10 space-y-1 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Ganancia neta calculada:</span>
              <span className="text-emerald-400 font-bold">+${ganancia} MXN</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="font-bold text-white uppercase text-[11px]">Total a Cobrar:</span>
              <span className="text-2xl font-black text-yellow-400">${total} MXN</span>
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
              disabled={producto.stock <= 0}
              className="flex-[2] bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-yellow-400/20 active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Cobrar Venta ${total}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
