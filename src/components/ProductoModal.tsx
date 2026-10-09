import React, { useState, useEffect } from 'react';
import { Producto } from '../types';
import { X, PackagePlus, Check } from 'lucide-react';

interface Props {
  producto: Producto | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (prod: Producto) => void;
}

export const ProductoModal: React.FC<Props> = ({ producto, isOpen, onClose, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [costo, setCosto] = useState<number>(20);
  const [venta, setVenta] = useState<number>(40);
  const [stock, setStock] = useState<number>(10);
  const [categoria, setCategoria] = useState('Equipo');

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setCosto(producto.costo);
      setVenta(producto.venta);
      setStock(producto.stock);
      setCategoria(producto.categoria || 'Equipo');
    } else {
      setNombre('');
      setCosto(20);
      setVenta(40);
      setStock(10);
      setCategoria('Equipo');
    }
  }, [producto, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    onSave({
      nombre: nombre.trim(),
      costo: Number(costo),
      venta: Number(venta),
      stock: Number(stock),
      categoria,
    });
    onClose();
  };

  const margen = venta > 0 ? Math.round(((venta - costo) / venta) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#14161b] border border-yellow-400/30 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white">
                {producto ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
              </h2>
              <p className="text-xs text-gray-400">Inventario y tienda de Gorilas Fit</p>
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
              Nombre del Producto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Agua mineral, Guantes, Proteína..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="Bebidas">Bebidas e Hidratación</option>
              <option value="Equipo">Equipo de Entrenamiento</option>
              <option value="Indumentaria">Indumentaria / Uniformes</option>
              <option value="Suplementos">Suplementos & Snacks</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Costo Proveedor ($)
              </label>
              <input
                type="number"
                min="0"
                required
                value={costo}
                onChange={(e) => setCosto(Number(e.target.value))}
                className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Precio de Venta ($)
              </label>
              <input
                type="number"
                min="0"
                required
                value={venta}
                onChange={(e) => setVenta(Number(e.target.value))}
                className="w-full bg-[#1c1f26] border border-yellow-400/40 rounded-xl px-3.5 py-2.5 text-sm font-black text-yellow-400 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Stock en Existencia (Unidades)
            </label>
            <input
              type="number"
              min="0"
              required
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full bg-[#1c1f26] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="bg-[#181b22] p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
            <span className="text-gray-400">Ganancia por unidad:</span>
            <span className="text-emerald-400 font-bold">
              +${venta - costo} MXN ({margen}% margen)
            </span>
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
              Guardar en Tienda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
